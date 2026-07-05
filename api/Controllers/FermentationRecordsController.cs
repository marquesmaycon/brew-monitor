using BrewMonitor.Api.Documentation.OpenApi;
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
  [FermentationRecordsEndpointDocumentation.List]
  public async Task<ActionResult<PaginatedResult<FermentationRecordResponse>>> GetAll(
    [FromQuery] FermentationRecordListRequest request
  )
  {
    var records = await fermentationRecordService.GetAllAsync(
      request.Page,
      request.Limit,
      request.Search,
      request.SortBy,
      request.SortDirection,
      request.Classification
    );

    return Ok(records);
  }

  [HttpGet("{id:guid}")]
  [FermentationRecordsEndpointDocumentation.GetById]
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
  [FermentationRecordsEndpointDocumentation.Create]
  public async Task<ActionResult<FermentationRecord>> Create(
    [FromBody] FermentationRecordRequest request
  )
  {
    var record = ToFermentationRecord(request);
    var validationError = await ValidateAsync(record);

    if (validationError is not null)
    {
      return validationError;
    }

    var createdRecord = await fermentationRecordService.CreateAsync(record);

    return CreatedAtAction(nameof(GetById), new { id = createdRecord.Id }, createdRecord);
  }

  [HttpPut("{id:guid}")]
  [FermentationRecordsEndpointDocumentation.Update]
  public async Task<ActionResult<FermentationRecord>> Update(
    Guid id,
    [FromBody] FermentationRecordRequest request
  )
  {
    var record = ToFermentationRecord(request);
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
  [FermentationRecordsEndpointDocumentation.Delete]
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
    if (!await fermentationRecordService.BeerExistsAsync(record.BeerId))
    {
      return BadRequest("Beer does not exist.");
    }

    if (!await fermentationRecordService.TankExistsAsync(record.TankId))
    {
      return BadRequest("Tank does not exist.");
    }

    return null;
  }

  private static FermentationRecord ToFermentationRecord(FermentationRecordRequest request)
  {
    return new FermentationRecord
    {
      RegisteredAt = request.RegisteredAt!.Value,
      BeerId = request.BeerId!.Value,
      TankId = request.TankId!.Value,
      BatchNumber = request.BatchNumber!.Trim(),
      Temperature = request.Temperature!.Value,
      Ph = request.Ph!.Value,
      Extract = request.Extract!.Value,
      Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim()
    };
  }
}
