<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	$arr = array(); $arr["log"] = "ok";
	if(checkSESSIONStatus()) {
		$arr["status"] = "1";
		$arr["uid"] = isset($_SESSION["uid"]) ? $_SESSION["uid"] : die('{"log":"error"}');
		$arr["name"] = isset($_SESSION["name"]) ? $_SESSION["name"] : die('{"log":"error"}');
		$arr["email"] = isset($_SESSION["email"]) ? $_SESSION["email"] : die('{"log":"error"}');
		$arr["homepage"] = isset($_SESSION["homepage"]) ? $_SESSION["homepage"] : die('{"log":"error"}');
		$arr["level"] = isset($_SESSION["level"]) ? $_SESSION["level"] : die('{"log":"error"}');
	}
	else {
		$arr["status"] = "0";
		$arr["level"] = "0";
	}
	die(json_encode($arr));
?>
