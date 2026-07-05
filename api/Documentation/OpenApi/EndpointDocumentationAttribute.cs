namespace BrewMonitor.Api.Documentation.OpenApi;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = false)]
public abstract class EndpointDocumentationAttribute(
  string name,
  string summary,
  string description
) : Attribute, IEndpointNameMetadata
{
  public string EndpointName { get; } = name;

  public string Summary { get; } = summary;

  public string Description { get; } = description;
}
