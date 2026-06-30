using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Batches;
using BrewMonitor.Api.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/batches")]
public class BatchesController(AppDbContext context) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<PaginatedResult<BatchResponse>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
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

    return Ok(new PaginatedResult<BatchResponse>
    {
      Data = batches,
      Meta = new PaginationMeta
      {
        Total = total
      }
    });
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
        BeerId = record.BeerId,
        BeerName = record.Beer.Name,
        BeerStyle = record.Beer.Style
      })
      .FirstAsync();

    batch.FermentationRecordCount = records.Count;
    batch.FermentationRecords = records;

    return Ok(batch);
  }
}
