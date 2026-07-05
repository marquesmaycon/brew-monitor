using System.ComponentModel.DataAnnotations;

namespace BrewMonitor.Api.DTOs.FermentationRecords;

public class FermentationRecordRequest : IValidatableObject
{
  [Required]
  public DateTime? RegisteredAt { get; set; }

  [Required]
  public Guid? BeerId { get; set; }

  [Required]
  public Guid? TankId { get; set; }

  [Required]
  [StringLength(80)]
  public string? BatchNumber { get; set; }

  [Required]
  public decimal? Temperature { get; set; }

  [Required]
  public decimal? Ph { get; set; }

  [Required]
  public decimal? Extract { get; set; }

  [StringLength(1000)]
  public string? Notes { get; set; }

  public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
  {
    if (BeerId == Guid.Empty)
    {
      yield return new ValidationResult("Beer is required.", [nameof(BeerId)]);
    }

    if (TankId == Guid.Empty)
    {
      yield return new ValidationResult("Tank is required.", [nameof(TankId)]);
    }

    if (RegisteredAt == default(DateTime))
    {
      yield return new ValidationResult(
        "Registered date and time are required.",
        [nameof(RegisteredAt)]
      );
    }

    if ((BatchNumber?.Trim().Length ?? 0) < 1)
    {
      yield return new ValidationResult("Batch number is required.", [nameof(BatchNumber)]);
    }

    if (Ph <= 0)
    {
      yield return new ValidationResult(
        "The Ph field must be greater than zero.",
        [nameof(Ph)]
      );
    }

    if (Extract < 0)
    {
      yield return new ValidationResult(
        "The Extract field must be greater than or equal to zero.",
        [nameof(Extract)]
      );
    }
  }
}
