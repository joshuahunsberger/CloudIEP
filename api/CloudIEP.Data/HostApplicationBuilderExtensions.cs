using Microsoft.Extensions.Hosting;

namespace CloudIEP.Data;

public static class HostApplicationBuilderExtensions
{
    public static IHostApplicationBuilder AddCloudIEPData(this IHostApplicationBuilder builder)
    {
        builder.AddCosmosDbContext<CloudIEPDbContext>("CloudIEPDev");
        return builder;
    }
}
