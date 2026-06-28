using BeerFerment.Api.Enums;
using BeerFerment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BeerFerment.Api.Data.Seed;

public static class DatabaseSeeder
{
  private const decimal TemperatureTolerancePercentage = 0.05m;
  private const decimal PhTolerance = 0.2m;
  private const decimal ExtractTolerancePercentage = 0.05m;

  private static readonly DateTime BaseDate = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

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
          CreatedAt = BaseDate.AddDays(index),
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
          CreatedAt = BaseDate.AddDays(index % 30).AddHours(6),
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
          var profile = index % 5;
          var minTemperature = 8m + profile * 2m;
          var minPh = 4.1m + profile * 0.1m;
          var minExtract = 2.5m + profile * 0.4m;

          return new FermentationParameter
          {
            Id = CreateId(3, index + 1),
            BeerId = beer.Id,
            MinTemperature = minTemperature,
            MaxTemperature = minTemperature + 4m,
            MinPh = minPh,
            MaxPh = minPh + 0.5m,
            MinExtract = minExtract,
            MaxExtract = minExtract + 1.8m,
            CreatedAt = beer.CreatedAt.AddDays(1),
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
    return [.. Enumerable.Range(1, 200)
      .Select(index =>
        {
          var beerIndex = (index - 1) / 4;
          var beer = beers[beerIndex];
          var tank = tanks[(index - 1) % tanks.Count];
          var parameter = parameters[beerIndex];
          var (Temperature, Ph, Extract, Notes) = BuildMeasurement(parameter, (index - 1) % 4);
          var createdAt = BaseDate.AddDays(90 + index).AddHours(index % 24);

          return new FermentationRecord
          {
            Id = CreateId(4, index),
            RegisteredAt = createdAt.AddMinutes(-30),
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

  private static (decimal Temperature, decimal Ph, decimal Extract, string Notes) BuildMeasurement(
    FermentationParameter parameter,
    int scenario
  )
  {
    var temperatureMidpoint = (parameter.MinTemperature + parameter.MaxTemperature) / 2m;
    var phMidpoint = (parameter.MinPh + parameter.MaxPh) / 2m;
    var extractMidpoint = (parameter.MinExtract + parameter.MaxExtract) / 2m;

    return scenario switch
    {
      0 => (temperatureMidpoint, phMidpoint, extractMidpoint, "Fermentacao dentro do padrao esperado."),
      1 => (parameter.MaxTemperature * 1.03m, phMidpoint, extractMidpoint, "Temperatura em faixa de atencao."),
      2 => (temperatureMidpoint, parameter.MinPh - 0.1m, extractMidpoint, "pH em faixa de atencao."),
      _ => (parameter.MaxTemperature * 1.12m, parameter.MaxPh + 0.4m, parameter.MaxExtract * 1.12m, "Leitura fora do padrao aceitavel.")
    };
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
}
