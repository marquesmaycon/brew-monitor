namespace BrewMonitor.Api.Models;

public class Beer
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Style { get; set; } = string.Empty;
  [System.Text.Json.Serialization.JsonIgnore]
  public FermentationParameter? FermentationParameter { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
}
