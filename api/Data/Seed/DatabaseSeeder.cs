using BrewMonitor.Api.Enums;
using BrewMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewMonitor.Api.Data.Seed;

public static class DatabaseSeeder
{
  private const decimal TemperatureTolerancePercentage = 0.05m;
  private const decimal PhTolerance = 0.2m;
  private const decimal ExtractTolerancePercentage = 0.05m;
  private const int RecordsPerBatch = 30;
  private const decimal IndustryMinTemperature = -1m;
  private const decimal IndustryMaxTemperature = 22m;
  private const decimal IndustryMinPh = 3.9m;
  private const decimal IndustryMaxPh = 5.4m;
  private const decimal IndustryMinExtract = 1.8m;
  private const decimal IndustryMaxExtract = 22m;

  private static readonly DateTime BaseDate = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
  private static readonly DateTime DeliveryDate = new(2026, 7, 6, 0, 0, 0, DateTimeKind.Utc);
  private static readonly DateTime FirstRecordDate = DeliveryDate.AddDays(-60).AddHours(8);
  private static readonly DateTime LastRecordDate = DeliveryDate.AddHours(8);
  private static readonly DateTime MaxRecordDate = new(2026, 7, 6, 23, 59, 59, DateTimeKind.Utc);

  private static readonly (string Name, string Style)[] BeerCatalog =
  [
    ("Aurora Hop", "IPA"),
    ("Serra Clara", "Pilsen"),
    ("Malte Negro", "Stout"),
    ("Brisa Wit", "Witbier"),
    ("Lupulo Alto", "Double IPA"),
    ("Vale Lager", "Lager"),
    ("Cacau Porter", "Porter"),
    ("Campo Weiss", "Weiss"),
    ("Citrus Sour", "Sour"),
    ("Ouro Belgian", "Belgian Ale"),
    ("Neblina Hazy", "Hazy IPA"),
    ("Pedra Bock", "Bock"),
    ("Marzen do Vale", "Marzen"),
    ("Cedro Red", "Red Ale"),
    ("Tropical Session", "Session IPA"),
    ("Noite Imperial", "Imperial Stout"),
    ("Flor de Trigo", "Wheat Ale"),
    ("Ribeirao Kolsch", "Kolsch"),
    ("Ambar Especial", "Amber Ale"),
    ("Lima Gose", "Gose"),
    ("Ponte Pale", "Pale Ale"),
    ("Rota Saison", "Saison"),
    ("Carvalho Brown", "Brown Ale"),
    ("Prata Light", "Light Lager"),
    ("Mandarina APA", "American Pale Ale"),
    ("Cristal Puro", "Pilsner"),
    ("Mosaico IPA", "IPA"),
    ("Cafe Porter", "Porter"),
    ("Framboesa Sour", "Sour"),
    ("Luar Tripel", "Tripel"),
    ("Canela Dubbel", "Dubbel"),
    ("Pinheiro Lager", "Lager"),
    ("Granito Schwarz", "Schwarzbier"),
    ("Capim Wit", "Witbier"),
    ("Oceano NEIPA", "New England IPA"),
    ("Safra Vienna", "Vienna Lager"),
    ("Mel Golden", "Golden Ale"),
    ("Fogo Rauch", "Rauchbier"),
    ("Sol Session", "Session Ale"),
    ("Bergamota Sour", "Sour"),
    ("Castanha Brown", "Brown Ale"),
    ("Duna Blonde", "Blonde Ale"),
    ("Rubi Red", "Irish Red Ale"),
    ("Manga IPA", "Fruit IPA"),
    ("Sereno Pilsen", "Pilsen"),
    ("Boreal Baltic", "Baltic Porter"),
    ("Nectar Hefe", "Hefeweizen"),
    ("Cobre Alt", "Altbier"),
    ("Verde Hop", "West Coast IPA"),
    ("Estrela Lager", "Premium Lager")
  ];

