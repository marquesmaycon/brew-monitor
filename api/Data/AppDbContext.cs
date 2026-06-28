using BeerFerment.Api.Enums;
using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Beer> Beers => Set<Beer>();
  public DbSet<FermentationParameter> FermentationParameters => Set<FermentationParameter>();
  public DbSet<FermentationRecord> FermentationRecords => Set<FermentationRecord>();
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

    modelBuilder.Entity<FermentationRecord>()
      .HasOne(record => record.Beer)
      .WithMany()
      .HasForeignKey(record => record.BeerId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<FermentationRecord>()
      .HasOne(record => record.Tank)
      .WithMany()
      .HasForeignKey(record => record.TankId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<FermentationRecord>()
      .HasIndex(record => record.BatchNumber);

    modelBuilder.Entity<FermentationRecord>()
      .Property(record => record.Classification)
      .HasConversion(
        classification => ToDatabaseClassification(classification),
        value => FromDatabaseClassification(value)
      );
  }

  private static string ToDatabaseClassification(FermentationRecordClassification classification)
  {
    return classification switch
    {
      FermentationRecordClassification.WithinStandard => "WITHIN_STANDARD",
      FermentationRecordClassification.Attention => "ATTENTION",
      FermentationRecordClassification.OutOfStandard => "OUT_OF_STANDARD",
      _ => throw new InvalidOperationException($"Unsupported fermentation record classification: {classification}")
    };
  }

  private static FermentationRecordClassification FromDatabaseClassification(string value)
  {
    return value switch
    {
      "WITHIN_STANDARD" => FermentationRecordClassification.WithinStandard,
      "ATTENTION" => FermentationRecordClassification.Attention,
      "OUT_OF_STANDARD" => FermentationRecordClassification.OutOfStandard,
      _ => throw new InvalidOperationException($"Unsupported fermentation record classification value: {value}")
    };
  }
}
