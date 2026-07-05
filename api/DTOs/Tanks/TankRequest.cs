using System.ComponentModel.DataAnnotations;

namespace BrewMonitor.Api.DTOs.Tanks;

public class TankRequest : IValidatableObject
{
  [Required]
  [StringLength(120)]
  public string? Name { get; set; }

  [Required]
  public decimal? CapacityLiters { get; set; }

  public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
  {
    if ((Name?.Trim().Length ?? 0) < 2)
    {
      yield return new ValidationResult(
        "The Name field must be at least 2 characters long.",
        [nameof(Name)]
      );
    }

    if (CapacityLiters <= 0)
    {
      yield return new ValidationResult(
        "The CapacityLiters field must be greater than zero.",
        [nameof(CapacityLiters)]
      );
    }
  }
}
