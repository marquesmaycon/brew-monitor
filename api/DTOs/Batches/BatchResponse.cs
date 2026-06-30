namespace BrewMonitor.Api.DTOs.Batches;

using BrewMonitor.Api.Enums;

public class BatchResponse
{
  public string BatchNumber { get; set; } = string.Empty;
  public Guid BeerId { get; set; }
  public string BeerName { get; set; } = string.Empty;
  public string BeerStyle { get; set; } = string.Empty;
  public int FermentationRecordCount { get; set; }
}

public class BatchOverviewResponse
{
  public string BatchNumber { get; set; } = string.Empty;
  public string BeerName { get; set; } = string.Empty;
  public string BeerStyle { get; set; } = string.Empty;
  public List<BatchFermentationMetricPointResponse> MetricPoints { get; set; } = [];
  public List<BatchClassificationCountResponse> ClassificationCounts { get; set; } = [];
}

public class BatchFermentationMetricPointResponse
{
  public DateTime RegisteredAt { get; set; }
  public decimal Temperature { get; set; }
  public decimal Ph { get; set; }
  public decimal Extract { get; set; }
}

public class BatchClassificationCountResponse
{
  public FermentationRecordClassification Classification { get; set; }
  public int Count { get; set; }
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
