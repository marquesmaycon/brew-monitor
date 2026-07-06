using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Beers;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationRecords;
using BrewMonitor.Api.Enums;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Services;

public class FermentationRecordService(AppDbContext context) : IFermentationRecordService
{
  private const string SortDirectionDescending = "desc";
  private const decimal TemperatureTolerancePercentage = 0.05m;
  private const decimal PhTolerance = 0.2m;
  private const decimal ExtractTolerancePercentage = 0.05m;

  public async Task<PaginatedResult<FermentationRecordResponse>> GetAllAsync(
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
      .Where(record =>
        (
          string.IsNullOrWhiteSpace(search)
          || EF.Functions.ILike(record.BatchNumber, $"%{search}%")
        )
        && (!hasClassificationFilter || record.Classification == classificationFilter));

    query = ApplySorting(query, sortBy, sortDirection);

    var total = await query.CountAsync();
    var records = await query
      .Skip((page - 1) * limit)
      .Take(limit)
      .Select(record => new FermentationRecordResponse
      {
        Id = record.Id,
        RegisteredAt = record.RegisteredAt,
        BeerId = record.BeerId,
        Beer = new FermentationRecordBeerResponse
        {
          Id = record.Beer.Id,
          Name = record.Beer.Name,
          Style = record.Beer.Style,
        },
        TankId = record.TankId,
        Tank = new FermentationRecordTankResponse
        {
          Id = record.Tank.Id,
          Name = record.Tank.Name,
          CapacityLiters = record.Tank.CapacityLiters,
        },
        BatchNumber = record.BatchNumber,
        Temperature = record.Temperature,
        Ph = record.Ph,
        Extract = record.Extract,
        Notes = record.Notes,
        Classification = record.Classification,
        CreatedAt = record.CreatedAt,
        UpdatedAt = record.UpdatedAt
      })
      .ToListAsync();

    return new PaginatedResult<FermentationRecordResponse>
    {
      Data = records,
      Meta = new PaginationMeta
      {
        Total = total
      }
    };
  }

  public Task<PaginatedResult<FermentationRecordResponse>> GetByBeerAsync(
    Guid beerId,
    int page,
    int limit,
    string? search,
    string? sortBy,
    string? sortDirection,
    string? classification
  )
  {
    search = search?.Trim();

    return GetAssociatedAsync(
      context.FermentationRecords
        .Where(record => record.BeerId == beerId)
        .Where(record =>
          string.IsNullOrWhiteSpace(search)
          || EF.Functions.ILike(record.BatchNumber, $"%{search}%")
          || EF.Functions.ILike(record.Tank.Name, $"%{search}%")),
      page,
      limit,
      sortBy,
      sortDirection,
      classification
    );
  }

  public Task<PaginatedResult<FermentationRecordResponse>> GetByTankAsync(
    Guid tankId,
    int page,
    int limit,
    string? search,
    string? sortBy,
    string? sortDirection,
    string? classification
  )
  {
    search = search?.Trim();

    return GetAssociatedAsync(
      context.FermentationRecords
        .Where(record => record.TankId == tankId)
        .Where(record =>
          string.IsNullOrWhiteSpace(search)
          || EF.Functions.ILike(record.BatchNumber, $"%{search}%")
          || EF.Functions.ILike(record.Beer.Name, $"%{search}%")
          || EF.Functions.ILike(record.Beer.Style, $"%{search}%")),
      page,
      limit,
      sortBy,
      sortDirection,
      classification
    );
  }

