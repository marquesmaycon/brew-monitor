using BrewMonitor.Api.DTOs.Batches;
using BrewMonitor.Api.DTOs.Common;

namespace BrewMonitor.Api.Services;

public interface IBatchService
{
  Task<PaginatedResult<BatchResponse>> GetAllAsync(int page, int limit);
  Task<BatchOverviewResponse?> GetOverviewAsync(string batchNumber);
  Task<PaginatedResult<BatchFermentationRecordResponse>?> GetFermentationRecordsAsync(
    string batchNumber,
    int page,
    int limit
  );
}
