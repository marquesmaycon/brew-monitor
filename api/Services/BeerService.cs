using BeerFerment.Api.Data;
using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Services;

public class BeerService(AppDbContext context) : IBeerService
{
  public Task<List<Beer>> GetAllAsync()
  {
    return context.Beers
      .OrderBy(beer => beer.Name)
      .ToListAsync();
  }

  public Task<Beer?> GetByIdAsync(Guid id)
  {
    return context.Beers.FindAsync(id).AsTask();
  }

  public Task<bool> ExistsAsync(Guid id)
  {
    return context.Beers.AnyAsync(beer => beer.Id == id);
  }

  public async Task<Beer> CreateAsync(Beer beer)
  {
    beer.Id = beer.Id == Guid.Empty ? Guid.NewGuid() : beer.Id;
    beer.CreatedAt = DateTime.UtcNow;
    beer.UpdatedAt = null;

    context.Beers.Add(beer);
    await context.SaveChangesAsync();

    return beer;
  }

  public async Task<Beer?> UpdateAsync(Guid id, Beer beer)
  {
    var existingBeer = await context.Beers.FindAsync(id);

    if (existingBeer is null)
    {
      return null;
    }

    existingBeer.Name = beer.Name;
    existingBeer.Style = beer.Style;
    existingBeer.UpdatedAt = DateTime.UtcNow;

    await context.SaveChangesAsync();

    return existingBeer;
  }

  public async Task<bool> DeleteAsync(Guid id)
  {
    var beer = await context.Beers.FindAsync(id);

    if (beer is null)
    {
      return false;
    }

    context.Beers.Remove(beer);
    await context.SaveChangesAsync();

    return true;
  }

  public Task<FermentationParameter?> GetFermentationParameterAsync(Guid beerId)
  {
    return context.FermentationParameters
      .FirstOrDefaultAsync(parameter => parameter.BeerId == beerId);
  }

  public async Task<FermentationParameter> CreateFermentationParameterAsync(
    Guid beerId,
    FermentationParameter parameter
  )
  {
    parameter.Id = Guid.NewGuid();
    parameter.BeerId = beerId;
    parameter.CreatedAt = DateTime.UtcNow;
    parameter.UpdatedAt = null;

    context.FermentationParameters.Add(parameter);
    await context.SaveChangesAsync();

    return parameter;
  }

  public async Task<FermentationParameter?> UpdateFermentationParameterAsync(
    Guid beerId,
    FermentationParameter parameter
  )
  {
    var existingParameter = await context.FermentationParameters
      .FirstOrDefaultAsync(currentParameter => currentParameter.BeerId == beerId);

    if (existingParameter is null)
    {
      return null;
    }

    existingParameter.MinTemperature = parameter.MinTemperature;
    existingParameter.MaxTemperature = parameter.MaxTemperature;
    existingParameter.MinPh = parameter.MinPh;
    existingParameter.MaxPh = parameter.MaxPh;
    existingParameter.MinExtract = parameter.MinExtract;
    existingParameter.MaxExtract = parameter.MaxExtract;
    existingParameter.UpdatedAt = DateTime.UtcNow;

    await context.SaveChangesAsync();

    return existingParameter;
  }

  public async Task<bool> DeleteFermentationParameterAsync(Guid beerId)
  {
    var parameter = await context.FermentationParameters
      .FirstOrDefaultAsync(currentParameter => currentParameter.BeerId == beerId);

    if (parameter is null)
    {
      return false;
    }

    context.FermentationParameters.Remove(parameter);
    await context.SaveChangesAsync();

    return true;
  }
}
