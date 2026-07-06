using System.ComponentModel.DataAnnotations;
using BrewMonitor.Api.DTOs.Common;

namespace BrewMonitor.Api.DTOs.Batches;

public class BatchFermentationRecordListRequest : PaginationRequest
{
  public string? Search { get; set; }

  [RegularExpression("(?i)^(registeredAt|tankName|temperature|ph|extract)$")]
  public string? SortBy { get; set; }

  [RegularExpression("(?i)^(asc|desc)$")]
  public string? SortDirection { get; set; }

  [RegularExpression("(?i)^(WITHIN_STANDARD|ATTENTION|OUT_OF_STANDARD)$")]
  public string? Classification { get; set; }
}
