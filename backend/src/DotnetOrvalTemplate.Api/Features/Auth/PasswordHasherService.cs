using Microsoft.AspNetCore.Identity;

namespace DotnetOrvalTemplate.Api.Features.Auth;

public class PasswordHasherService : IPasswordHasher
{
    private static readonly PasswordHasher<string> Hasher = new();

    public string HashPassword(string password)
    {
        return Hasher.HashPassword(string.Empty, password);
    }

    public bool VerifyPassword(string hashedPassword, string providedPassword)
    {
        var result = Hasher.VerifyHashedPassword(string.Empty, hashedPassword, providedPassword);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
