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
  private const decimal TemperatureTolerancePercentage = 0.05m;
  private const decimal PhTolerance = 0.2m;
  private const decimal ExtractTolerancePercentage = 0.05m;

  public async Task<PaginatedResult<FermentationRecordResponse>> GetAllAsync(int page, int limit)
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);

    var query = context.FermentationRecords
      .OrderByDescending(record => record.RegisteredAt);

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

  private static bool IsWithinAbsoluteTolerance(decimal value, decimal min, decimal max, decimal tolerance)
  {
    return value >= min - tolerance && value <= max + tolerance;
  }

  private static bool IsWithinPercentageTolerance(decimal value, decimal min, decimal max, decimal tolerancePercentage)
  {
    var lowerBound = min - Math.Abs(min * tolerancePercentage);
    var upperBound = max + Math.Abs(max * tolerancePercentage);

    return value >= lowerBound && value <= upperBound;
  }
}
