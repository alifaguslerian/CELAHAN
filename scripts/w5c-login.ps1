param(
    [ValidateSet('admin', 'user1', 'user2')][string]$Account = 'admin',
    [ValidateSet('password', 'email')][string]$Copy = 'password'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$vault = Join-Path $root '.env.w5c-accounts.dpapi'
if (-not (Test-Path -LiteralPath $vault -PathType Leaf)) {
    throw 'Encrypted W5C credentials were not found on this computer.'
}

$emails = @{ admin = 'w5c-admin@example.invalid'; user1 = 'w5c-user-1@example.invalid'; user2 = 'w5c-user-2@example.invalid' }
$encrypted = (Get-Content -LiteralPath $vault -Raw).Trim()
$accounts = [System.Net.NetworkCredential]::new('', (ConvertTo-SecureString -String $encrypted)).Password | ConvertFrom-Json
$identity = $accounts | Where-Object email -eq $emails[$Account] | Select-Object -First 1
if (-not $identity) { throw 'The selected test account was not found.' }

$value = $identity.$Copy
if (-not $value) { throw 'The selected login field is empty.' }

Set-Clipboard -Value $value
Write-Output "Copied $Copy for $($identity.email). Paste it into the browser."
