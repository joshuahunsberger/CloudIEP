using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CloudIEP.Data;

public static class HostApplicationBuilderExtensions
{
    public static IHostApplicationBuilder AddCloudIEPData(this IHostApplicationBuilder builder)
    {
        builder.AddCosmosDbContext<CloudIEPDbContext>("CloudIEPDev");
        builder.Services.AddScoped<IStudentRepository, StudentRepository>();
        builder.Services.AddScoped<IGoalRepository, GoalRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        return builder;
    }
}
