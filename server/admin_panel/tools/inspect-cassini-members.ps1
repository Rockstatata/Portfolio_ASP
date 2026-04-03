$dll = 'd:\CODE\Portfolio\Portfolio_ASP\server\admin_panel\tools\CassiniDev.4.0\lib\net40\CassiniDev4-lib.dll'
$asm = [Reflection.Assembly]::LoadFrom($dll)
foreach ($typeName in @('CassiniDev.Server','CassiniDev.CassiniDevServer')) {
  $t = $asm.GetType($typeName)
  Write-Output ('TYPE: ' + $typeName)
  $t.GetConstructors() | ForEach-Object { Write-Output ('  CTOR: ' + $_.ToString()) }
  $t.GetMethods([Reflection.BindingFlags]::Public -bor [Reflection.BindingFlags]::Instance -bor [Reflection.BindingFlags]::Static -bor [Reflection.BindingFlags]::DeclaredOnly) | ForEach-Object { Write-Output ('  METH: ' + $_.ToString()) }
  Write-Output ''
}
