using BrewMonitor.Api.Data;
using BrewMonitor.Api.DTOs.Common;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Services;

public class TankService(AppDbContext context) : ITankService
{
  public async Task<PaginatedResult<Tank>> GetAllAsync(int page, int limit)
  {
    page = Math.Max(page, 1);
    limit = Math.Max(limit, 1);

    var query = context.Tanks
      .OrderBy(tank => tank.Name);

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

  public Task<Tank?> GetByIdAsync(Guid id)
  {
    return context.Tanks.FindAsync(id).AsTask();
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
