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

var api = builder.AddProject<CloudIEP_Web>("api")
    .WithReference(db)
    .WithReference(goals)
    .WithReference(students)
    .WithReference(users);

builder.AddViteApp("client", "../../cloud-iep-client")
    .WithEndpoint("http", endpoint =>
    {
        endpoint.Port = 5173;
        endpoint.IsProxied = false;
    })
    .WithReference(api);

builder.Build().Run();
