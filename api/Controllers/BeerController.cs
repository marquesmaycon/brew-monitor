using BrewMonitor.Api.Documentation.OpenApi;
using BrewMonitor.Api.DTOs.Beers;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationParameters;
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
    [FromQuery] BeerListRequest request
  )
  {
    var beers = await beerService.GetAllAsync(
      request.Page,
      request.Limit,
      request.Search,
      request.SortBy,
      request.SortDirection
    );

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
  public async Task<ActionResult<BeerResponse>> Create([FromBody] BeerRequest request)
  {
    var beer = ToBeer(request);
    var createdBeer = await beerService.CreateAsync(beer);

    return CreatedAtAction(nameof(GetById), new { id = createdBeer.Id }, ToResponse(createdBeer));
  }

  [HttpPut("{id:guid}")]
  [BeersEndpointDocumentation.Update]
  public async Task<ActionResult<BeerResponse>> Update(Guid id, [FromBody] BeerRequest request)
  {
    var beer = ToBeer(request);
    var updatedBeer = await beerService.UpdateAsync(id, beer);

    if (updatedBeer is null)
    {
      return NotFound();
    }

    return Ok(ToResponse(updatedBeer));
  }

  /// <summary>
  /// Exclui a entidade se ela não possuir registros de fermentação. Retorna HTTP 409 (Conflict) 
  /// como uma proteção na camada de aplicação para complementar a restrição Restrict configurada no banco.
  /// </summary>
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
    [FromQuery] FermentationRecordListRequest request
  )
  {
    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    var records = await fermentationRecordService.GetByBeerAsync(
      beerId,
      request.Page,
      request.Limit,
      request.Search,
      request.SortBy,
      request.SortDirection,
      request.Classification
    );

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

  /// <summary>
  /// Cria os parâmetros ideais de fermentação, garantindo a relação estrita de 1:1 por cerveja
  /// e retornando Conflict caso as configurações de parâmetro já existam.
  /// </summary>
  [HttpPost("{beerId:guid}/fermentation-parameters")]
  [BeersEndpointDocumentation.CreateFermentationParameter]
  public async Task<ActionResult<FermentationParameter>> CreateFermentationParameter(
    Guid beerId,
    [FromBody] FermentationParameterRequest request
  )
  {
    var parameter = ToFermentationParameter(request);

    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
    }

    var existingParameter = await beerService.GetFermentationParameterAsync(beerId);

    if (existingParameter is not null)
    {
      return Conflict("Fermentation parameters already exist for this beer.");
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
    [FromBody] FermentationParameterRequest request
  )
  {
    var parameter = ToFermentationParameter(request);

    if (!await beerService.ExistsAsync(beerId))
    {
      return NotFound();
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

  private static Beer ToBeer(BeerRequest request)
  {
    return new Beer
    {
      Name = request.Name.Trim(),
      Style = request.Style.Trim()
    };
  }

  private static BeerResponse ToResponse(Beer beer)
  {
    return new BeerResponse
    {
      Id = beer.Id,
      Name = beer.Name,
      Style = beer.Style,
      CreatedAt = beer.CreatedAt,
      UpdatedAt = beer.UpdatedAt,
      FermentationParameter = null
    };
  }

  private static FermentationParameter ToFermentationParameter(
    FermentationParameterRequest request
  )
  {
    return new FermentationParameter
    {
      MinTemperature = request.MinTemperature!.Value,
      MaxTemperature = request.MaxTemperature!.Value,
      MinPh = request.MinPh!.Value,
      MaxPh = request.MaxPh!.Value,
      MinExtract = request.MinExtract!.Value,
      MaxExtract = request.MaxExtract!.Value
    };
  }
}
