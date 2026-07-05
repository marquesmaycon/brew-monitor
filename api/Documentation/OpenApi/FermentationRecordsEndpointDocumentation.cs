namespace BrewMonitor.Api.Documentation.OpenApi;

public static class FermentationRecordsEndpointDocumentation
{
  public sealed class ListAttribute()
    : EndpointDocumentationAttribute(
      "ListFermentationRecords",
      "Lista registros fermentativos",
      "Retorna uma lista paginada de registros fermentativos, com suporte a busca, filtros e ordenação."
    );

  public sealed class GetByIdAttribute()
    : EndpointDocumentationAttribute(
      "GetFermentationRecordById",
      "Busca um registro fermentativo por ID",
      "Retorna os dados de um registro fermentativo específico a partir do seu identificador único."
    );

  public sealed class CreateAttribute()
    : EndpointDocumentationAttribute(
      "CreateFermentationRecord",
      "Cria um registro fermentativo",
      "Cria um novo apontamento fermentativo vinculado a uma cerveja, tanque, lote e data de registro."
    );

  public sealed class UpdateAttribute()
    : EndpointDocumentationAttribute(
      "UpdateFermentationRecord",
      "Atualiza um registro fermentativo",
      "Atualiza os dados de um registro fermentativo existente e recalcula sua classificação."
    );

  public sealed class DeleteAttribute()
    : EndpointDocumentationAttribute(
      "DeleteFermentationRecord",
      "Remove um registro fermentativo",
      "Remove um registro fermentativo existente a partir do seu identificador único."
    );
}
