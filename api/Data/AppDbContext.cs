using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Beer> Beer => Set<Beer>();
  public DbSet<Tank> Tank => Set<Tank>();
}
