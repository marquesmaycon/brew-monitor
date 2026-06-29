namespace BrewMonitor.Api.DTOs.Beers;

public class BeerResponse
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Style { get; set; } = string.Empty;
  public BeerFermentationParameterResponse? FermentationParameter { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
}

public class BeerFermentationParameterResponse
{
  public decimal MinTemperature { get; set; }
  public decimal MaxTemperature { get; set; }
  public decimal MinPh { get; set; }
  public decimal MaxPh { get; set; }
  public decimal MinExtract { get; set; }
  public decimal MaxExtract { get; set; }
}
