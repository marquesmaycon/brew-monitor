using BeerFerment.Api.Enums;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace BeerFerment.Api.Models;

public class FermentationRecord
{
  public Guid Id { get; set; }
  public DateTime RegisteredAt { get; set; }
  public Guid BeerId { get; set; }
  public Guid TankId { get; set; }
  public string BatchNumber { get; set; } = string.Empty;
  public decimal Temperature { get; set; }
  public decimal Ph { get; set; }
  public decimal Extract { get; set; }
  public string? Notes { get; set; }
  public FermentationRecordClassification Classification { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
  [JsonIgnore]
  [ValidateNever]
  public Beer Beer { get; set; } = null!;
  [JsonIgnore]
  [ValidateNever]
  public Tank Tank { get; set; } = null!;
}
