using BrewMonitor.Api.Data;
using BrewMonitor.Api.Enums;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Services;

public class FermentationRecordService(AppDbContext context) : IFermentationRecordService
{
  private const decimal TemperatureTolerancePercentage = 0.05m;
  private const decimal PhTolerance = 0.2m;
  private const decimal ExtractTolerancePercentage = 0.05m;

  public Task<List<FermentationRecord>> GetAllAsync()
  {
    return context.FermentationRecords
      .OrderByDescending(record => record.RegisteredAt)
      .ToListAsync();
  }

  public Task<FermentationRecord?> GetByIdAsync(Guid id)
  {
    return context.FermentationRecords.FindAsync(id).AsTask();
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
