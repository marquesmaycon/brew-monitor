using BrewMonitor.Api.Data;
using BrewMonitor.Api.Data.Seed;
using BrewMonitor.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
string frontendOrigin = "http://localhost:3000";

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy
            .WithOrigins(frontendOrigin)
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
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");

app.MapControllers().RequireCors("Frontend");

app.Run();
