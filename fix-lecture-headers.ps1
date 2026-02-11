# fix-lecture-headers.ps1
# This script removes the X-API-Key header from all lecture HTML files

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Lecture Files Security Fix Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Define the lectures directory path
$lecturesPath = ".\lectures"

# Check if lectures directory exists
if (-Not (Test-Path $lecturesPath)) {
    Write-Host "ERROR: lectures directory not found at: $lecturesPath" -ForegroundColor Red
    Write-Host "Please run this script from your project root directory" -ForegroundColor Yellow
    exit 1
}

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path $lecturesPath -Filter "*.html" -Recurse

Write-Host "Found $($htmlFiles.Count) HTML files to process" -ForegroundColor Green
Write-Host ""

$filesModified = 0
$filesSkipped = 0

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Check if file contains the problematic X-API-Key header
    if ($content -match "'X-API-Key':\s*'[^']*'") {
        
        # Pattern 1: Remove the X-API-Key line with comma after it
        $newContent = $content -replace "\s*'X-API-Key':\s*'[^']*',\s*\r?\n", ""
        
        # Pattern 2: Remove the X-API-Key line with comma before it (if it's the last header)
        $newContent = $newContent -replace ",\s*\r?\n\s*'X-API-Key':\s*'[^']*'\s*\r?\n", "`r`n"
        
        # Write the modified content back
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        
        Write-Host "  ✓ FIXED: Removed X-API-Key header" -ForegroundColor Green
        $filesModified++
    }
    else {
        Write-Host "  - SKIPPED: No X-API-Key found (already clean)" -ForegroundColor Gray
        $filesSkipped++
    }
    
    Write-Host ""
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Files modified: $filesModified" -ForegroundColor Green
Write-Host "Files skipped: $filesSkipped" -ForegroundColor Gray
Write-Host "Total files processed: $($htmlFiles.Count)" -ForegroundColor Cyan
Write-Host ""

if ($filesModified -gt 0) {
    Write-Host "SUCCESS! All lecture files have been secured." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review the changes (optional)" -ForegroundColor White
    Write-Host "2. Commit to git: git add . && git commit -m 'Security: Remove exposed API keys from lectures'" -ForegroundColor White
    Write-Host "3. Deploy to Vercel: git push" -ForegroundColor White
}
else {
    Write-Host "No files needed modification - your lectures are already secure!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
