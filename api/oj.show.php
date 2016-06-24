<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	$sqlOJ = @mysql_query("SELECT * FROM `oj` ORDER BY name ASC;") or die('{"log":"system error"}');
	$oj = array();
	for($i = 0; $i < mysql_num_rows($sqlOJ); $i++) {
		$item = mysql_result_check($sqlOJ, $i, "name");
		array_push($oj, $item);
	}
	$res["log"] = "ok"; $res["data"] = $oj;
	die(json_encode($res));
?>
