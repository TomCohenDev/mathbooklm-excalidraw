$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    & git @Args
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

function Test-GitRef([string]$Ref) {
    git rev-parse --verify $Ref 2>$null | Out-Null
    return $LASTEXITCODE -eq 0
}

Invoke-Git fetch origin
Invoke-Git checkout develop

if (Test-GitRef "refs/heads/staging") {
    Invoke-Git checkout staging
} elseif (Test-GitRef "refs/remotes/origin/staging") {
    Invoke-Git checkout -b staging origin/staging
} else {
    Write-Host "Creating 'staging' from 'develop'..."
    Invoke-Git checkout -b staging
    Invoke-Git push -u origin staging
}
