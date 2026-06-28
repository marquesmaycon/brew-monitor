using BeerFerment.Api.Models;

namespace BeerFerment.Api.Services;

public interface IBeerService
{
  Task<List<Beer>> GetAllAsync();
  Task<Beer?> GetByIdAsync(Guid id);
  Task<Beer> CreateAsync(Beer beer);
  Task<Beer?> UpdateAsync(Guid id, Beer beer);
  Task<bool> DeleteAsync(Guid id);
}
