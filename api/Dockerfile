FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["BrewMonitor.Api.csproj", "./"]
RUN dotnet restore "BrewMonitor.Api.csproj"

COPY . .
RUN dotnet publish "BrewMonitor.Api.csproj" \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["sh", "-c", "exec dotnet BrewMonitor.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
