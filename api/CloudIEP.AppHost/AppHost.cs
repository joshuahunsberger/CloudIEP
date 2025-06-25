using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<CloudIEP_Web>("api");

builder.AddNpmApp("client", "../../cloud-iep-client")
        .WaitFor(api);

builder.Build().Run();
