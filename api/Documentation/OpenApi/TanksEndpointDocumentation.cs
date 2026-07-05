namespace BrewMonitor.Api.Documentation.OpenApi;

public static class TanksEndpointDocumentation
{
  public sealed class ListAttribute()
    : EndpointDocumentationAttribute(
      "ListTanks",
      "Lista tanques",
      "Retorna uma lista paginada de tanques, com suporte a busca, ordenação e direção de ordenação."
    );

  public sealed class GetByIdAttribute()
    : EndpointDocumentationAttribute(
      "GetTankById",
      "Busca um tanque por ID",
      "Retorna os dados de um tanque específico a partir do seu identificador único."
    );

  public sealed class CreateAttribute()
    : EndpointDocumentationAttribute(
      "CreateTank",
      "Cria um tanque",
      "Cria um novo tanque com nome e capacidade para uso nos registros fermentativos."
    );

  public sealed class UpdateAttribute()
    : EndpointDocumentationAttribute(
      "UpdateTank",
      "Atualiza um tanque",
      "Atualiza os dados de um tanque existente a partir do seu identificador único."
    );

  public sealed class DeleteAttribute()
    : EndpointDocumentationAttribute(
      "DeleteTank",
      "Remove um tanque",
      "Remove um tanque existente, desde que ele não possua registros fermentativos associados."
    );

  public sealed class ListFermentationRecordsAttribute()
    : EndpointDocumentationAttribute(
      "ListTankFermentationRecords",
      "Lista registros fermentativos do tanque",
      "Retorna uma lista paginada de registros fermentativos associados a um tanque específico."
    );
}
