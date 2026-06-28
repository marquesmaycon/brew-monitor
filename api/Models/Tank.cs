namespace BrewMonitor.Api.Models;

public class Tank
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public decimal CapacityLiters { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
}
