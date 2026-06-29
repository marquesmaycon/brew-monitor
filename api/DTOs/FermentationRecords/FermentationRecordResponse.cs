using BrewMonitor.Api.DTOs.Beers;
using BrewMonitor.Api.Enums;

namespace BrewMonitor.Api.DTOs.FermentationRecords;

public class FermentationRecordResponse
{
  public Guid Id { get; set; }
  public DateTime RegisteredAt { get; set; }
  public Guid BeerId { get; set; }
  public FermentationRecordBeerResponse Beer { get; set; } = null!;
  public Guid TankId { get; set; }
  public FermentationRecordTankResponse Tank { get; set; } = null!;
  public string BatchNumber { get; set; } = string.Empty;
  public decimal Temperature { get; set; }
  public decimal Ph { get; set; }
  public decimal Extract { get; set; }
  public string? Notes { get; set; }
  public FermentationRecordClassification Classification { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
}

public class FermentationRecordBeerResponse
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Style { get; set; } = string.Empty;
  public BeerFermentationParameterResponse? FermentationParameter { get; set; }
}

public class FermentationRecordTankResponse
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public decimal CapacityLiters { get; set; }
}
