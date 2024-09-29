using System.Linq;
using CloudIEP.Data;
using CloudIEP.Data.CosmosDB;
using CloudIEP.Web.Options;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CloudIEP.Web.IoC;

public static class CosmosDbServiceCollectionExtensions
{
    public static IServiceCollection AddCosmosDb(this IServiceCollection services, CosmosDbOptions cosmosDbOptions)
    {
        var documentClient = new DocumentClient(new System.Uri("https://cosmosdb.domain:8081"), "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==", new JsonSerializerSettings
        //var documentClient = new DocumentClient(cosmosDbOptions.Endpoint, cosmosDbOptions.Key, new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            DefaultValueHandling = DefaultValueHandling.Ignore,
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        });
        documentClient.OpenAsync().Wait();

        var collectionNames = cosmosDbOptions.Collections.Select(n => n.Name).ToList();

        var cosmosDbClientFactory = new CosmosDbClientFactory(cosmosDbOptions.DatabaseName, collectionNames, documentClient);
        cosmosDbClientFactory.EnsureDbSetupAsync().Wait();

        services.AddSingleton<ICosmosDbClientFactory>(cosmosDbClientFactory);

        return services;
    }

    public static IServiceCollection AddData(this IServiceCollection services, IConfiguration config)
    {
        var cosmosDbOptions = config.GetSection("CosmosDB")
            .Get<CosmosDbOptions>();

        return services.AddCosmosDb(cosmosDbOptions)
            .AddScoped<IStudentRepository, StudentRepository>()
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<IGoalRepository, GoalRepository>();
    }
}
