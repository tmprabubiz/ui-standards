<#
.SYNOPSIS
  Install the ui-standards skill into an app folder, or globally for your user.
.EXAMPLE
  ./install/install.ps1 -Target "D:\Apps\my-app"
  ./install/install.ps1 -Target "D:\Apps\my-app" -Tools claude,codex,copilot,cursor
  ./install/install.ps1 -Global
#>
[CmdletBinding()]
param(
    [string]$Target,
    [ValidateSet('claude', 'codex', 'copilot', 'cursor')]
    [string[]]$Tools = @('claude', 'codex'),
    [switch]$Global
)

$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent $PSScriptRoot
$Skill = Join-Path $Repo 'skill/ui-standards'
$Adapters = Join-Path $Repo 'adapters'
$Start = '<!-- ui-standards:start -->'
$End = '<!-- ui-standards:end -->'

function Copy-Skill([string]$Dest) {
    New-Item -ItemType Directory -Force $Dest | Out-Null
    Copy-Item -Path (Join-Path $Skill '*') -Destination $Dest -Recurse -Force
    Write-Host "  skill  -> $Dest"
}

function Seed-Templates([string]$TargetPath) {
    $sourceDir = Join-Path $Skill 'references/templates'
    $targetDir = Join-Path $TargetPath 'docs/ui-standards'
    New-Item -ItemType Directory -Force $targetDir | Out-Null
    foreach ($name in 'COVERAGE.md', 'NEXT-ITERATION.md', 'SLICE-WALKTHROUGH.md') {
        $source = Join-Path $sourceDir $name
        $destination = Join-Path $targetDir $name
        if (-not (Test-Path $destination)) { Copy-Item $source $destination }
    }
    Write-Host "  templates -> $targetDir"
}

function Set-Block([string]$File, [string]$SnippetName) {
    $block = (Get-Content -Raw (Join-Path $Adapters $SnippetName)).Trim()
    New-Item -ItemType Directory -Force (Split-Path -Parent $File) | Out-Null
    if (Test-Path $File) {
        $text = Get-Content -Raw $File
        $pattern = [regex]::Escape($Start) + '[\s\S]*?' + [regex]::Escape($End)
        if ($text -match $pattern) {
            $text = [regex]::Replace($text, $pattern, { param($m) $block })
        }
        elseif ($text.Contains($Start)) {
            throw "Broken ui-standards markers in $File; fix or remove them and re-run."
        }
        else {
            $text = $text.TrimEnd() + "`n`n" + $block + "`n"
        }
    }
    else {
        $text = $block + "`n"
    }
    Set-Content -NoNewline -Encoding utf8 $File $text
    Write-Host "  block  -> $File"
}

if ($Global) {
    Write-Host 'Installing ui-standards for your user account'
    Copy-Skill (Join-Path $HOME '.claude/skills/ui-standards')
    Copy-Skill (Join-Path $HOME '.agents/skills/ui-standards')
    Write-Host 'Done. Restart your agent to pick up the skill.'
    return
}

if (-not $Target) { throw 'Give -Target <app folder> or use -Global.' }
if (-not (Test-Path $Target -PathType Container)) { throw "Folder not found: $Target" }
$Target = (Resolve-Path $Target).Path
Write-Host "Installing ui-standards into $Target ($($Tools -join ', '))"

Copy-Skill (Join-Path $Target '.agents/skills/ui-standards')
Seed-Templates $Target
Set-Block (Join-Path $Target 'AGENTS.md') 'AGENTS.snippet.md'

if ($Tools -contains 'claude') {
    Copy-Skill (Join-Path $Target '.claude/skills/ui-standards')
    Set-Block (Join-Path $Target 'CLAUDE.md') 'CLAUDE.snippet.md'
}
if ($Tools -contains 'copilot') {
    Set-Block (Join-Path $Target '.github/copilot-instructions.md') 'copilot-instructions.snippet.md'
}
if ($Tools -contains 'cursor') {
    $rule = Join-Path $Target '.cursor/rules/ui-standards.mdc'
    New-Item -ItemType Directory -Force (Split-Path -Parent $rule) | Out-Null
    Copy-Item -Force (Join-Path $Adapters 'cursor-rule.mdc') $rule
    Write-Host "  rule   -> $rule"
}

Write-Host 'Done. Ask your agent: "Use ui-standards to plan this app" or "What is this app missing?"'
