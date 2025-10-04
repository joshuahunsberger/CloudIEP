using System.Linq;
using CloudIEP.Data;
using CloudIEP.Data.CosmosDB;
using CloudIEP.Web.Options;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CloudIEP.Web.IoC;

public static class CosmosDbServiceCollectionExtensions
{
    public static IServiceCollection AddCosmosDb(this IServiceCollection services, CosmosDbOptions cosmosDbOptions)
    {
        var cosmosClientOptions = new CosmosClientOptions
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
            }
        };

        var cosmosClient = new CosmosClient(cosmosDbOptions.Endpoint.ToString(), cosmosDbOptions.Key, cosmosClientOptions);

        var collectionNames = cosmosDbOptions.Collections.Select(n => n.Name).ToList();

        var cosmosDbClientFactory = new CosmosDbClientFactory(cosmosDbOptions.DatabaseName, collectionNames, cosmosClient);
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
