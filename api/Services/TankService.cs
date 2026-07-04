using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BrewMonitor.Api.Services;

public class TankService(AppDbContext context) : ITankService
{
  private const string SortDirectionDescending = "desc";

  public async Task<PaginatedResult<Tank>> GetAllAsync(
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
    var hasCapacitySearch = decimal.TryParse(
      search?.Replace(',', '.'),
      NumberStyles.Number,
      CultureInfo.InvariantCulture,
      out var capacitySearch
    );

    var query = context.Tanks
      .Where(tank =>
        string.IsNullOrWhiteSpace(search)
        || EF.Functions.ILike(tank.Name, $"%{search}%")
        || (hasCapacitySearch && tank.CapacityLiters == capacitySearch));

    query = ApplySorting(query, sortBy, sortDirection);

    var total = await query.CountAsync();
    var tanks = await query
      .Skip((page - 1) * limit)
      .Take(limit)
      .ToListAsync();

    return new PaginatedResult<Tank>
    {
      Data = tanks,
      Meta = new PaginationMeta
      {
        Total = total
      }
    };
  }

  private static IQueryable<Tank> ApplySorting(
    IQueryable<Tank> query,
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
      "capacityliters" => isDescending
        ? query.OrderByDescending(tank => tank.CapacityLiters).ThenBy(tank => tank.Name)
        : query.OrderBy(tank => tank.CapacityLiters).ThenBy(tank => tank.Name),
      "createdat" => isDescending
        ? query.OrderByDescending(tank => tank.CreatedAt).ThenBy(tank => tank.Name)
        : query.OrderBy(tank => tank.CreatedAt).ThenBy(tank => tank.Name),
      _ => isDescending
        ? query.OrderByDescending(tank => tank.Name)
        : query.OrderBy(tank => tank.Name)
    };
  }

  public Task<Tank?> GetByIdAsync(Guid id)
  {
    return context.Tanks.FindAsync(id).AsTask();
  }

  public Task<bool> ExistsAsync(Guid id)
  {
    return context.Tanks.AnyAsync(tank => tank.Id == id);
  }

  public Task<bool> HasFermentationRecordsAsync(Guid id)
  {
    return context.FermentationRecords.AnyAsync(record => record.TankId == id);
  }

  public async Task<Tank> CreateAsync(Tank tank)
  {
    tank.Id = tank.Id == Guid.Empty ? Guid.NewGuid() : tank.Id;
    tank.CreatedAt = DateTime.UtcNow;
    tank.UpdatedAt = null;

    context.Tanks.Add(tank);
    await context.SaveChangesAsync();

    return tank;
  }

  public async Task<Tank?> UpdateAsync(Guid id, Tank tank)
  {
    var existingTank = await context.Tanks.FindAsync(id);

    if (existingTank is null)
    {
      return null;
    }

    existingTank.Name = tank.Name;
    existingTank.CapacityLiters = tank.CapacityLiters;
    existingTank.UpdatedAt = DateTime.UtcNow;

    await context.SaveChangesAsync();

    return existingTank;
  }

  public async Task<bool> DeleteAsync(Guid id)
  {
    var tank = await context.Tanks.FindAsync(id);

    if (tank is null)
    {
      return false;
    }

    context.Tanks.Remove(tank);
    await context.SaveChangesAsync();

    return true;
  }
}
