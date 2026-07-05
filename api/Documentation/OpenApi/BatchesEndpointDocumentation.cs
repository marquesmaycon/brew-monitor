namespace BrewMonitor.Api.Documentation.OpenApi;

public static class BatchesEndpointDocumentation
{
  public sealed class ListAttribute()
    : EndpointDocumentationAttribute(
      "ListBatches",
      "Lista lotes",
      "Retorna uma lista paginada de lotes identificados a partir dos registros fermentativos."
    );

  public sealed class GetOverviewAttribute()
    : EndpointDocumentationAttribute(
      "GetBatchOverview",
      "Busca visão geral do lote",
      "Retorna os dados consolidados de um lote, incluindo informações principais e indicadores fermentativos."
    );

  public sealed class ListFermentationRecordsAttribute()
    : EndpointDocumentationAttribute(
      "ListBatchFermentationRecords",
      "Lista registros fermentativos do lote",
      "Retorna uma lista paginada de registros fermentativos associados a um número de lote."
    );
}
