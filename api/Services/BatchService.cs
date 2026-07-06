using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Batches;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Enums;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Services;

public class BatchService(AppDbContext context) : IBatchService
{
  private const string SortDirectionDescending = "desc";

  /// <summary>
  /// Agrupa os registros por número de lote para retornar uma listagem consolidada de lotes.
  /// Projeta os dados coletando a primeira cerveja associada cronologicamente e o contador de registros.
  /// </summary>
  public async Task<PaginatedResult<BatchResponse>> GetAllAsync(
    int page,
    int limit,
    string? search,
    string? sortBy,
    string? sortDirection
  )
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);
    search = search?.Trim();
    sortBy = sortBy?.Trim();
    sortDirection = sortDirection?.Trim();

    var query = context.FermentationRecords
      .AsNoTracking()
      .GroupBy(record => record.BatchNumber)
      .Select(group => new BatchResponse
      {
        BatchNumber = group.Key,
        BeerId = group
          .OrderBy(record => record.RegisteredAt)
          .Select(record => record.BeerId)
          .First(),
        BeerName = group
          .OrderBy(record => record.RegisteredAt)
          .Select(record => record.Beer.Name)
          .First(),
        BeerStyle = group
          .OrderBy(record => record.RegisteredAt)
          .Select(record => record.Beer.Style)
          .First(),
        FermentationRecordCount = group.Count()
      });

    query = query.Where(batch =>
      string.IsNullOrWhiteSpace(search)
      || EF.Functions.ILike(batch.BatchNumber, $"%{search}%")
      || EF.Functions.ILike(batch.BeerName, $"%{search}%")
      || EF.Functions.ILike(batch.BeerStyle, $"%{search}%"));

    query = ApplyBatchSorting(query, sortBy, sortDirection);

    var total = await query.CountAsync();
    var batches = await query
      .Skip((page - 1) * limit)
      .Take(limit)
      .ToListAsync();

    return new PaginatedResult<BatchResponse>
    {
      Data = batches,
      Meta = new PaginationMeta
      {
        Total = total
      }
    };
  }

  /// <summary>
  /// Obtém a visão geral do lote realizando 3 consultas separadas: dados básicos do lote (cabeçalho),
  /// séries temporais das medições e o histograma de contagem por classificação.
  /// </summary>
  public async Task<BatchOverviewResponse?> GetOverviewAsync(string batchNumber)
  {
    var batch = await context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == batchNumber)
      .GroupBy(record => record.BatchNumber)
      .Select(group => new BatchOverviewResponse
      {
        BatchNumber = group.Key,
        BeerId = group
          .OrderBy(record => record.RegisteredAt)
          .Select(record => record.BeerId)
          .First(),
        BeerName = group
          .OrderBy(record => record.RegisteredAt)
          .Select(record => record.Beer.Name)
          .First(),
        BeerStyle = group
          .OrderBy(record => record.RegisteredAt)
          .Select(record => record.Beer.Style)
          .First()
      })
      .FirstOrDefaultAsync();

    if (batch is null)
    {
      return null;
    }

    batch.MetricPoints = await context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == batchNumber)
      .OrderBy(record => record.RegisteredAt)
      .Select(record => new BatchFermentationMetricPointResponse
      {
        RegisteredAt = record.RegisteredAt,
        Temperature = record.Temperature,
        Ph = record.Ph,
        Extract = record.Extract
      })
      .ToListAsync();

    batch.ClassificationCounts = await context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == batchNumber)
      .GroupBy(record => record.Classification)
      .Select(group => new BatchClassificationCountResponse
      {
        Classification = group.Key,
        Count = group.Count()
      })
      .ToListAsync();

    return batch;
  }

  /// <summary>
  /// Verifica a existência do lote antes de aplicar filtros. Retorna null (HTTP 404) se o lote não existir,
  /// ou uma página vazia se o lote existe mas nenhum registro atende aos filtros de busca e classificação.
  /// </summary>
  public async Task<PaginatedResult<BatchFermentationRecordResponse>?> GetFermentationRecordsAsync(
    string batchNumber,
    int page,
    int limit,
    string? search,
    string? sortBy,
    string? sortDirection,
    string? classification
  )
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);
    search = search?.Trim();
    sortBy = sortBy?.Trim();
    sortDirection = sortDirection?.Trim();
    var hasClassificationFilter = TryParseClassification(
      classification,
      out var classificationFilter
    );

    var query = context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == batchNumber);

    var batchExists = await query.AnyAsync();

    if (!batchExists)
    {
      return null;
    }

    query = query
      .Where(record =>
        (
          string.IsNullOrWhiteSpace(search)
          || EF.Functions.ILike(record.Tank.Name, $"%{search}%")
          || (record.Notes != null && EF.Functions.ILike(record.Notes, $"%{search}%"))
        )
        && (!hasClassificationFilter || record.Classification == classificationFilter));

    query = ApplyBatchFermentationRecordSorting(query, sortBy, sortDirection);

    var projectedQuery = query
      .Select(record => new BatchFermentationRecordResponse
      {
        Id = record.Id,
        RegisteredAt = record.RegisteredAt,
        TankId = record.TankId,
        TankName = record.Tank.Name,
        TankCapacityLiters = record.Tank.CapacityLiters,
        Temperature = record.Temperature,
        Ph = record.Ph,
        Extract = record.Extract,
        Notes = record.Notes,
        Classification = record.Classification
      });

    var total = await projectedQuery.CountAsync();

    var records = await projectedQuery
      .Skip((page - 1) * limit)
      .Take(limit)
      .ToListAsync();

    return new PaginatedResult<BatchFermentationRecordResponse>
    {
      Data = records,
      Meta = new PaginationMeta
      {
        Total = total
      }
    };
  }

  /// <summary>
  /// Aplica a ordenação na query projetada do DTO BatchResponse, e não diretamente nas entidades do Entity Framework.
  /// </summary>
  private static IQueryable<BatchResponse> ApplyBatchSorting(
    IQueryable<BatchResponse> query,
    string? sortBy,
    string? sortDirection
  )
  {
    var isDescending = string.Equals(
      sortDirection,
      SortDirectionDescending,
      StringComparison.OrdinalIgnoreCase
    );

    return sortBy?.ToLowerInvariant() switch
    {
      "beername" => isDescending
        ? query.OrderByDescending(batch => batch.BeerName).ThenBy(batch => batch.BatchNumber)
        : query.OrderBy(batch => batch.BeerName).ThenBy(batch => batch.BatchNumber),
      "fermentationrecordcount" => isDescending
        ? query.OrderByDescending(batch => batch.FermentationRecordCount).ThenBy(batch => batch.BatchNumber)
        : query.OrderBy(batch => batch.FermentationRecordCount).ThenBy(batch => batch.BatchNumber),
      _ => isDescending
        ? query.OrderByDescending(batch => batch.BatchNumber)
        : query.OrderBy(batch => batch.BatchNumber)
    };
  }

  private static IQueryable<FermentationRecord> ApplyBatchFermentationRecordSorting(
    IQueryable<FermentationRecord> query,
    string? sortBy,
    string? sortDirection
  )
  {
    var isDescending = string.Equals(
      sortDirection,
      SortDirectionDescending,
      StringComparison.OrdinalIgnoreCase
    );

    return sortBy?.ToLowerInvariant() switch
    {
      "tankname" => isDescending
        ? query.OrderByDescending(record => record.Tank.Name).ThenBy(record => record.RegisteredAt)
        : query.OrderBy(record => record.Tank.Name).ThenBy(record => record.RegisteredAt),
      "temperature" => isDescending
        ? query.OrderByDescending(record => record.Temperature).ThenBy(record => record.RegisteredAt)
        : query.OrderBy(record => record.Temperature).ThenBy(record => record.RegisteredAt),
      "ph" => isDescending
        ? query.OrderByDescending(record => record.Ph).ThenBy(record => record.RegisteredAt)
        : query.OrderBy(record => record.Ph).ThenBy(record => record.RegisteredAt),
      "extract" => isDescending
        ? query.OrderByDescending(record => record.Extract).ThenBy(record => record.RegisteredAt)
        : query.OrderBy(record => record.Extract).ThenBy(record => record.RegisteredAt),
      _ => isDescending
        ? query.OrderByDescending(record => record.RegisteredAt)
        : query.OrderBy(record => record.RegisteredAt)
    };
  }

  private static bool TryParseClassification(
    string? value,
    out FermentationRecordClassification classification
  )
  {
    classification = default;

    return value?.Trim().ToUpperInvariant() switch
    {
      "WITHIN_STANDARD" => SetClassification(
        FermentationRecordClassification.WithinStandard,
        out classification
      ),
      "ATTENTION" => SetClassification(
        FermentationRecordClassification.Attention,
        out classification
      ),
      "OUT_OF_STANDARD" => SetClassification(
        FermentationRecordClassification.OutOfStandard,
        out classification
      ),
      _ => false
    };
  }

  private static bool SetClassification(
    FermentationRecordClassification value,
    out FermentationRecordClassification classification
  )
  {
    classification = value;

    return true;
  }
}
