using BrewMonitor.Api.Enums;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Beer> Beers => Set<Beer>();
  public DbSet<FermentationParameter> FermentationParameters => Set<FermentationParameter>();
  public DbSet<FermentationRecord> FermentationRecords => Set<FermentationRecord>();
  public DbSet<Tank> Tanks => Set<Tank>();

  /// <summary>
  /// Configura o mapeamento do modelo. Aplica exclusão Restrict em Beer/Tank (impedindo a deleção com registros associados), 
  /// Cascade em FermentationParameter, além de criar o índice físico em BatchNumber para otimizar pesquisas.
  /// </summary>
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

  /// <summary>
  /// Converte a classificação (enum) em string para salvar no banco, mantendo o padrão UPPER_SNAKE_CASE 
  /// alinhado com a serialização JSON definida no JsonStringEnumConverter.
  /// </summary>
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

  /// <summary>
  /// Converte a representação string (UPPER_SNAKE_CASE) armazenada no banco de volta para o enum correspondente.
  /// </summary>
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
