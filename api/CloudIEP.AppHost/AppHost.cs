using Projects;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<CloudIEP_Web>("api");

builder.Build().Run();
