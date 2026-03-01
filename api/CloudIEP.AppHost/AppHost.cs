using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<CloudIEP_Web>("api");

builder.AddViteApp("client", "../../cloud-iep-client")
    .WithEndpoint("http", endpoint =>
    {
        endpoint.Port = 5173;
        endpoint.IsProxied = false;
    })
    .WithReference(api);

builder.Build().Run();
