using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Beers;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Services;

public class BeerService(AppDbContext context) : IBeerService
{
  private const string SortDirectionDescending = "desc";

  public async Task<PaginatedResult<BeerResponse>> GetAllAsync(
    int page,
    int limit,
    string? search,
    string? sortBy,
    string? sortDirection
  )
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);
    search = search?.Trim();
    sortBy = sortBy?.Trim();
    sortDirection = sortDirection?.Trim();

    var query = context.Beers
      .Where(beer =>
        string.IsNullOrWhiteSpace(search)
        || EF.Functions.ILike(beer.Name, $"%{search}%")
        || EF.Functions.ILike(beer.Style, $"%{search}%"));

    query = ApplySorting(query, sortBy, sortDirection);

    var total = await query.CountAsync();
    var beers = await query
      .Skip((page - 1) * limit)
      .Take(limit)
      .Select(beer => new BeerResponse
      {
        Id = beer.Id,
        Name = beer.Name,
        Style = beer.Style,
        CreatedAt = beer.CreatedAt,
        UpdatedAt = beer.UpdatedAt,
        FermentationParameter = beer.FermentationParameter == null
          ? null
          : new BeerFermentationParameterResponse
          {
            MinTemperature = beer.FermentationParameter.MinTemperature,
            MaxTemperature = beer.FermentationParameter.MaxTemperature,
            MinPh = beer.FermentationParameter.MinPh,
            MaxPh = beer.FermentationParameter.MaxPh,
            MinExtract = beer.FermentationParameter.MinExtract,
            MaxExtract = beer.FermentationParameter.MaxExtract
          }
      })
      .ToListAsync();

    return new PaginatedResult<BeerResponse>
    {
      Data = beers,
      Meta = new PaginationMeta
      {
        Total = total
      }
    };
  }

  private static IQueryable<Beer> ApplySorting(
    IQueryable<Beer> query,
    string? sortBy,
    string? sortDirection
  )
  {
    var isDescending = string.Equals(
      sortDirection,
      SortDirectionDescending,
      StringComparison.OrdinalIgnoreCase
    );

    return sortBy?.ToLowerInvariant() switch
    {
      "style" => isDescending
        ? query.OrderByDescending(beer => beer.Style).ThenBy(beer => beer.Name)
        : query.OrderBy(beer => beer.Style).ThenBy(beer => beer.Name),
      "createdat" => isDescending
        ? query.OrderByDescending(beer => beer.CreatedAt).ThenBy(beer => beer.Name)
        : query.OrderBy(beer => beer.CreatedAt).ThenBy(beer => beer.Name),
      _ => isDescending
        ? query.OrderByDescending(beer => beer.Name)
        : query.OrderBy(beer => beer.Name)
    };
  }

  public Task<BeerResponse?> GetByIdAsync(Guid id)
  {
    return context.Beers
      .Where(beer => beer.Id == id)
      .Select(beer => new BeerResponse
      {
        Id = beer.Id,
        Name = beer.Name,
        Style = beer.Style,
        CreatedAt = beer.CreatedAt,
        UpdatedAt = beer.UpdatedAt,
        FermentationParameter = beer.FermentationParameter == null
          ? null
          : new BeerFermentationParameterResponse
          {
            MinTemperature = beer.FermentationParameter.MinTemperature,
            MaxTemperature = beer.FermentationParameter.MaxTemperature,
            MinPh = beer.FermentationParameter.MinPh,
            MaxPh = beer.FermentationParameter.MaxPh,
            MinExtract = beer.FermentationParameter.MinExtract,
            MaxExtract = beer.FermentationParameter.MaxExtract
          }
      })
      .FirstOrDefaultAsync();
  }

  public Task<bool> ExistsAsync(Guid id)
  {
    return context.Beers.AnyAsync(beer => beer.Id == id);
  }

  public Task<bool> HasFermentationRecordsAsync(Guid id)
  {
    return context.FermentationRecords.AnyAsync(record => record.BeerId == id);
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
