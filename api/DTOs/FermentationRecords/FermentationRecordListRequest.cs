using System.ComponentModel.DataAnnotations;
using BrewMonitor.Api.DTOs.Common;

namespace BrewMonitor.Api.DTOs.FermentationRecords;

public class FermentationRecordListRequest : PaginationRequest
{
  public string? Search { get; set; }

  [RegularExpression("(?i)^(batchNumber|registeredAt)$")]
  public string? SortBy { get; set; }

  [RegularExpression("(?i)^(asc|desc)$")]
  public string? SortDirection { get; set; }

  [RegularExpression("(?i)^(WITHIN_STANDARD|ATTENTION|OUT_OF_STANDARD)$")]
  public string? Classification { get; set; }
}
