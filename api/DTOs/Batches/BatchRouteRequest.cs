using System.ComponentModel.DataAnnotations;

namespace BrewMonitor.Api.DTOs.Batches;

public class BatchRouteRequest : IValidatableObject
{
  [Required]
  [StringLength(80)]
  public string? BatchNumber { get; set; }

  public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
  {
    if ((BatchNumber?.Trim().Length ?? 0) < 1)
    {
      yield return new ValidationResult("Batch number is required.", [nameof(BatchNumber)]);
    }
  }
}
