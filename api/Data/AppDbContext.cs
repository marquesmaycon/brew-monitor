using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Beer> Beers => Set<Beer>();
  public DbSet<Tank> Tanks => Set<Tank>();
}
