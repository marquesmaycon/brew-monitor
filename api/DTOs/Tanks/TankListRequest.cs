using System.ComponentModel.DataAnnotations;
using BrewMonitor.Api.DTOs.Common;

namespace BrewMonitor.Api.DTOs.Tanks;

public class TankListRequest : PaginationRequest
{
  public string? Search { get; set; }

  [RegularExpression("(?i)^(name|capacityLiters|createdAt)$")]
  public string? SortBy { get; set; }

  [RegularExpression("(?i)^(asc|desc)$")]
  public string? SortDirection { get; set; }
}
