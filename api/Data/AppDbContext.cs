using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Beer> Beers => Set<Beer>();
  public DbSet<FermentationParameter> FermentationParameters => Set<FermentationParameter>();
  public DbSet<Tank> Tanks => Set<Tank>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Beer>()
      .HasOne(beer => beer.FermentationParameter)
      .WithOne(parameter => parameter.Beer)
      .HasForeignKey<FermentationParameter>(parameter => parameter.BeerId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<FermentationParameter>()
      .HasIndex(parameter => parameter.BeerId)
      .IsUnique();
  }
}
