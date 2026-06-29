using BrewMonitor.Api.Models;

namespace BrewMonitor.Api.Services;

public interface IBeerService
{
  Task<PaginatedResult<Beer>> GetAllAsync(int page, int limit);
  Task<Beer?> GetByIdAsync(Guid id);
  Task<bool> ExistsAsync(Guid id);
  Task<Beer> CreateAsync(Beer beer);
  Task<Beer?> UpdateAsync(Guid id, Beer beer);
  Task<bool> DeleteAsync(Guid id);
  Task<FermentationParameter?> GetFermentationParameterAsync(Guid beerId);
  Task<FermentationParameter> CreateFermentationParameterAsync(Guid beerId, FermentationParameter parameter);
  Task<FermentationParameter?> UpdateFermentationParameterAsync(Guid beerId, FermentationParameter parameter);
  Task<bool> DeleteFermentationParameterAsync(Guid beerId);
}
