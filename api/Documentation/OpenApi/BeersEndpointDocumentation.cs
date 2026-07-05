namespace BrewMonitor.Api.Documentation.OpenApi;

public static class BeersEndpointDocumentation
{
  public sealed class ListAttribute()
    : EndpointDocumentationAttribute(
      "ListBeers",
      "Lista cervejas",
      "Retorna uma lista paginada de cervejas, com suporte a busca, ordenação e direção de ordenação."
    );

  public sealed class GetByIdAttribute()
    : EndpointDocumentationAttribute(
      "GetBeerById",
      "Busca uma cerveja por ID",
      "Retorna os dados de uma cerveja específica a partir do seu identificador único."
    );

  public sealed class CreateAttribute()
    : EndpointDocumentationAttribute(
      "CreateBeer",
      "Cria uma cerveja",
      "Cria uma nova cerveja com nome e estilo para uso nos registros e parâmetros fermentativos."
    );

  public sealed class UpdateAttribute()
    : EndpointDocumentationAttribute(
      "UpdateBeer",
      "Atualiza uma cerveja",
      "Atualiza os dados de uma cerveja existente a partir do seu identificador único."
    );

  public sealed class DeleteAttribute()
    : EndpointDocumentationAttribute(
      "DeleteBeer",
      "Remove uma cerveja",
      "Remove uma cerveja existente, desde que ela não possua registros fermentativos associados."
    );

  public sealed class ListFermentationRecordsAttribute()
    : EndpointDocumentationAttribute(
      "ListBeerFermentationRecords",
      "Lista registros fermentativos da cerveja",
      "Retorna uma lista paginada de registros fermentativos associados a uma cerveja específica."
    );

  public sealed class GetFermentationParameterAttribute()
    : EndpointDocumentationAttribute(
      "GetBeerFermentationParameter",
      "Busca parâmetros fermentativos da cerveja",
      "Retorna os intervalos aceitáveis de temperatura, pH e extrato configurados para uma cerveja."
    );

  public sealed class CreateFermentationParameterAttribute()
    : EndpointDocumentationAttribute(
      "CreateBeerFermentationParameter",
      "Cria parâmetros fermentativos da cerveja",
      "Cria os intervalos aceitáveis de temperatura, pH e extrato para uma cerveja que ainda não possui parâmetros cadastrados."
    );

  public sealed class UpdateFermentationParameterAttribute()
    : EndpointDocumentationAttribute(
      "UpdateBeerFermentationParameter",
      "Atualiza parâmetros fermentativos da cerveja",
      "Atualiza os intervalos aceitáveis de temperatura, pH e extrato configurados para uma cerveja."
    );

  public sealed class DeleteFermentationParameterAttribute()
    : EndpointDocumentationAttribute(
      "DeleteBeerFermentationParameter",
      "Remove parâmetros fermentativos da cerveja",
      "Remove os parâmetros fermentativos cadastrados para uma cerveja específica."
    );
}
