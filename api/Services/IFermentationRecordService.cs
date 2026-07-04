using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.DTOs.FermentationRecords;
using BrewMonitor.Api.Models;

namespace BrewMonitor.Api.Services;

public interface IFermentationRecordService
{
  Task<PaginatedResult<FermentationRecordResponse>> GetAllAsync(
    int page,
    int limit,
    string? search,
    string? sortBy,
    string? sortDirection,
    string? classification
  );
  Task<PaginatedResult<FermentationRecordResponse>> GetByBeerAsync(
    Guid beerId,
    int page,
    int limit
  );
  Task<PaginatedResult<FermentationRecordResponse>> GetByTankAsync(
    Guid tankId,
    int page,
    int limit
  );
  Task<FermentationRecordResponse?> GetByIdAsync(Guid id);
  Task<FermentationRecord> CreateAsync(FermentationRecord record);
  Task<FermentationRecord?> UpdateAsync(Guid id, FermentationRecord record);
  Task<bool> DeleteAsync(Guid id);
  Task<bool> BeerExistsAsync(Guid beerId);
  Task<bool> TankExistsAsync(Guid tankId);
}
