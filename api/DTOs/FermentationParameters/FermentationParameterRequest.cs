using System.ComponentModel.DataAnnotations;

namespace BrewMonitor.Api.DTOs.FermentationParameters;

public class FermentationParameterRequest : IValidatableObject
{
  [Required]
  public decimal? MinTemperature { get; set; }

  [Required]
  public decimal? MaxTemperature { get; set; }

  [Required]
  public decimal? MinPh { get; set; }

  [Required]
  public decimal? MaxPh { get; set; }

  [Required]
  public decimal? MinExtract { get; set; }

  [Required]
  public decimal? MaxExtract { get; set; }

  public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
  {
    foreach (var validationResult in ValidateNonNegative(MinTemperature, nameof(MinTemperature)))
    {
      yield return validationResult;
    }

    foreach (var validationResult in ValidateNonNegative(MaxTemperature, nameof(MaxTemperature)))
    {
      yield return validationResult;
    }

    foreach (var validationResult in ValidatePh(MinPh, nameof(MinPh)))
    {
      yield return validationResult;
    }

    foreach (var validationResult in ValidatePh(MaxPh, nameof(MaxPh)))
    {
      yield return validationResult;
    }

    foreach (var validationResult in ValidateNonNegative(MinExtract, nameof(MinExtract)))
    {
      yield return validationResult;
    }

    foreach (var validationResult in ValidateNonNegative(MaxExtract, nameof(MaxExtract)))
    {
      yield return validationResult;
    }

    if (MinTemperature > MaxTemperature)
    {
      yield return new ValidationResult(
        "The MinTemperature field must be less than or equal to MaxTemperature.",
        [nameof(MinTemperature), nameof(MaxTemperature)]
      );
    }

    if (MinPh > MaxPh)
    {
      yield return new ValidationResult(
        "The MinPh field must be less than or equal to MaxPh.",
        [nameof(MinPh), nameof(MaxPh)]
      );
    }

    if (MinExtract > MaxExtract)
    {
      yield return new ValidationResult(
        "The MinExtract field must be less than or equal to MaxExtract.",
        [nameof(MinExtract), nameof(MaxExtract)]
      );
    }

    IEnumerable<ValidationResult> ValidateNonNegative(decimal? value, string memberName)
    {
      if (value < 0)
      {
        yield return new ValidationResult(
          $"The {memberName} field must be greater than or equal to zero.",
          [memberName]
        );
      }
    }

    IEnumerable<ValidationResult> ValidatePh(decimal? value, string memberName)
    {
      if (value < 0 || value > 14)
      {
        yield return new ValidationResult(
          $"The {memberName} field must be between 0 and 14.",
          [memberName]
        );
      }
    }
  }
}
