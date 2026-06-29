namespace BrewMonitor.Api.DTOs.Common;

public class PaginatedResult<T>
{
  public List<T> Data { get; set; } = [];
  public PaginationMeta Meta { get; set; } = new();
}

public class PaginationMeta
{
  public int Total { get; set; }
}
