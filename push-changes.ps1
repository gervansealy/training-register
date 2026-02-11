# PowerShell script to easily push changes to GitHub
# Usage: .\push-changes.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   Training Register - Git Push" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not a git repository!" -ForegroundColor Red
    Write-Host "Please run 'git init' first." -ForegroundColor Yellow
    exit 1
}

# Show current status
Write-Host "Current Status:" -ForegroundColor Yellow
git status --short

Write-Host ""

# Ask for commit message
$commitMessage = Read-Host "Enter commit message"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "Error: Commit message cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "$commitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Commit failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your changes are now live on GitHub." -ForegroundColor Cyan
    Write-Host "GitHub Pages will update in 2-3 minutes." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Push failed!" -ForegroundColor Red
    Write-Host "Check your internet connection and GitHub credentials." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
