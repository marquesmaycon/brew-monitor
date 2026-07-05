using BrewMonitor.Api.Documentation.OpenApi;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationRecords;
using BrewMonitor.Api.Models;
using BrewMonitor.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TanksController(
  ITankService tankService,
  IFermentationRecordService fermentationRecordService
) : ControllerBase
{
  [HttpGet]
  [TanksEndpointDocumentation.List]
  public async Task<ActionResult<PaginatedResult<Tank>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20,
    [FromQuery] string? search = null,
    [FromQuery] string? sortBy = null,
    [FromQuery] string? sortDirection = null
  )
  {
    var tanks = await tankService.GetAllAsync(page, limit, search, sortBy, sortDirection);

    return Ok(tanks);
  }

  [HttpGet("{id:guid}")]
  [TanksEndpointDocumentation.GetById]
  public async Task<ActionResult<Tank>> GetById(Guid id)
  {
    var tank = await tankService.GetByIdAsync(id);

    if (tank is null)
    {
      return NotFound();
    }

    return Ok(tank);
  }

  [HttpPost]
  [TanksEndpointDocumentation.Create]
  public async Task<ActionResult<Tank>> Create(Tank tank)
  {
    var createdTank = await tankService.CreateAsync(tank);

    return CreatedAtAction(nameof(GetById), new { id = createdTank.Id }, createdTank);
  }

  [HttpPut("{id:guid}")]
  [TanksEndpointDocumentation.Update]
  public async Task<ActionResult<Tank>> Update(Guid id, Tank tank)
  {
    var updatedTank = await tankService.UpdateAsync(id, tank);

    if (updatedTank is null)
    {
      return NotFound();
    }

    return Ok(updatedTank);
  }

  [HttpDelete("{id:guid}")]
  [TanksEndpointDocumentation.Delete]
  public async Task<IActionResult> Delete(Guid id)
  {
    if (!await tankService.ExistsAsync(id))
    {
      return NotFound();
    }

    if (await tankService.HasFermentationRecordsAsync(id))
    {
      return Conflict("Tank cannot be deleted because it has fermentation records.");
    }

    var deleted = await tankService.DeleteAsync(id);

    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }

  [HttpGet("{tankId:guid}/fermentation-records")]
  [TanksEndpointDocumentation.ListFermentationRecords]
  public async Task<ActionResult<PaginatedResult<FermentationRecordResponse>>> GetFermentationRecords(
    Guid tankId,
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
  {
    if (!await tankService.ExistsAsync(tankId))
    {
      return NotFound();
    }

    var records = await fermentationRecordService.GetByTankAsync(tankId, page, limit);

    return Ok(records);
  }
}
