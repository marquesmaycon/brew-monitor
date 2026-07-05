using BrewMonitor.Api.Documentation.OpenApi;
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
  [BatchesEndpointDocumentation.List]
  public async Task<ActionResult<PaginatedResult<BatchResponse>>> GetAll(
    [FromQuery] PaginationRequest request
  )
  {
    var batches = await batchService.GetAllAsync(request.Page, request.Limit);

    return Ok(batches);
  }

  [HttpGet("{batchNumber}/overview")]
  [BatchesEndpointDocumentation.GetOverview]
  public async Task<ActionResult<BatchOverviewResponse>> GetOverview(
    [FromRoute] BatchRouteRequest request
  )
  {
    var normalizedBatchNumber = NormalizeBatchNumber(request.BatchNumber!);

    var overview = await batchService.GetOverviewAsync(normalizedBatchNumber);

    if (overview is null)
    {
      return NotFound("Batch does not exist.");
    }

    return Ok(overview);
  }

  [HttpGet("{batchNumber}/fermentation-records")]
  [BatchesEndpointDocumentation.ListFermentationRecords]
  public async Task<ActionResult<PaginatedResult<BatchFermentationRecordResponse>>> GetFermentationRecords(
    [FromRoute] BatchRouteRequest routeRequest,
    [FromQuery] PaginationRequest queryRequest
  )
  {
    var normalizedBatchNumber = NormalizeBatchNumber(routeRequest.BatchNumber!);

    var records = await batchService.GetFermentationRecordsAsync(
      normalizedBatchNumber,
      queryRequest.Page,
      queryRequest.Limit
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
