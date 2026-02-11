# Auto-push script - Watches for file changes and automatically pushes to GitHub
# Run this script and leave it running in the background

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Training Register - Auto Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Watching for file changes..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not a git repository!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$lastCommitTime = Get-Date

# Function to push changes
function Push-Changes {
    $changedFiles = git status --short
    
    if ($changedFiles) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Changes detected!" -ForegroundColor Yellow
        Write-Host $changedFiles -ForegroundColor Gray
        
        git add .
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-update: $timestamp"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Pushing to GitHub..." -ForegroundColor Cyan
            git push origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✓ Successfully pushed!" -ForegroundColor Green
            } else {
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✗ Push failed!" -ForegroundColor Red
            }
        }
        Write-Host ""
    }
}

# File system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PWD
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Files to watch
$watcher.Filter = "*.*"

# Ignore certain files/folders
$ignorePaths = @('.git', 'node_modules', '.firebase', 'firebase-config.js')

# Timer to batch changes (wait 5 seconds after last change)
$timer = New-Object System.Timers.Timer
$timer.Interval = 5000  # 5 seconds
$timer.AutoReset = $false

$changeDetected = $false

$onChange = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # Check if path should be ignored
    $shouldIgnore = $false
    foreach ($ignore in $ignorePaths) {
        if ($path -like "*$ignore*") {
            $shouldIgnore = $true
            break
        }
    }
    
    if (-not $shouldIgnore) {
        $script:changeDetected = $true
        $timer.Stop()
        $timer.Start()
    }
}

$onTimerElapsed = {
    if ($script:changeDetected) {
        Push-Changes
        $script:changeDetected = $false
    }
}

# Register events
Register-ObjectEvent $watcher "Changed" -Action $onChange | Out-Null
Register-ObjectEvent $watcher "Created" -Action $onChange | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $onChange | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $onChange | Out-Null
Register-ObjectEvent $timer "Elapsed" -Action $onTimerElapsed | Out-Null

Write-Host "✓ Auto-push is now active!" -ForegroundColor Green
Write-Host "Edit any file and it will automatically push to GitHub after 5 seconds." -ForegroundColor Cyan
Write-Host ""

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    $timer.Dispose()
    Get-EventSubscriber | Unregister-Event
    Write-Host "`nAuto-push stopped." -ForegroundColor Yellow
}
