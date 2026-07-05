using BrewMonitor.Api.Data;
using BrewMonitor.Api.Documentation.OpenApi;
using BrewMonitor.Api.DTOs.Dashboard;
using BrewMonitor.Api.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext context) : ControllerBase
{
  [HttpGet]
  [DashboardEndpointDocumentation.GetSummary]
  public async Task<ActionResult<object>> Get()
  {
    var recordsByClassification = await context.FermentationRecords
      .GroupBy(record => record.Classification)
      .ToDictionaryAsync(group => group.Key, group => group.Count());

    var totalFermentationRecords = recordsByClassification.Values.Sum();

    return Ok(new
    {
      totalFermentationRecords,
      withinStandardRecords = GetClassificationCount(
        recordsByClassification,
        FermentationRecordClassification.WithinStandard
      ),
      attentionRecords = GetClassificationCount(
        recordsByClassification,
        FermentationRecordClassification.Attention
      ),
      outOfStandardRecords = GetClassificationCount(
        recordsByClassification,
        FermentationRecordClassification.OutOfStandard
      )
    });
  }

  [HttpGet("fermentation-history")]
  [DashboardEndpointDocumentation.GetFermentationHistory]
  public async Task<ActionResult<FermentationHistoryResponse>> GetFermentationHistory(
    [FromQuery] FermentationHistoryRequest request
  )
  {
    var batches = await context.FermentationRecords
      .GroupBy(record => new
      {
        record.BatchNumber,
        record.Beer.Name,
        record.Beer.Style
      })
      .Select(group => new FermentationHistoryBatchResponse
      {
        BatchNumber = group.Key.BatchNumber,
        BeerName = group.Key.Name,
        BeerStyle = group.Key.Style,
        LastRegisteredAt = group.Max(record => record.RegisteredAt)
      })
      .OrderByDescending(batch => batch.LastRegisteredAt)
      .ToListAsync();

    var selectedBatchNumber = string.IsNullOrWhiteSpace(request.BatchNumber)
      ? batches.FirstOrDefault()?.BatchNumber
      : request.BatchNumber.Trim();

    if (
      selectedBatchNumber is not null
      && !batches.Any(batch => batch.BatchNumber == selectedBatchNumber)
    )
    {
      return NotFound("Batch does not exist.");
    }

    var data = selectedBatchNumber is null
      ? []
      : await context.FermentationRecords
        .Where(record => record.BatchNumber == selectedBatchNumber)
        .OrderBy(record => record.RegisteredAt)
        .Select(record => new FermentationHistoryPointResponse
        {
          RegisteredAt = record.RegisteredAt,
          Temperature = record.Temperature,
          Ph = record.Ph,
          Extract = record.Extract
        })
        .ToListAsync();

    return Ok(new FermentationHistoryResponse
    {
      SelectedBatchNumber = selectedBatchNumber,
      Batches = batches,
      Data = data
    });
  }

  private static int GetClassificationCount(
    IReadOnlyDictionary<FermentationRecordClassification, int> recordsByClassification,
    FermentationRecordClassification classification
  )
  {
    return recordsByClassification.GetValueOrDefault(classification);
  }
}
