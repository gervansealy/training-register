# PowerShell script to initialize Git repository and push to GitHub
# Run this ONCE when setting up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Training Register - Git Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if firebase-config.js exists
if (-not (Test-Path "firebase-config.js")) {
    Write-Host "⚠️  WARNING: firebase-config.js not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create firebase-config.js first:" -ForegroundColor Yellow
    Write-Host "1. Copy firebase-config.template.js to firebase-config.js" -ForegroundColor Yellow
    Write-Host "2. Add your Firebase project credentials" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Get GitHub username
Write-Host "Enter your GitHub username:" -ForegroundColor Yellow
$githubUser = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUser)) {
    Write-Host "Error: GitHub username is required!" -ForegroundColor Red
    exit 1
}

# Get repository name (default: training-register)
Write-Host ""
Write-Host "Enter repository name (press Enter for 'training-register'):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "training-register"
}

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  GitHub User: $githubUser" -ForegroundColor White
Write-Host "  Repository: $repoName" -ForegroundColor White
Write-Host "  URL: https://github.com/$githubUser/$repoName" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Is this correct? (Y/n)"
if ($confirm -eq "n" -or $confirm -eq "N") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow

# Initialize Git
if (Test-Path ".git") {
    Write-Host "Git repository already exists, skipping init..." -ForegroundColor Yellow
} else {
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Git init failed!" -ForegroundColor Red
        exit 1
    }
}

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Training Register System"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Git commit failed!" -ForegroundColor Red
    exit 1
}

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Add remote
Write-Host "Adding remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$githubUser/$repoName.git"

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update to new URL? (Y/n)"
    if ($updateRemote -ne "n" -and $updateRemote -ne "N") {
        git remote set-url origin $remoteUrl
    }
} else {
    git remote add origin $remoteUrl
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for your GitHub credentials..." -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/$githubUser/$repoName" -ForegroundColor White
    Write-Host "2. Enable GitHub Pages in repository Settings > Pages" -ForegroundColor White
    Write-Host "3. Your site will be live at: https://$githubUser.github.io/$repoName/" -ForegroundColor White
    Write-Host ""
    Write-Host "Don't forget to add this domain to Firebase authorized domains:" -ForegroundColor Yellow
    Write-Host "  $githubUser.github.io" -ForegroundColor White
    Write-Host ""
    Write-Host "See GET_STARTED.md for complete setup instructions." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ PUSH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "1. Repository doesn't exist yet on GitHub" -ForegroundColor White
    Write-Host "   - Create it at: https://github.com/new" -ForegroundColor White
    Write-Host "2. Invalid credentials" -ForegroundColor White
    Write-Host "3. No internet connection" -ForegroundColor White
    Write-Host ""
    Write-Host "After fixing the issue, run this script again or use:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
