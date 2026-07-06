using BrewMonitor.Api.Documentation.OpenApi;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationRecords;
using BrewMonitor.Api.DTOs.Tanks;
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
    [FromQuery] TankListRequest request
  )
  {
    var tanks = await tankService.GetAllAsync(
      request.Page,
      request.Limit,
      request.Search,
      request.SortBy,
      request.SortDirection
    );

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
  public async Task<ActionResult<Tank>> Create([FromBody] TankRequest request)
  {
    var tank = ToTank(request);
    var createdTank = await tankService.CreateAsync(tank);

    return CreatedAtAction(nameof(GetById), new { id = createdTank.Id }, createdTank);
  }

  [HttpPut("{id:guid}")]
  [TanksEndpointDocumentation.Update]
  public async Task<ActionResult<Tank>> Update(Guid id, [FromBody] TankRequest request)
  {
    var tank = ToTank(request);
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
    [FromQuery] FermentationRecordListRequest request
  )
  {
    if (!await tankService.ExistsAsync(tankId))
    {
      return NotFound();
    }

    var records = await fermentationRecordService.GetByTankAsync(
      tankId,
      request.Page,
      request.Limit,
      request.Search,
      request.SortBy,
      request.SortDirection,
      request.Classification
    );

    return Ok(records);
  }

  private static Tank ToTank(TankRequest request)
  {
    return new Tank
    {
      Name = request.Name!.Trim(),
      CapacityLiters = request.CapacityLiters!.Value
    };
  }
}