  public static async Task SeedAsync(AppDbContext context)
  {
    await context.Database.MigrateAsync();

    var beers = BuildBeers();
    var tanks = BuildTanks();
    var parameters = BuildParameters(beers);
    var records = BuildRecords(beers, tanks, parameters);

    await AddMissingAsync(context.Beers, beers);
    await AddMissingAsync(context.Tanks, tanks);
    await context.SaveChangesAsync();

    await AddMissingAsync(context.FermentationParameters, parameters);
    await context.SaveChangesAsync();

    await AddMissingAsync(context.FermentationRecords, records);
    await context.SaveChangesAsync();
  }

  private static List<Beer> BuildBeers()
  {
    return [.. BeerCatalog
      .Select((beer, index) => new Beer
        {
          Id = CreateId(1, index + 1),
          Name = beer.Name,
          Style = beer.Style,
          CreatedAt = BaseDate,
          UpdatedAt = null
        }
      )
    ];
  }

  private static List<Tank> BuildTanks()
  {
    return [.. Enumerable.Range(1, 75)
      .Select(index => new Tank
        {
          Id = CreateId(2, index),
          Name = $"Tank {index:000}",
          CapacityLiters = 500m + (index % 20) * 500m,
          CreatedAt = BaseDate,
          UpdatedAt = null
        }
      )
    ];
  }

  private static List<FermentationParameter> BuildParameters(IReadOnlyList<Beer> beers)
  {
    return [.. beers
      .Select((beer, index) =>
        {
          var profile = GetFermentationProfile(beer.Style);

          return new FermentationParameter
          {
            Id = CreateId(3, index + 1),
            BeerId = beer.Id,
            MinTemperature = profile.MinTemperature,
            MaxTemperature = profile.MaxTemperature,
            MinPh = profile.MinPh,
            MaxPh = profile.MaxPh,
            MinExtract = profile.MinExtract,
            MaxExtract = profile.MaxExtract,
            CreatedAt = BaseDate,
            UpdatedAt = null
          };
        }
      )
    ];
  }

  private static List<FermentationRecord> BuildRecords(
    IReadOnlyList<Beer> beers,
    IReadOnlyList<Tank> tanks,
    IReadOnlyList<FermentationParameter> parameters
  )
  {
    return [.. Enumerable.Range(1, beers.Count * RecordsPerBatch)
      .Select(index =>
        {
          var beerIndex = (index - 1) / RecordsPerBatch;
          var recordIndex = (index - 1) % RecordsPerBatch;
          var beer = beers[beerIndex];
          var tank = tanks[(index - 1) % tanks.Count];
          var parameter = parameters[beerIndex];
          var (Temperature, Ph, Extract, Notes) = BuildMeasurement(parameter, (index - 1) % 4, index);
          var registeredAt = BuildRegisteredAt(recordIndex, beerIndex);
          var createdAt = registeredAt.AddMinutes(5 + index % 25);

          if (registeredAt > MaxRecordDate || createdAt > MaxRecordDate)
          {
            throw new InvalidOperationException("Seeded fermentation records cannot be dated after 2026-07-06.");
          }

          return new FermentationRecord
          {
            Id = CreateId(4, index),
            RegisteredAt = registeredAt,
            BeerId = beer.Id,
            TankId = tank.Id,
            BatchNumber = BuildBatchNumber(beer.Style, beerIndex + 1),
            Temperature = Temperature,
            Ph = Ph,
            Extract = Extract,
            Notes = Notes,
            Classification = Classify(Temperature, Ph, Extract, parameter),
            CreatedAt = createdAt,
            UpdatedAt = null
          };
        }
      )
    ];
  }

  private static DateTime BuildRegisteredAt(int recordIndex, int beerIndex)
  {
    var windowTicks = LastRecordDate.Ticks - FirstRecordDate.Ticks;
    var recordOffsetTicks = windowTicks * recordIndex / (RecordsPerBatch - 1);

    return FirstRecordDate
      .AddTicks(recordOffsetTicks)
      .AddMinutes((beerIndex % 8) * 7);
  }

