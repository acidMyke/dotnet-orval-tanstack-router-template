using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace DotnetOrvalTemplate.Api.Tests;

public class AuthEndpointsTests : IClassFixture<TestApiFactory>
{
    private readonly HttpClient _client;

    public AuthEndpointsTests(TestApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_Then_Login_Works()
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", new { username = "alice", password = "Password123!" });
        registerResponse.EnsureSuccessStatusCode();

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new { username = "alice", password = "Password123!" });
        loginResponse.EnsureSuccessStatusCode();

        var payload = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(payload);
        Assert.Equal("alice", payload.Username);
        Assert.Equal("user", payload.Role);
        Assert.False(string.IsNullOrWhiteSpace(payload.AccessToken));
    }

    [Fact]
    public async Task GuestLogin_Returns_GuestRole()
    {
        var response = await _client.PostAsync("/api/auth/guest", content: null);
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(payload);
        Assert.Equal("guest", payload.Role);
        Assert.StartsWith("guest-", payload.Username);
        Assert.False(string.IsNullOrWhiteSpace(payload.AccessToken));
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns_Unauthorized()
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", new { username = "bob", password = "Password123!" });
        registerResponse.EnsureSuccessStatusCode();

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new { username = "bob", password = "WrongPassword" });

        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }

    private sealed class AuthResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}

public class TestApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["UseInMemoryDatabase"] = "true",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:Secret"] = "test-secret-key-for-jwt-token-generation-only",
                ["Jwt:ExpiresMinutes"] = "60"
            });
        });
    }
}
