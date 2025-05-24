using System.Security.Claims;
using CloudIEP.Web;
using CloudIEP.Web.Authorization;
using CloudIEP.Web.IoC;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

const string CorsPolicy = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

var Configuration = builder.Configuration;

var services = builder.Services;

services.AddData(Configuration);

services.AddCors(options => options.AddPolicy(CorsPolicy, builder =>
{
    builder.WithOrigins("http://localhost:3000")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
}));

services.AddControllers();

var domain = $"https://{Configuration["Auth0:Domain"]}";
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
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


services.AddSwaggerGen(c => c.ConfigureSwaggerGenOptions(domain));

var app = builder.Build();

app.UseCors(CorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseSwaggerDocs();

app.Run();
