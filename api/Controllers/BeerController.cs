using BeerFerment.Api.Models;
using BeerFerment.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BeerFerment.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BeersController(IBeerService beerService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<List<Beer>>> GetAll()
  {
    var beers = await beerService.GetAllAsync();

    return Ok(beers);
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<Beer>> GetById(Guid id)
  {
    var beer = await beerService.GetByIdAsync(id);

    if (beer is null)
    {
      return NotFound();
    }

    return Ok(beer);
  }

  [HttpPost]
  public async Task<ActionResult<Beer>> Create(Beer beer)
  {
    var createdBeer = await beerService.CreateAsync(beer);

    return CreatedAtAction(nameof(GetById), new { id = createdBeer.Id }, createdBeer);
  }

  [HttpPut("{id:guid}")]
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
  public async Task<IActionResult> Delete(Guid id)
  {
    var deleted = await beerService.DeleteAsync(id);

    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }

  [HttpGet("{beerId:guid}/fermentation-parameters")]
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
