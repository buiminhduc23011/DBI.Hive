FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/DBI.Task.API/DBI.Task.API.csproj", "DBI.Task.API/"]
COPY ["src/DBI.Task.Application/DBI.Task.Application.csproj", "DBI.Task.Application/"]
COPY ["src/DBI.Task.Infrastructure/DBI.Task.Infrastructure.csproj", "DBI.Task.Infrastructure/"]
COPY ["src/DBI.Task.Domain/DBI.Task.Domain.csproj", "DBI.Task.Domain/"]
RUN dotnet restore "DBI.Task.API/DBI.Task.API.csproj"
COPY src/ .
WORKDIR "/src/DBI.Task.API"
RUN dotnet build "DBI.Task.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DBI.Task.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DBI.Task.API.dll"]
