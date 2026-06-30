using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Batches;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/batches")]
public class BatchesController(AppDbContext context) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<List<BatchResponse>>> GetAll()
  {
    var batches = await context.FermentationRecords
      .AsNoTracking()
      .GroupBy(record => record.BatchNumber)
      .Select(group => new BatchResponse
      {
        BatchNumber = group.Key,
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
      .OrderBy(batch => batch.BatchNumber)
      .ToListAsync();

    return Ok(batches);
  }

  [HttpGet("{batchNumber}")]
  public async Task<ActionResult<BatchDetailResponse>> GetByBatchNumber(string batchNumber)
  {
    var normalizedBatchNumber = Uri.UnescapeDataString(batchNumber).Trim();

    if (string.IsNullOrWhiteSpace(normalizedBatchNumber))
    {
      return BadRequest("Batch number is required.");
    }

    var records = await context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == normalizedBatchNumber)
      .OrderBy(record => record.RegisteredAt)
      .Select(record => new BatchFermentationRecordResponse
      {
        Id = record.Id,
        RegisteredAt = record.RegisteredAt,
        TankName = record.Tank.Name,
        TankCapacityLiters = record.Tank.CapacityLiters,
        Temperature = record.Temperature,
        Ph = record.Ph,
        Extract = record.Extract,
        Notes = record.Notes,
        Classification = record.Classification
      })
      .ToListAsync();

    if (records.Count == 0)
    {
      return NotFound("Batch does not exist.");
    }

    var batch = await context.FermentationRecords
      .AsNoTracking()
      .Where(record => record.BatchNumber == normalizedBatchNumber)
      .OrderBy(record => record.RegisteredAt)
      .Select(record => new BatchDetailResponse
      {
        BatchNumber = record.BatchNumber,
        BeerName = record.Beer.Name,
        BeerStyle = record.Beer.Style
      })
      .FirstAsync();

    batch.FermentationRecordCount = records.Count;
    batch.FermentationRecords = records;

    return Ok(batch);
  }
}
