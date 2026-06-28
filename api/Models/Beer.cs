namespace BeerFerment.Api.Models;

public class Beer
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Style { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
}