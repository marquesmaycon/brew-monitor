using System.ComponentModel.DataAnnotations;
using BrewMonitor.Api.DTOs.Common;

namespace BrewMonitor.Api.DTOs.Beers;

public class BeerListRequest : PaginationRequest
{
  public string? Search { get; set; }

  [RegularExpression("(?i)^(name|style|createdAt)$")]
  public string? SortBy { get; set; }

  [RegularExpression("(?i)^(asc|desc)$")]
  public string? SortDirection { get; set; }
}