  /// <summary>
  /// Busca registros associados. Define a ordenação padrão sortDirection para "desc" 
  /// (mais recentes primeiro) especificamente para os endpoints de beer e tank.
  /// </summary>
  private static async Task<PaginatedResult<FermentationRecordResponse>> GetAssociatedAsync(
    IQueryable<FermentationRecord> query,
    int page,
    int limit,
    string? sortBy,
    string? sortDirection,
    string? classification
  )
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);
    sortBy = sortBy?.Trim();
    sortDirection = sortDirection?.Trim();
    sortDirection ??= SortDirectionDescending;
    var hasClassificationFilter = TryParseClassification(
      classification,
      out var classificationFilter
    );

    query = query
      .AsNoTracking()
      .Where(record =>
        !hasClassificationFilter || record.Classification == classificationFilter);

    var orderedQuery = ApplySorting(query, sortBy, sortDirection);

    var total = await orderedQuery.CountAsync();
    var records = await orderedQuery
      .Skip((page - 1) * limit)
      .Take(limit)
      .Select(record => new FermentationRecordResponse
      {
        Id = record.Id,
        RegisteredAt = record.RegisteredAt,
        BeerId = record.BeerId,
        Beer = new FermentationRecordBeerResponse
        {
          Id = record.Beer.Id,
          Name = record.Beer.Name,
          Style = record.Beer.Style,
        },
        TankId = record.TankId,
        Tank = new FermentationRecordTankResponse
        {
          Id = record.Tank.Id,
          Name = record.Tank.Name,
          CapacityLiters = record.Tank.CapacityLiters,
        },
        BatchNumber = record.BatchNumber,
        Temperature = record.Temperature,
        Ph = record.Ph,
        Extract = record.Extract,
        Notes = record.Notes,
        Classification = record.Classification,
        CreatedAt = record.CreatedAt,
        UpdatedAt = record.UpdatedAt
      })
      .ToListAsync();

    return new PaginatedResult<FermentationRecordResponse>
    {
      Data = records,
      Meta = new PaginationMeta
      {
        Total = total
      }
    };
  }

  /// <summary>
  /// Aplica ordenação à query. A ordenação por batchNumber sempre usa ThenByDescending(RegisteredAt) 
  /// como ordenação secundária estável, independente se a direção principal é ascendente ou descendente.
  /// </summary>
  private static IQueryable<FermentationRecord> ApplySorting(
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
      "batchnumber" => isDescending
        ? query.OrderByDescending(record => record.BatchNumber).ThenByDescending(record => record.RegisteredAt)
        : query.OrderBy(record => record.BatchNumber).ThenByDescending(record => record.RegisteredAt),
      _ => isDescending
        ? query.OrderByDescending(record => record.RegisteredAt)
        : query.OrderBy(record => record.RegisteredAt)
    };
  }

  /// <summary>
  /// Tenta converter uma string para classificação. Caso o valor do filtro seja inválido,
  /// retorna false e o filtro é ignorado silenciosamente na consulta (sem retornar erro HTTP 400).
  /// </summary>
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

  public Task<FermentationRecordResponse?> GetByIdAsync(Guid id)
  {
    return context.FermentationRecords
      .Where(record => record.Id == id)
      .Select(record => new FermentationRecordResponse
      {
        Id = record.Id,
        RegisteredAt = record.RegisteredAt,
        BeerId = record.BeerId,
        Beer = new FermentationRecordBeerResponse
        {
          Id = record.Beer.Id,
          Name = record.Beer.Name,
          Style = record.Beer.Style,
          FermentationParameter = record.Beer.FermentationParameter == null
            ? null
            : new BeerFermentationParameterResponse
            {
              MinTemperature = record.Beer.FermentationParameter.MinTemperature,
              MaxTemperature = record.Beer.FermentationParameter.MaxTemperature,
              MinPh = record.Beer.FermentationParameter.MinPh,
              MaxPh = record.Beer.FermentationParameter.MaxPh,
              MinExtract = record.Beer.FermentationParameter.MinExtract,
              MaxExtract = record.Beer.FermentationParameter.MaxExtract
            }
        },
        TankId = record.TankId,
        Tank = new FermentationRecordTankResponse
        {
          Id = record.Tank.Id,
          Name = record.Tank.Name,
          CapacityLiters = record.Tank.CapacityLiters
        },
        BatchNumber = record.BatchNumber,
        Temperature = record.Temperature,
        Ph = record.Ph,
        Extract = record.Extract,
        Notes = record.Notes,
        Classification = record.Classification,
        CreatedAt = record.CreatedAt,
        UpdatedAt = record.UpdatedAt
      })
      .FirstOrDefaultAsync();
  }

  /// <summary>
  /// Cria um registro de fermentação. A classificação de conformidade é calculada no servidor 
  /// com base nos parâmetros ideais; o cliente nunca envia ou define o campo Classification.
  /// </summary>
  public async Task<FermentationRecord> CreateAsync(FermentationRecord record)
  {
    record.Id = record.Id == Guid.Empty ? Guid.NewGuid() : record.Id;
    record.BatchNumber = record.BatchNumber.Trim();
    record.Classification = await ClassifyAsync(record);
    record.CreatedAt = DateTime.UtcNow;
    record.UpdatedAt = null;

    context.FermentationRecords.Add(record);
    await context.SaveChangesAsync();

    return record;
  }

  public async Task<FermentationRecord?> UpdateAsync(Guid id, FermentationRecord record)
  {
    var existingRecord = await context.FermentationRecords.FindAsync(id);

    if (existingRecord is null)
    {
      return null;
    }

    existingRecord.RegisteredAt = record.RegisteredAt;
    existingRecord.BeerId = record.BeerId;
    existingRecord.TankId = record.TankId;
    existingRecord.BatchNumber = record.BatchNumber.Trim();
    existingRecord.Temperature = record.Temperature;
    existingRecord.Ph = record.Ph;
    existingRecord.Extract = record.Extract;
    existingRecord.Notes = record.Notes;
    existingRecord.Classification = await ClassifyAsync(existingRecord);
    existingRecord.UpdatedAt = DateTime.UtcNow;

    await context.SaveChangesAsync();

    return existingRecord;
  }

  public async Task<bool> DeleteAsync(Guid id)
  {
    var record = await context.FermentationRecords.FindAsync(id);

    if (record is null)
    {
      return false;
    }

    context.FermentationRecords.Remove(record);
    await context.SaveChangesAsync();

    return true;
  }

  public Task<bool> BeerExistsAsync(Guid beerId)
  {
    return context.Beers.AnyAsync(beer => beer.Id == beerId);
  }

  public Task<bool> TankExistsAsync(Guid tankId)
  {
    return context.Tanks.AnyAsync(tank => tank.Id == tankId);
  }

  /// <summary>
  /// Classifica um registro de fermentação com base nos parâmetros ideais cadastrados para a cerveja.
  /// 
  /// Regras de Negócio de Tolerância:
  /// - DENTRO DO PADRÃO: Todos os parâmetros (Temperatura, pH e Extrato) estão estritamente dentro das faixas ideais.
  /// - ALERTA (ATTENTION): Pelo menos um parâmetro violou a faixa ideal, mas está dentro dos limites de tolerância:
  ///   * Temperatura: tolerância de 5% (relativa)
  ///   * Extrato: tolerância de 5% (relativa)
  ///   * pH: tolerância de 0.2 (absoluta)
  /// - FORA DO PADRÃO: Algum parâmetro excedeu até mesmo a margem de tolerância tolerada ou se não houver parâmetros cadastrados.
  /// </summary>
  private async Task<FermentationRecordClassification> ClassifyAsync(FermentationRecord record)
  {
    var parameter = await context.FermentationParameters
      .FirstOrDefaultAsync(currentParameter => currentParameter.BeerId == record.BeerId);

    if (parameter is null)
    {
      return FermentationRecordClassification.OutOfStandard;
    }

    if (
      IsWithinRange(record.Temperature, parameter.MinTemperature, parameter.MaxTemperature)
      && IsWithinRange(record.Ph, parameter.MinPh, parameter.MaxPh)
      && IsWithinRange(record.Extract, parameter.MinExtract, parameter.MaxExtract)
    )
    {
      return FermentationRecordClassification.WithinStandard;
    }

    if (
      IsWithinPercentageTolerance(
        record.Temperature,
        parameter.MinTemperature,
        parameter.MaxTemperature,
        TemperatureTolerancePercentage
      )
      && IsWithinAbsoluteTolerance(record.Ph, parameter.MinPh, parameter.MaxPh, PhTolerance)
      && IsWithinPercentageTolerance(
        record.Extract,
        parameter.MinExtract,
        parameter.MaxExtract,
        ExtractTolerancePercentage
      )
    )
    {
      return FermentationRecordClassification.Attention;
    }

    return FermentationRecordClassification.OutOfStandard;
  }

  private static bool IsWithinRange(decimal value, decimal min, decimal max)
  {
    return value >= min && value <= max;
  }

  /// <summary>
  /// Expande a faixa ideal por uma tolerância absoluta.
  /// O pH usa tolerância absoluta (±0,2) e não percentual porque a escala de pH é logarítmica,
  /// o que faria uma tolerância percentual variar fisicamente em diferentes níveis de acidez.
  /// </summary>
  private static bool IsWithinAbsoluteTolerance(decimal value, decimal min, decimal max, decimal tolerance)
  {
    return value >= min - tolerance && value <= max + tolerance;
  }

/// <summary>
/// Expande a faixa ideal por uma tolerância percentual relativa a cada limite.
/// Exemplo: faixa 18–22°C com 5% → 17,1–23,1°C.
/// Math.Abs(min) garante comportamento correto quando min é negativo (ex.: lager a -1°C).
/// </summary>
  private static bool IsWithinPercentageTolerance(decimal value, decimal min, decimal max, decimal tolerancePercentage)
  {
    var lowerBound = min - Math.Abs(min * tolerancePercentage);
    var upperBound = max + Math.Abs(max * tolerancePercentage);

    return value >= lowerBound && value <= upperBound;
  }
}
