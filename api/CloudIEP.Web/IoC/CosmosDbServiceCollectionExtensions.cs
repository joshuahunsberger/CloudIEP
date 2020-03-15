using System.Linq;
using CloudIEP.Data;
using CloudIEP.Data.CosmosDB;
using CloudIEP.Web.Options;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CloudIEP.Web.IoC
{
    public static class CosmosDbServiceCollectionExtensions
    {
        public static IServiceCollection AddCosmosDb(this IServiceCollection services, CosmosDbOptions cosmosDbOptions)
        {
            var documentClient = new DocumentClient(cosmosDbOptions.Endpoint, cosmosDbOptions.Key, new JsonSerializerSettings
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
                .AddScoped<IStudentRepository, StudentRepository>();
        }
    }
}