  private static (decimal Temperature, decimal Ph, decimal Extract, string Notes) BuildMeasurement(
    FermentationParameter parameter,
    int scenario,
    int index
  )
  {
    var temperatureRange = parameter.MaxTemperature - parameter.MinTemperature;
    var phRange = parameter.MaxPh - parameter.MinPh;
    var extractRange = parameter.MaxExtract - parameter.MinExtract;

    var temperatureVariation = ((index % 5) - 2) * 0.25m;
    var phVariation = ((index % 3) - 1) * 0.03m;
    var extractVariation = ((index % 7) - 3) * 0.12m;

    var normalTemperature = Clamp(
      parameter.MinTemperature + temperatureRange * 0.55m + temperatureVariation,
      parameter.MinTemperature,
      parameter.MaxTemperature
    );
    var normalPh = Clamp(parameter.MinPh + phRange * 0.5m + phVariation, parameter.MinPh, parameter.MaxPh);
    var normalExtract = Clamp(
      parameter.MinExtract + extractRange * 0.5m + extractVariation,
      parameter.MinExtract,
      parameter.MaxExtract
    );

    var measurement = scenario switch
    {
      0 => (normalTemperature, normalPh, normalExtract, "Fermentacao dentro do padrao esperado."),
      1 => (parameter.MaxTemperature + 0.6m, normalPh, normalExtract, "Temperatura em faixa de atencao."),
      2 => (normalTemperature, parameter.MinPh - 0.1m, normalExtract, "pH em faixa de atencao."),
      _ => (parameter.MaxTemperature + 1.8m, parameter.MaxPh + 0.35m, parameter.MaxExtract + 0.8m, "Leitura fora do padrao aceitavel.")
    };

    return ClampMeasurementToIndustry(measurement);
  }

  private static FermentationProfile GetFermentationProfile(string style)
  {
    if (ContainsAny(style, "Sour", "Gose"))
    {
      return new FermentationProfile(18m, 22m, 3.9m, 4.2m, 1.8m, 4.2m);
    }

    if (ContainsAny(style, "Imperial Stout", "Baltic Porter"))
    {
      return new FermentationProfile(18m, 22m, 4.2m, 4.9m, 8.5m, 22m);
    }

    if (ContainsAny(style, "Double IPA", "Tripel", "Dubbel"))
    {
      return new FermentationProfile(18m, 22m, 4.0m, 4.8m, 6.5m, 16m);
    }

    if (ContainsAny(style, "Pilsen", "Pilsner", "Lager", "Kolsch", "Bock", "Marzen", "Vienna", "Schwarzbier", "Rauchbier"))
    {
      return new FermentationProfile(-1m, 13m, 4.1m, 4.7m, 1.8m, 8.5m);
    }

    if (ContainsAny(style, "Witbier", "Weiss", "Wheat", "Hefeweizen"))
    {
      return new FermentationProfile(17m, 22m, 4.0m, 4.7m, 2.2m, 8.5m);
    }

    if (ContainsAny(style, "IPA", "Pale Ale", "Session", "NEIPA"))
    {
      return new FermentationProfile(16m, 21m, 4.1m, 4.8m, 3.0m, 12m);
    }

    if (ContainsAny(style, "Stout", "Porter", "Brown", "Amber", "Red Ale", "Irish Red Ale"))
    {
      return new FermentationProfile(17m, 22m, 4.2m, 5.0m, 4.0m, 14m);
    }

    if (ContainsAny(style, "Belgian", "Saison", "Golden", "Blonde", "Altbier"))
    {
      return new FermentationProfile(18m, 22m, 4.0m, 4.9m, 3.2m, 13m);
    }

    return new FermentationProfile(16m, 22m, 4.1m, 4.8m, 2.4m, 10m);
  }

