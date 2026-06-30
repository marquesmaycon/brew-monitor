using BrewMonitor.Api.DTOs.Batches;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/batches")]
public class BatchesController(IBatchService batchService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<PaginatedResult<BatchResponse>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
  {
    var batches = await batchService.GetAllAsync(page, limit);

    return Ok(batches);
  }

  [HttpGet("{batchNumber}/overview")]
  public async Task<ActionResult<BatchOverviewResponse>> GetOverview(string batchNumber)
  {
    var normalizedBatchNumber = NormalizeBatchNumber(batchNumber);

    if (string.IsNullOrWhiteSpace(normalizedBatchNumber))
    {
      return BadRequest("Batch number is required.");
    }

    var overview = await batchService.GetOverviewAsync(normalizedBatchNumber);

    if (overview is null)
    {
      return NotFound("Batch does not exist.");
    }

    return Ok(overview);
  }

  [HttpGet("{batchNumber}/fermentation-records")]
  public async Task<ActionResult<PaginatedResult<BatchFermentationRecordResponse>>> GetFermentationRecords(
    string batchNumber,
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
  {
    var normalizedBatchNumber = NormalizeBatchNumber(batchNumber);

    if (string.IsNullOrWhiteSpace(normalizedBatchNumber))
    {
      return BadRequest("Batch number is required.");
    }

    var records = await batchService.GetFermentationRecordsAsync(
      normalizedBatchNumber,
      page,
      limit
    );

    if (records is null)
    {
      return NotFound("Batch does not exist.");
    }

    return Ok(records);
  }

  private static string NormalizeBatchNumber(string batchNumber)
  {
    return Uri.UnescapeDataString(batchNumber).Trim();
  }
}
