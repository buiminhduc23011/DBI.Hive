using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using DBI.Task.Domain.Entities;
using DBI.Task.Infrastructure.Repositories;
using DBI.Task.Application.DTOs;

namespace DBI.Task.Application.Services;

public interface IAuthService
{
    System.Threading.Tasks.Task<AuthResponse?> LoginAsync(LoginRequest request);
    System.Threading.Tasks.Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    System.Threading.Tasks.Task<AuthResponse?> RefreshTokenAsync(string refreshToken);
    System.Threading.Tasks.Task<bool> RevokeTokenAsync(string refreshToken);
    System.Threading.Tasks.Task<UserDto?> GetUserByIdAsync(string userId);
    System.Threading.Tasks.Task<IEnumerable<UserDto>> GetAllUsersAsync();
    System.Threading.Tasks.Task<UserDto?> UpdateProfileAsync(string userId, UpdateProfileRequest request);
    System.Threading.Tasks.Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request);
}

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IConfiguration _configuration;
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    private readonly int _jwtExpiryMinutes;

    public AuthService(IRepository<User> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _jwtSecret = _configuration["Jwt:Secret"] ?? "DBI_Task_Secret_Key_Min_32_Characters_Required_For_Security";
        _jwtIssuer = _configuration["Jwt:Issuer"] ?? "DBI.Task.API";
        _jwtAudience = _configuration["Jwt:Audience"] ?? "DBI.Task.Client";
        _jwtExpiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60");
    }

    public async System.Threading.Tasks.Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        // Tìm user bằng email hoặc username
        var emailOrUsername = request.EmailOrUsername;
        var user = await _userRepository.FindOneAsync(u => 
            u.Email == emailOrUsername || u.Username == emailOrUsername);

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            return null;

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapToUserDto(user)
        };
    }

    public async System.Threading.Tasks.Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.FindOneAsync(u => u.Email == request.Email);
        if (existingUser != null)
            return null;

        // Kiểm tra username đã tồn tại chưa
        if (!string.IsNullOrEmpty(request.Username))
        {
            var existingUsername = await _userRepository.FindOneAsync(u => u.Username == request.Username);
            if (existingUsername != null)
                return null;
        }

        var user = new User
        {
            Email = request.Email,
            Username = request.Username,
            FullName = request.FullName,
            PasswordHash = HashPassword(request.Password),
            Role = Domain.Enums.UserRole.Member,
            CreatedAt = DateTime.UtcNow
        };

        user = await _userRepository.AddAsync(user);

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userRepository.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapToUserDto(user)
        };
    }

    public async System.Threading.Tasks.Task<AuthResponse?> RefreshTokenAsync(string refreshToken)
    {
        var user = await _userRepository.FindOneAsync(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null;

        var accessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userRepository.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            User = MapToUserDto(user)
        };
    }

    public async System.Threading.Tasks.Task<bool> RevokeTokenAsync(string refreshToken)
    {
        var user = await _userRepository.FindOneAsync(u => u.RefreshToken == refreshToken);

        if (user == null)
            return false;

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async System.Threading.Tasks.Task<UserDto?> GetUserByIdAsync(string userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user == null ? null : MapToUserDto(user);
    }

    public async System.Threading.Tasks.Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToUserDto);
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtExpiryMinutes),
            Issuer = _jwtIssuer,
            Audience = _jwtAudience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        var hashedInput = HashPassword(password);
        return hashedInput == passwordHash;
    }

    private UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            Theme = user.Theme,
            Language = user.Language
        };
    }

    public async System.Threading.Tasks.Task<UserDto?> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return null;

        // Kiểm tra username đã tồn tại chưa nếu thay đổi
        if (!string.IsNullOrEmpty(request.Username) && request.Username != user.Username)
        {
            var existingUsername = await _userRepository.FindOneAsync(u => u.Username == request.Username && u.Id != userId);
            if (existingUsername != null)
                return null;
            user.Username = request.Username;
        }

        if (!string.IsNullOrEmpty(request.FullName))
            user.FullName = request.FullName;

        if (request.AvatarUrl != null)
            user.AvatarUrl = request.AvatarUrl;

        if (!string.IsNullOrEmpty(request.Theme))
            user.Theme = request.Theme;

        if (!string.IsNullOrEmpty(request.Language))
            user.Language = request.Language;

        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return MapToUserDto(user);
    }

    public async System.Threading.Tasks.Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return false;

        if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
            return false;

        user.PasswordHash = HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return true;
    }
}
