using System;
using System.Collections.Generic;
using CloudIEP.Web.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CloudIEP.Web;

public static class SwashbuckleExtensions
{
    const string ApiTitle = "CloudIEP";
    const string ApiVersion = "v1";

    public static void ConfigureSwaggerGenOptions(this SwaggerGenOptions c, string domain)
    {
        c.SwaggerDoc(ApiVersion, new OpenApiInfo { Title = ApiTitle, Version = ApiVersion });

        c.AddSecurityDefinition("OAuth2", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.OAuth2,
            Flows = new OpenApiOAuthFlows
            {
                AuthorizationCode = new OpenApiOAuthFlow
                {
                    AuthorizationUrl = new Uri(domain + "/connect/authorize"),
                    TokenUrl = new Uri(domain + "/oauth/token"),
                    Scopes = new Dictionary<string, string>
                    {
                        { Scopes.OpenIdScope, "OpenId Scope" },
                        { Scopes.ReadStudentsScope, "Read Students Scope" }
                    }
                }
            },
            Description = "CloudIEP API Authorization"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "OAuth2" }
                },
                new[] { Scopes.OpenIdScope, Scopes.ReadStudentsScope }
            }
        });
    }
    
    public static WebApplication UseSwaggerDocs(this WebApplication app)
    {
        var swaggerClientId = app.Configuration["Auth0:SwaggerClientId"];
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint($"/swagger/{ApiVersion}/swagger.json", ApiTitle);
            c.OAuthClientId(swaggerClientId);
            c.OAuthAdditionalQueryStringParams(new Dictionary<string, string>
                { { "audience", app.Configuration["Auth0:Audience"] } });
            c.OAuthScopes(Scopes.OpenIdScope, Scopes.ReadStudentsScope);
            c.OAuthUsePkce();
        });

        return app;
    }
}
