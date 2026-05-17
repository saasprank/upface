# Script de démarrage UPFACE
# Ajoute Node.js au PATH et lance le serveur de développement

$nodeDir = "C:\Users\Louis\AppData\Local\nodejs-portable\node-v22.15.1-win-x64"

if (Test-Path $nodeDir) {
    $env:PATH = "$nodeDir;$env:PATH"
    Write-Host "✓ Node.js $(node --version) détecté" -ForegroundColor Green
    Write-Host "✓ npm $(npm --version) prêt" -ForegroundColor Green
    Write-Host ""
    Write-Host "→ Démarrage de UPFACE sur http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    npm run dev
} else {
    Write-Host "❌ Node.js portable introuvable à $nodeDir" -ForegroundColor Red
    Write-Host "Relancez le script d'installation depuis le README." -ForegroundColor Yellow
}
