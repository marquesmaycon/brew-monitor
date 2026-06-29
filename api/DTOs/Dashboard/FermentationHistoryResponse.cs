namespace BrewMonitor.Api.DTOs.Dashboard;

public class FermentationHistoryResponse
{
  public string? SelectedBatchNumber { get; set; }
  public List<FermentationHistoryBatchResponse> Batches { get; set; } = [];
  public List<FermentationHistoryPointResponse> Data { get; set; } = [];
}

public class FermentationHistoryBatchResponse
{
  public string BatchNumber { get; set; } = string.Empty;
  public string BeerName { get; set; } = string.Empty;
  public string BeerStyle { get; set; } = string.Empty;
  public DateTime LastRegisteredAt { get; set; }
}

public class FermentationHistoryPointResponse
{
  public DateTime RegisteredAt { get; set; }
  public decimal Temperature { get; set; }
  public decimal Ph { get; set; }
  public decimal Extract { get; set; }
}
