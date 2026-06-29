using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationRecords;
using BrewMonitor.Api.Models;
using BrewMonitor.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/fermentation-records")]
public class FermentationRecordsController(IFermentationRecordService fermentationRecordService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<PaginatedResult<FermentationRecordResponse>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
  {
    var records = await fermentationRecordService.GetAllAsync(page, limit);

    return Ok(records);
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<FermentationRecordResponse>> GetById(Guid id)
  {
    var record = await fermentationRecordService.GetByIdAsync(id);

    if (record is null)
    {
      return NotFound();
    }

    return Ok(record);
  }

  [HttpPost]
  public async Task<ActionResult<FermentationRecord>> Create(FermentationRecord record)
  {
    var validationError = await ValidateAsync(record);

    if (validationError is not null)
    {
      return validationError;
    }

    var createdRecord = await fermentationRecordService.CreateAsync(record);

    return CreatedAtAction(nameof(GetById), new { id = createdRecord.Id }, createdRecord);
  }

  [HttpPut("{id:guid}")]
  public async Task<ActionResult<FermentationRecord>> Update(Guid id, FermentationRecord record)
  {
    var validationError = await ValidateAsync(record);

    if (validationError is not null)
    {
      return validationError;
    }

    var updatedRecord = await fermentationRecordService.UpdateAsync(id, record);

    if (updatedRecord is null)
    {
      return NotFound();
    }

    return Ok(updatedRecord);
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var deleted = await fermentationRecordService.DeleteAsync(id);

    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }

  private async Task<ActionResult?> ValidateAsync(FermentationRecord record)
  {
    if (record.BeerId == Guid.Empty)
    {
      return BadRequest("Beer is required.");
    }

    if (!await fermentationRecordService.BeerExistsAsync(record.BeerId))
    {
      return BadRequest("Beer does not exist.");
    }

    if (record.TankId == Guid.Empty)
    {
      return BadRequest("Tank is required.");
    }

    if (!await fermentationRecordService.TankExistsAsync(record.TankId))
    {
      return BadRequest("Tank does not exist.");
    }

    if (record.RegisteredAt == default)
    {
      return BadRequest("Registered date and time are required.");
    }

    if (string.IsNullOrWhiteSpace(record.BatchNumber))
    {
      return BadRequest("Batch number is required.");
    }

    return null;
  }
}
