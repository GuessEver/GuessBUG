<?php
date_default_timezone_set('PRC');
require_once("config.php");
// ---------以下谨慎修改---------
@mysql_connect($conn_hostname, $conn_username, $conn_password)
or die('{"log":"failed connecting mysql"}');
@mysql_select_db($conn_database)
or die('{"log":"failed connecting database"}');
mysql_query("SET NAMES UTF8");
?>
