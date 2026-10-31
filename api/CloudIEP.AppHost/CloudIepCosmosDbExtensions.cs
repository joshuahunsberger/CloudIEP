using Aspire.Hosting.Azure;

namespace CloudIEP.AppHost;

public static class CloudIepCosmosDbExtensions
{
    public static IResourceBuilder<AzureCosmosDBDatabaseResource> AddCosmosDbSeederProcessCommands(
        this IResourceBuilder<AzureCosmosDBDatabaseResource> db)
    {
#pragma warning disable ASPIREPROCESSCOMMAND001
        db
            .WithProcessCommand(
                commandName: "run-seeder",
                displayName: "Run Database Seeder",
                processSpecFactory: async context =>
                {
                    var connStr = await db.Resource.ConnectionStringExpression.GetValueAsync(context.CancellationToken)
                                  ?? throw new InvalidOperationException("Could not resolve Cosmos connection string.");

                    return new ProcessCommandSpec("dotnet")
                    {
                        Arguments = ["run", "--project", "../CloudIEP.DatabaseSeeder/CloudIEP.DatabaseSeeder.csproj"],
                        EnvironmentVariables = { ["ConnectionStrings__CloudIEPDev"] = connStr }
                    };
                },
                commandOptions: new ProcessCommandOptions
                {
                    IconName = "Play",
                    Description = "Runs the database seeder to populate sample students and goals if empty"
                })
            .WithProcessCommand(
                commandName: "reset-and-reseed",
                displayName: "Reset & Reseed Sample Data",
                processSpecFactory: async context =>
                {
                    var connStr = await db.Resource.ConnectionStringExpression.GetValueAsync(context.CancellationToken)
                                  ?? throw new InvalidOperationException("Could not resolve Cosmos connection string.");

                    return new ProcessCommandSpec("dotnet")
                    {
                        Arguments =
                        [
                            "run", "--project", "../CloudIEP.DatabaseSeeder/CloudIEP.DatabaseSeeder.csproj", "--",
                            "--reset=true"
                        ],
                        EnvironmentVariables = { ["ConnectionStrings__CloudIEPDev"] = connStr }
                    };
                },
                commandOptions: new ProcessCommandOptions
                {
                    IconName = "ArrowCounterclockwise",
                    Description = "Clears existing students and goals, then re-seeds fresh sample data",
                    ConfirmationMessage =
                        "Are you sure you want to delete existing students and goals and re-seed sample data?"
                });
#pragma warning restore ASPIREPROCESSCOMMAND001

        return db;
    }
}
