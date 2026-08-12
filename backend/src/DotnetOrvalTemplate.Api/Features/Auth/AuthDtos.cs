namespace DotnetOrvalTemplate.Api.Features.Auth;

public record RegisterRequest(string Username, string Password);
public record LoginRequest(string Username, string Password);
public record AuthResponse(string AccessToken, string Username, string Role);
public record MeResponse(string UserId, string Username, string Role);
