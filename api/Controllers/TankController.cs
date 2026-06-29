using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Models;
using BrewMonitor.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TanksController(ITankService tankService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<PaginatedResult<Tank>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
  {
    var tanks = await tankService.GetAllAsync(page, limit);

    return Ok(tanks);
  }

  [HttpGet("{id:guid}")]
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
  public async Task<ActionResult<Tank>> Create(Tank tank)
  {
    var createdTank = await tankService.CreateAsync(tank);

    return CreatedAtAction(nameof(GetById), new { id = createdTank.Id }, createdTank);
  }

  [HttpPut("{id:guid}")]
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
  public async Task<IActionResult> Delete(Guid id)
  {
    var deleted = await tankService.DeleteAsync(id);

    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }
}
