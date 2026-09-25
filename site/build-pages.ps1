param([string]$Destination = '.work/pages')

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$target = [IO.Path]::GetFullPath((Join-Path $repo $Destination))
if (Test-Path -LiteralPath $target) { throw "Destination already exists: $target" }

$assetRoot = Join-Path $repo 'skills/server-rendered-admin-ui/assets'
$reference = Join-Path $assetRoot 'reference-ui'
$images = Join-Path $repo 'docs/images'
foreach ($required in @($reference, $images, (Join-Path $repo 'site/index.html'))) {
  if (-not (Test-Path -LiteralPath $required)) { throw "Missing showcase source: $required" }
}

New-Item -ItemType Directory -Path $target | Out-Null
Copy-Item -LiteralPath (Join-Path $repo 'site/index.html') -Destination $target
Copy-Item -LiteralPath (Join-Path $repo 'site/showcase.css') -Destination $target
Copy-Item -LiteralPath $images -Destination (Join-Path $target 'images') -Recurse
Copy-Item -LiteralPath $reference -Destination (Join-Path $target 'demo') -Recurse
foreach ($name in @('css', 'js', 'vendor')) {
  Copy-Item -LiteralPath (Join-Path $assetRoot $name) -Destination (Join-Path $target $name) -Recurse
}
Copy-Item -LiteralPath (Join-Path $assetRoot 'favicon.svg') -Destination (Join-Path $target 'favicon.svg')
New-Item -ItemType File -Path (Join-Path $target '.nojekyll') | Out-Null
Write-Output "Pages artifact ready: $target"
