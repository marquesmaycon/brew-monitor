using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Batches;
using BrewMonitor.Api.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Services;

public class BatchService(AppDbContext context) : IBatchService
{
  public async Task<PaginatedResult<BatchResponse>> GetAllAsync(int page, int limit)
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);

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
      })
      .OrderBy(batch => batch.BatchNumber);

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

  public async Task<BatchOverviewResponse?> GetOverviewAsync(string batchNumber)
  {
    var batch = await context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == batchNumber)
      .GroupBy(record => record.BatchNumber)
      .Select(group => new BatchOverviewResponse
      {
        BatchNumber = group.Key,
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

  public async Task<PaginatedResult<BatchFermentationRecordResponse>?> GetFermentationRecordsAsync(
    string batchNumber,
    int page,
    int limit
  )
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);

    var query = context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == batchNumber)
      .OrderBy(record => record.RegisteredAt)
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

    var total = await query.CountAsync();

    if (total == 0)
    {
      return null;
    }

    var records = await query
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
}
