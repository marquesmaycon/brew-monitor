using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace BeerFerment.Api.Models;

public class FermentationParameter
{
  public Guid Id { get; set; }
  public Guid BeerId { get; set; }
  public decimal MinTemperature { get; set; }
  public decimal MaxTemperature { get; set; }
  public decimal MinPh { get; set; }
  public decimal MaxPh { get; set; }
  public decimal MinExtract { get; set; }
  public decimal MaxExtract { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
  [JsonIgnore]
  [ValidateNever]
  public Beer Beer { get; set; } = null!;
}
