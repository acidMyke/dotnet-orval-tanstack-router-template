namespace DotnetOrvalTemplate.Api.Features.Auth;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string hashedPassword, string providedPassword);
}
