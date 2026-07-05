using BrewMonitor.Api.Data;
using BrewMonitor.Api.Data.Seed;
using BrewMonitor.Api.Documentation.OpenApi;
using BrewMonitor.Api.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
string[] allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? [];

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info.Title = "Brew Monitor API";
        document.Info.Version = "v1";
        document.Info.Description = """
            API REST do Brew Monitor para acompanhamento de fermentação cervejeira.

            A API permite gerenciar cervejas, tanques, parâmetros fermentativos, apontamentos de fermentação, dashboards e histórico por lote.

            Use esta documentação visual para consultar contratos, schemas e testar chamadas em ambiente de desenvolvimento.
            """;

        return Task.CompletedTask;
    });
    options.AddOperationTransformer((operation, context, cancellationToken) =>
    {
        var endpointDocumentation = context.Description.ActionDescriptor.EndpointMetadata
            .OfType<EndpointDocumentationAttribute>()
            .FirstOrDefault();

        if (endpointDocumentation is not null)
        {
            operation.OperationId = endpointDocumentation.EndpointName;
            operation.Summary = endpointDocumentation.Summary;
            operation.Description = endpointDocumentation.Description;
        }

        return Task.CompletedTask;
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper)
        )
    );
builder.Services.AddDbContext<AppDbContext>(options =>
        options
            .UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
            .UseSnakeCaseNamingConvention()
    );
builder.Services.AddScoped<IBeerService, BeerService>();
builder.Services.AddScoped<IBatchService, BatchService>();
builder.Services.AddScoped<ITankService, TankService>();
builder.Services.AddScoped<IFermentationRecordService, FermentationRecordService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DatabaseSeeder.SeedAsync(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");

app.MapControllers().RequireCors("Frontend");

app.MapGet("/", () => Results.Ok(new
{
    status = "Healthy",
    service = "BrewMonitor.Api",
    timestamp = DateTimeOffset.UtcNow
}))
.WithName("HealthCheck")
.WithSummary("Healthcheck da API")
.WithDescription("Retorna um payload simples para confirmar que a API está online.");

app.Run();
