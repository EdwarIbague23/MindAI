$ErrorActionPreference = 'Stop'

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$generatorPath = Join-Path $PSScriptRoot 'update_readme.ps1'
$readmePath = Join-Path $workspaceRoot 'README.md'
$excludedPathPattern = '(^|[\\/])(\.git|node_modules|\.venv|venv|__pycache__|\.expo|\.next|\.pytest_cache|\.mypy_cache|\.vscode-test|dist|build|coverage|target|out)([\\/]|$)'
$eventSources = @()

& $generatorPath

$watcher = New-Object IO.FileSystemWatcher
$watcher.Path = $workspaceRoot
$watcher.Filter = '*'
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [IO.NotifyFilters]'FileName, DirectoryName, LastWrite, Size'
$watcher.InternalBufferSize = 32768

foreach ($eventName in @('Changed', 'Created', 'Deleted', 'Renamed')) {
    $sourceIdentifier = "MindFlow.Readme.$eventName"
    $null = Register-ObjectEvent -InputObject $watcher -EventName $eventName -SourceIdentifier $sourceIdentifier
    $eventSources += $sourceIdentifier
}

$watcher.EnableRaisingEvents = $true
Write-Output 'README watcher activo: los cambios del repositorio actualizaran el bloque generado.'

$pendingUpdate = $false
$lastChangeAt = [DateTime]::MinValue

try {
    while ($true) {
        $firstEvent = Wait-Event -Timeout 1
        if ($null -ne $firstEvent) {
            $queuedEvents = @($firstEvent) + @(Get-Event | Where-Object { $eventSources -contains $_.SourceIdentifier })

            foreach ($queuedEvent in $queuedEvents) {
                $changedPath = $queuedEvent.SourceEventArgs.FullPath
                if ($changedPath) {
                    $relativePath = $changedPath.Substring($workspaceRoot.Length).TrimStart('\', '/')
                    $isReadme = $changedPath.Equals($readmePath, [StringComparison]::OrdinalIgnoreCase)
                    $isExcluded = $relativePath -match $excludedPathPattern
                    if (-not $isReadme -and -not $isExcluded) {
                        $pendingUpdate = $true
                        $lastChangeAt = [DateTime]::UtcNow
                    }
                }

                Remove-Event -EventIdentifier $queuedEvent.EventIdentifier -ErrorAction SilentlyContinue
            }
        }

        if ($pendingUpdate -and ([DateTime]::UtcNow - $lastChangeAt).TotalMilliseconds -ge 700) {
            & $generatorPath
            $pendingUpdate = $false
        }
    }
}
finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Get-Event | Where-Object { $eventSources -contains $_.SourceIdentifier } | Remove-Event -ErrorAction SilentlyContinue
    foreach ($sourceIdentifier in $eventSources) {
        Unregister-Event -SourceIdentifier $sourceIdentifier -ErrorAction SilentlyContinue
    }
    Write-Output 'README watcher finalizado.'
}
