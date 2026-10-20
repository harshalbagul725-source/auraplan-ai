# Push AuraPlan AI to GitHub
param (
    [string]$RepoUrl = ""
)

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Please enter your GitHub repository URL (e.g., https://github.com/harshalbagul725-source/auraplan-ai.git)"
}

if (-not $RepoUrl) {
    Write-Host "No repository URL provided. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "Configuring remote origin to $RepoUrl..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin $RepoUrl
git branch -M main

Write-Host "Pushing code to GitHub main branch..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully uploaded AuraPlan AI to GitHub! 🎉" -ForegroundColor Green
} else {
    Write-Host "`nFailed to push. Please check your repository URL and GitHub permissions." -ForegroundColor Red
}
