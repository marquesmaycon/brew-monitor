using System.ComponentModel.DataAnnotations;

namespace BrewMonitor.Api.DTOs.Dashboard;

public class FermentationHistoryRequest
{
  [StringLength(80)]
  public string? BatchNumber { get; set; }
}
