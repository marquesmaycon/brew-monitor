using System.ComponentModel.DataAnnotations;

namespace BrewMonitor.Api.DTOs.Beers;

public class BeerRequest : IValidatableObject
{
  [Required]
  [StringLength(120)]
  public string Name { get; set; } = string.Empty;

  [Required]
  [StringLength(80)]
  public string Style { get; set; } = string.Empty;

  public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
  {
    if ((Name?.Trim().Length ?? 0) < 2)
    {
      yield return new ValidationResult(
        "The Name field must be at least 2 characters long.",
        [nameof(Name)]
      );
    }

    if ((Style?.Trim().Length ?? 0) < 3)
    {
      yield return new ValidationResult(
        "The Style field must be at least 3 characters long.",
        [nameof(Style)]
      );
    }
  }
}
