using BrewMonitor.Api.Documentation.OpenApi;
using BrewMonitor.Api.DTOs.Beers;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationRecords;
using BrewMonitor.Api.Models;
using BrewMonitor.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewMonitor.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BeersController(
  IBeerService beerService,
  IFermentationRecordService fermentationRecordService
) : ControllerBase
{
  [HttpGet]
  [BeersEndpointDocumentation.List]
  public async Task<ActionResult<PaginatedResult<BeerResponse>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20,
    [FromQuery] string? search = null,
    [FromQuery] string? sortBy = null,
    [FromQuery] string? sortDirection = null
  )
  {
    var beers = await beerService.GetAllAsync(page, limit, search, sortBy, sortDirection);

    return Ok(beers);
  }

  [HttpGet("{id:guid}")]
  [BeersEndpointDocumentation.GetById]
  public async Task<ActionResult<BeerResponse>> GetById(Guid id)
  {
    var beer = await beerService.GetByIdAsync(id);

    if (beer is null)
    {
      return NotFound();
    }

    return Ok(beer);
  }

  [HttpPost]
  [BeersEndpointDocumentation.Create]
  public async Task<ActionResult<Beer>> Create(Beer beer)
  {
    var createdBeer = await beerService.CreateAsync(beer);

    return CreatedAtAction(nameof(GetById), new { id = createdBeer.Id }, createdBeer);
  }

  [HttpPut("{id:guid}")]
  [BeersEndpointDocumentation.Update]
  public async Task<ActionResult<Beer>> Update(Guid id, Beer beer)
  {
    var updatedBeer = await beerService.UpdateAsync(id, beer);

    if (updatedBeer is null)
    {
      return NotFound();
    }

    return Ok(updatedBeer);
  }

  [HttpDelete("{id:guid}")]
  [BeersEndpointDocumentation.Delete]
  public async Task<IActionResult> Delete(Guid id)
  {
    if (!await beerService.ExistsAsync(id))
    {
      return NotFound();
    }

    if (await beerService.HasFermentationRecordsAsync(id))
    {
      return Conflict("Beer cannot be deleted because it has fermentation records.");
    }

    var deleted = await beerService.DeleteAsync(id);

    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }

  [HttpGet("{beerId:guid}/fermentation-records")]
  [BeersEndpointDocumentation.ListFermentationRecords]
  public async Task<ActionResult<PaginatedResult<FermentationRecordResponse>>> GetFermentationRecords(
    Guid beerId,
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20
  )
  {
    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    var records = await fermentationRecordService.GetByBeerAsync(beerId, page, limit);

    return Ok(records);
  }

  [HttpGet("{beerId:guid}/fermentation-parameters")]
  [BeersEndpointDocumentation.GetFermentationParameter]
  public async Task<ActionResult<FermentationParameter>> GetFermentationParameter(Guid beerId)
  {
    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    var parameter = await beerService.GetFermentationParameterAsync(beerId);

    if (parameter is null)
    {
      return NotFound();
    }

    return Ok(parameter);
  }

  [HttpPost("{beerId:guid}/fermentation-parameters")]
  [BeersEndpointDocumentation.CreateFermentationParameter]
  public async Task<ActionResult<FermentationParameter>> CreateFermentationParameter(
    Guid beerId,
    FermentationParameter parameter
  )
  {
    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    var existingParameter = await beerService.GetFermentationParameterAsync(beerId);

    if (existingParameter is not null)
    {
      return Conflict("Fermentation parameters already exist for this beer.");
    }

    if (!HasValidRanges(parameter))
    {
      return BadRequest("Minimum values must be less than or equal to maximum values.");
    }

    var createdParameter = await beerService.CreateFermentationParameterAsync(beerId, parameter);

    return CreatedAtAction(
      nameof(GetFermentationParameter),
      new { beerId = createdParameter.BeerId },
      createdParameter
    );
  }

  [HttpPut("{beerId:guid}/fermentation-parameters")]
  [BeersEndpointDocumentation.UpdateFermentationParameter]
  public async Task<ActionResult<FermentationParameter>> UpdateFermentationParameter(
    Guid beerId,
    FermentationParameter parameter
  )
  {
    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    if (!HasValidRanges(parameter))
    {
      return BadRequest("Minimum values must be less than or equal to maximum values.");
    }

    var updatedParameter = await beerService.UpdateFermentationParameterAsync(beerId, parameter);

    if (updatedParameter is null)
    {
      return NotFound();
    }

    return Ok(updatedParameter);
  }

  [HttpDelete("{beerId:guid}/fermentation-parameters")]
  [BeersEndpointDocumentation.DeleteFermentationParameter]
  public async Task<IActionResult> DeleteFermentationParameter(Guid beerId)
  {
    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    var deleted = await beerService.DeleteFermentationParameterAsync(beerId);

    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }

  private static bool HasValidRanges(FermentationParameter parameter)
  {
    return parameter.MinTemperature <= parameter.MaxTemperature
      && parameter.MinPh <= parameter.MaxPh
      && parameter.MinExtract <= parameter.MaxExtract;
  }
}