  private static FermentationRecordClassification Classify(
    decimal temperature,
    decimal ph,
    decimal extract,
    FermentationParameter parameter
  )
  {
    if (
      IsWithinRange(temperature, parameter.MinTemperature, parameter.MaxTemperature)
      && IsWithinRange(ph, parameter.MinPh, parameter.MaxPh)
      && IsWithinRange(extract, parameter.MinExtract, parameter.MaxExtract)
    )
    {
      return FermentationRecordClassification.WithinStandard;
    }

    if (
      IsWithinPercentageTolerance(
        temperature,
        parameter.MinTemperature,
        parameter.MaxTemperature,
        TemperatureTolerancePercentage
      )
      && IsWithinAbsoluteTolerance(ph, parameter.MinPh, parameter.MaxPh, PhTolerance)
      && IsWithinPercentageTolerance(
        extract,
        parameter.MinExtract,
        parameter.MaxExtract,
        ExtractTolerancePercentage
      )
    )
    {
      return FermentationRecordClassification.Attention;
    }

    return FermentationRecordClassification.OutOfStandard;
  }

  private static async Task AddMissingAsync<TEntity>(DbSet<TEntity> dbSet, IReadOnlyCollection<TEntity> entities)
    where TEntity : class
  {
    var entityIds = entities
      .Select(GetEntityId)
      .ToList();
    var existingIds = await dbSet
      .Where(entity => entityIds.Contains(EF.Property<Guid>(entity, nameof(Beer.Id))))
      .Select(entity => EF.Property<Guid>(entity, nameof(Beer.Id)))
      .ToListAsync();
    var existingIdSet = existingIds.ToHashSet();
    var missingEntities = entities
      .Where(entity => !existingIdSet.Contains(GetEntityId(entity)))
      .ToList();

    if (missingEntities.Count > 0)
    {
      dbSet.AddRange(missingEntities);
    }
  }

  private static Guid GetEntityId<TEntity>(TEntity entity)
  {
    var idProperty = typeof(TEntity).GetProperty(nameof(Beer.Id))
      ?? throw new InvalidOperationException($"{typeof(TEntity).Name} does not have an Id property.");

    return (Guid)(idProperty.GetValue(entity)
      ?? throw new InvalidOperationException($"{typeof(TEntity).Name} Id cannot be null."));
  }

  private static Guid CreateId(int group, int index)
  {
    return Guid.Parse($"00000000-0000-{group:x4}-0000-{index:x12}");
  }

  private static string BuildBatchNumber(string style, int index)
  {
    var prefix = new string([.. style
      .Where(char.IsLetter)
      .Take(3)
      .Select(char.ToUpperInvariant)
    ]);

    return $"{prefix}-{index:000}";
  }

  private static bool IsWithinRange(decimal value, decimal min, decimal max)
  {
    return value >= min && value <= max;
  }

  private static bool IsWithinAbsoluteTolerance(decimal value, decimal min, decimal max, decimal tolerance)
  {
    return value >= min - tolerance && value <= max + tolerance;
  }

  private static bool IsWithinPercentageTolerance(decimal value, decimal min, decimal max, decimal tolerancePercentage)
  {
    var lowerBound = min - Math.Abs(min * tolerancePercentage);
    var upperBound = max + Math.Abs(max * tolerancePercentage);

    return value >= lowerBound && value <= upperBound;
  }

  private static bool ContainsAny(string value, params string[] terms)
  {
    return terms.Any(term => value.Contains(term, StringComparison.OrdinalIgnoreCase));
  }

  private static decimal Clamp(decimal value, decimal min, decimal max)
  {
    return Math.Min(Math.Max(value, min), max);
  }

  private static (decimal Temperature, decimal Ph, decimal Extract, string Notes) ClampMeasurementToIndustry(
    (decimal Temperature, decimal Ph, decimal Extract, string Notes) measurement
  )
  {
    return (
      Clamp(measurement.Temperature, IndustryMinTemperature, IndustryMaxTemperature),
      Clamp(measurement.Ph, IndustryMinPh, IndustryMaxPh),
      Clamp(measurement.Extract, IndustryMinExtract, IndustryMaxExtract),
      measurement.Notes
    );
  }

  private readonly record struct FermentationProfile(
    decimal MinTemperature,
    decimal MaxTemperature,
    decimal MinPh,
    decimal MaxPh,
    decimal MinExtract,
    decimal MaxExtract
  );
}
