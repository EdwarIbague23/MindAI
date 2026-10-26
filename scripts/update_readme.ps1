$ErrorActionPreference = 'Stop'

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$readmePath = Join-Path $workspaceRoot 'README.md'
$excludedNames = @(
    '.git', 'node_modules', '.venv', 'venv', '__pycache__', '.expo', '.next',
    '.pytest_cache', '.mypy_cache', '.vscode-test', 'dist', 'build', 'coverage',
    'target', 'out'
)

function Add-TreeLines {
    param(
        [Parameter(Mandatory = $true)][string]$Directory,
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Prefix
    )

    $items = @(
        Get-ChildItem -LiteralPath $Directory -Force |
            Where-Object {
                ($excludedNames -notcontains $_.Name) -and
                (-not $_.LinkType)
            } |
            Sort-Object @{ Expression = { if ($_.PSIsContainer) { 0 } else { 1 } } }, Name
    )

    for ($index = 0; $index -lt $items.Count; $index++) {
        $item = $items[$index]
        $isLast = $index -eq ($items.Count - 1)
        $connector = if ($isLast) { '`-- ' } else { '|-- ' }
        $suffix = if ($item.PSIsContainer) { '/' } else { '' }
        [void]$script:treeLines.Add("$Prefix$connector$($item.Name)$suffix")

        if ($item.PSIsContainer) {
            $childPrefix = if ($isLast) { "$Prefix    " } else { "$Prefix|   " }
            Add-TreeLines -Directory $item.FullName -Prefix $childPrefix
        }
    }
}

$script:treeLines = New-Object 'System.Collections.Generic.List[string]'
Add-TreeLines -Directory $workspaceRoot -Prefix ''

$rootName = Split-Path $workspaceRoot -Leaf
$tree = @($rootName + '/') + @($script:treeLines.ToArray()) -join "`n"
$generatedBlock = @(
    '<!-- README-AUTO:START -->'
    '```text'
    $tree
    '```'
    '_Este inventario se genera localmente desde los archivos del repositorio._'
    '<!-- README-AUTO:END -->'
) -join "`n"

$readme = [IO.File]::ReadAllText($readmePath)
$pattern = '(?s)<!-- README-AUTO:START -->.*?<!-- README-AUTO:END -->'
$matches = [regex]::Matches($readme, $pattern)
if ($matches.Count -ne 1) {
    throw "README debe contener exactamente un bloque README-AUTO:START/END; encontrados: $($matches.Count)."
}

$updatedReadme = [regex]::Replace($readme, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{
    param($match)
    return $generatedBlock
}, 1)

if ($updatedReadme -ne $readme) {
    $encoding = New-Object System.Text.UTF8Encoding -ArgumentList $false
    [IO.File]::WriteAllText($readmePath, $updatedReadme, $encoding)
    Write-Output 'README actualizado: inventario del repositorio sincronizado.'
} else {
    Write-Output 'README sin cambios: el inventario ya estaba sincronizado.'
}
