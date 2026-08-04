using CloudIEP.Data;
using CloudIEP.DatabaseSeeder;

var builder = Host.CreateApplicationBuilder(args);
builder.AddCloudIEPData();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();