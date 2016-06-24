<?php @session_start();
	include_once("checkFunc.php");
	sessionOut();
	die('{"log":"ok"}');
?>
