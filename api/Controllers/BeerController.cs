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
}
