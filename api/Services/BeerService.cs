using BeerFerment.Api.Data;
using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Services;

public class BeerService(AppDbContext context) : IBeerService
{
  public Task<List<Beer>> GetAllAsync()
  {
    return context.Beer
      .OrderBy(beer => beer.Name)
      .ToListAsync();
  }

  public Task<Beer?> GetByIdAsync(Guid id)
  {
    return context.Beer.FindAsync(id).AsTask();
  }

  public async Task<Beer> CreateAsync(Beer beer)
  {
    beer.Id = beer.Id == Guid.Empty ? Guid.NewGuid() : beer.Id;
    beer.CreatedAt = DateTime.UtcNow;
    beer.UpdatedAt = null;

    context.Beer.Add(beer);
    await context.SaveChangesAsync();

    return beer;
  }

  public async Task<Beer?> UpdateAsync(Guid id, Beer beer)
  {
    var existingBeer = await context.Beer.FindAsync(id);

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
    var beer = await context.Beer.FindAsync(id);

    if (beer is null)
    {
      return false;
    }

    context.Beer.Remove(beer);
    await context.SaveChangesAsync();

    return true;
  }
}
