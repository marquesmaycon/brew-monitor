using BrewMonitor.Api.Data;
using BrewMonitor.Api.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext context) : ControllerBase
{
  [HttpGet]
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

  private static int GetClassificationCount(
    IReadOnlyDictionary<FermentationRecordClassification, int> recordsByClassification,
    FermentationRecordClassification classification
  )
  {
    return recordsByClassification.GetValueOrDefault(classification);
  }
}
