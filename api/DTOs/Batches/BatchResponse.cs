namespace BrewMonitor.Api.DTOs.Batches;

using BrewMonitor.Api.Enums;

public class BatchResponse
{
  public string BatchNumber { get; set; } = string.Empty;
  public string BeerName { get; set; } = string.Empty;
  public string BeerStyle { get; set; } = string.Empty;
  public int FermentationRecordCount { get; set; }
}

public class BatchDetailResponse : BatchResponse
{
  public List<BatchFermentationRecordResponse> FermentationRecords { get; set; } = [];
}

public class BatchFermentationRecordResponse
{
  public Guid Id { get; set; }
  public DateTime RegisteredAt { get; set; }
  public string TankName { get; set; } = string.Empty;
  public decimal TankCapacityLiters { get; set; }
  public decimal Temperature { get; set; }
  public decimal Ph { get; set; }
  public decimal Extract { get; set; }
  public string? Notes { get; set; }
  public FermentationRecordClassification Classification { get; set; }
}
