using System.Security.Claims;
using CloudIEP.Web.Authorization;
using CloudIEP.Web.IoC;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace CloudIEP.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        readonly string CorsPolicy = "CorsPolicy";
        readonly string ApiTitle = "CloudIEP API";
        readonly string ApiVersion = "v1";

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddData(Configuration);

            services.AddCors(options => options.AddPolicy(CorsPolicy, builder =>
            {
                builder.WithOrigins("http://localhost:3000")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            }));
            services.AddControllers();

            string domain = $"https://{Configuration["Auth0:Domain"]}";
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = Configuration["Auth0:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(Scopes.OpenIdScope, policy => policy.Requirements.Add(new HasScopeRequirement(Scopes.OpenIdScope, domain)));
                options.AddPolicy(Scopes.ReadStudentsScope, policy => policy.Requirements.Add(new HasScopeRequirement(Scopes.ReadStudentsScope, domain)));
            });

            services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(ApiVersion, new OpenApiInfo { Title = ApiTitle, Version = ApiVersion });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors(CorsPolicy);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint($"/swagger/{ApiVersion}/swagger.json", ApiTitle));
        }
    }
}
