$dll = '"'"'d:\CODE\Portfolio\Portfolio_ASP\server\admin_panel\tools\CassiniDev.4.0\lib\net40\CassiniDev4-lib.dll'"'"'
$asm = [Reflection.Assembly]::LoadFrom($dll)
$asm.GetTypes() | Where-Object { $_.IsPublic } | Select-Object -ExpandProperty FullName | Sort-Object | Select-Object -First 300
