using BeerFerment.Api.Data;
using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Services;

public class TankService(AppDbContext context) : ITankService
{
  public Task<List<Tank>> GetAllAsync()
  {
    return context.Tank
      .OrderBy(tank => tank.Name)
      .ToListAsync();
  }

  public Task<Tank?> GetByIdAsync(Guid id)
  {
    return context.Tank.FindAsync(id).AsTask();
  }

  public async Task<Tank> CreateAsync(Tank tank)
  {
    tank.Id = tank.Id == Guid.Empty ? Guid.NewGuid() : tank.Id;
    tank.CreatedAt = DateTime.UtcNow;
    tank.UpdatedAt = null;

    context.Tank.Add(tank);
    await context.SaveChangesAsync();

    return tank;
  }

  public async Task<Tank?> UpdateAsync(Guid id, Tank tank)
  {
    var existingTank = await context.Tank.FindAsync(id);

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
    var tank = await context.Tank.FindAsync(id);

    if (tank is null)
    {
      return false;
    }

    context.Tank.Remove(tank);
    await context.SaveChangesAsync();

    return true;
  }
}
