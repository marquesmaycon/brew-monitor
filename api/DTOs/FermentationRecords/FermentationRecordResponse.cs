using BrewMonitor.Api.Enums;

namespace BrewMonitor.Api.DTOs.FermentationRecords;

public class FermentationRecordResponse
{
  public Guid Id { get; set; }
  public DateTime RegisteredAt { get; set; }
  public Guid BeerId { get; set; }
  public string BeerName { get; set; } = string.Empty;
  public string BeerStyle { get; set; } = string.Empty;
  public Guid TankId { get; set; }
  public string TankName { get; set; } = string.Empty;
  public decimal TankCapacityLiters { get; set; }
  public string BatchNumber { get; set; } = string.Empty;
  public decimal Temperature { get; set; }
  public decimal Ph { get; set; }
  public decimal Extract { get; set; }
  public string? Notes { get; set; }
  public FermentationRecordClassification Classification { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
}
