using CloudIEP.Domain.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CloudIEP.Domain.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IGoalService, GoalService>();
        services.AddScoped<IUserService, UserService>();
        return services;
    }
}
