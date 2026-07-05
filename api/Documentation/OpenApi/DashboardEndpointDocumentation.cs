namespace BrewMonitor.Api.Documentation.OpenApi;

public static class DashboardEndpointDocumentation
{
  public sealed class GetSummaryAttribute()
    : EndpointDocumentationAttribute(
      "GetDashboardSummary",
      "Busca resumo do dashboard",
      "Retorna os totais de registros fermentativos agrupados por classificação."
    );

  public sealed class GetFermentationHistoryAttribute()
    : EndpointDocumentationAttribute(
      "GetDashboardFermentationHistory",
      "Busca histórico de fermentação",
      "Retorna os lotes disponíveis e os pontos históricos de temperatura, pH e extrato do lote selecionado."
    );
}
