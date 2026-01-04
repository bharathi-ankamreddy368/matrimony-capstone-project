param(
    [Parameter(Mandatory=$true)]
    [string]$RootPassword,

    [Parameter(Mandatory=$false)]
    [string]$AppUser = "appuser",

    [Parameter(Mandatory=$false)]
    [string]$AppPassword = "strongpassword",

    [Parameter(Mandatory=$false)]
    [string]$DbName = "event_planner_db"
)

# Check for mysql.exe
$mysql = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysql) {
    Write-Error "mysql CLI not found in PATH. Please install MySQL client or add it to PATH."
    exit 1
}

$createSql = @"
CREATE DATABASE IF NOT EXISTS `$DbName;
CREATE USER IF NOT EXISTS '$AppUser'@'localhost' IDENTIFIED BY '$AppPassword';
GRANT ALL PRIVILEGES ON `$DbName.* TO '$AppUser'@'localhost';
FLUSH PRIVILEGES;
"@

# Execute SQL using mysql CLI
$securePass = $RootPassword
$cmd = "mysql -u root -p$securePass -e \"$createSql\""
Write-Host "Running DB setup..."
Invoke-Expression $cmd
if ($LASTEXITCODE -ne 0) {
    Write-Error "DB setup failed. Check root password and mysql CLI availability."
    exit 1
}
Write-Host "Database and user created (or already exist)."
