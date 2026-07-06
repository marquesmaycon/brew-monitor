using System.ComponentModel.DataAnnotations;
using BrewMonitor.Api.DTOs.Common;

namespace BrewMonitor.Api.DTOs.Batches;

public class BatchListRequest : PaginationRequest
{
  public string? Search { get; set; }

  [RegularExpression("(?i)^(batchNumber|beerName|fermentationRecordCount)$")]
  public string? SortBy { get; set; }

  [RegularExpression("(?i)^(asc|desc)$")]
  public string? SortDirection { get; set; }
}
