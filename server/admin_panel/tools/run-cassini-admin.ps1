$dll = 'd:\CODE\Portfolio\Portfolio_ASP\server\admin_panel\tools\CassiniDev.4.0\lib\net40\CassiniDev4-lib.dll'
$sitePath = 'd:\CODE\Portfolio\Portfolio_ASP\server\admin_panel'
$port = 8085
$virtual = '/'
$host = 'localhost'
$asm = [Reflection.Assembly]::LoadFrom($dll)
$serverType = $asm.GetType('CassiniDev.CassiniDevServer')
$server = New-Object $serverType
$server.StartServer($sitePath, $port, $virtual, $host)
Write-Output ('Cassini started at ' + $server.RootUrl)
while ($true) { Start-Sleep -Seconds 5 }
