using Projects;

var builder = DistributedApplication.CreateBuilder(args);

#pragma warning disable ASPIRECOSMOSDB001
var cosmos = builder.AddAzureCosmosDB("cosmos-db")
    .RunAsPreviewEmulator(emulator =>
    {
        emulator.WithDataExplorer();
    });
#pragma warning restore ASPIRECOSMOSDB001

var db = cosmos.AddCosmosDatabase("CloudIEPDev");

var goals = db.AddContainer("Goals", "/id");
var students = db.AddContainer("Students", "/id");
var users = db.AddContainer("Users", "/id");

var seeder = builder.AddProject<CloudIEP_DatabaseSeeder>("seeder")
    .WithReference(db)
    .WaitFor(db)
    .WaitFor(goals)
    .WaitFor(students)
    .WaitFor(users);

var api = builder.AddProject<CloudIEP_Web>("api")
    .WithReference(db)
    .WithReference(goals)
    .WithReference(students)
    .WithReference(users)
    .WaitForCompletion(seeder);

#pragma warning disable ASPIREBROWSERLOGS001
builder.AddViteApp("client", "../../cloud-iep-client")
    .WithEndpoint("http", endpoint =>
    {
        endpoint.Port = 5173;
        endpoint.IsProxied = false;
    })
    .WithReference(api)
    .WaitFor(api)
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithBrowserLogs();
#pragma warning restore ASPIREBROWSERLOGS001

builder.Build().Run();
