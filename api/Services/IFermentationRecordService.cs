using BeerFerment.Api.Models;

namespace BeerFerment.Api.Services;

public interface IFermentationRecordService
{
  Task<List<FermentationRecord>> GetAllAsync();
  Task<FermentationRecord?> GetByIdAsync(Guid id);
  Task<FermentationRecord> CreateAsync(FermentationRecord record);
  Task<FermentationRecord?> UpdateAsync(Guid id, FermentationRecord record);
  Task<bool> DeleteAsync(Guid id);
  Task<bool> BeerExistsAsync(Guid beerId);
  Task<bool> TankExistsAsync(Guid tankId);
}
