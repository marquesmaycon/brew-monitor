using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Models;

namespace BrewMonitor.Api.Services;

public interface ITankService
{
  Task<PaginatedResult<Tank>> GetAllAsync(int page, int limit);
  Task<Tank?> GetByIdAsync(Guid id);
  Task<Tank> CreateAsync(Tank tank);
  Task<Tank?> UpdateAsync(Guid id, Tank tank);
  Task<bool> DeleteAsync(Guid id);
}
