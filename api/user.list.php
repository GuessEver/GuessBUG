<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	$number = isset($_GET["number"]) ? $_GET["number"] : "10";
	//$sqlUser = @mysql_query("SELECT * FROM user ORDER BY uid ASC;") or die('{"log":"system error"}');
	if($number === "-1")
		$sqlUser = @mysql_query("SELECT *, (SELECT COUNT(*) FROM `article` WHERE `article`.`from_uid` = `user`.`uid`) AS `cnt` FROM `user` ORDER BY `cnt` DESC;") or die('{"log":"system error"}');
	else
		$sqlUser = @mysql_query("SELECT *, (SELECT COUNT(*) FROM `article` WHERE `article`.`from_uid` = `user`.`uid`) AS `cnt` FROM `user` ORDER BY `cnt` DESC LIMIT $number;") or die('{"log":"system error"}');
	$user = array();
	for($i = 0; $i < mysql_num_rows($sqlUser); $i++) {
		$single = array();
		$single["uid"] = mysql_result_check($sqlUser, $i, "uid");
		$single["name"] = mysql_result_check($sqlUser, $i, "name");
		$single["email"] = mysql_result_check($sqlUser, $i, "email");
		$single["homepage"] = mysql_result_check($sqlUser, $i, "homepage");
			$single["homepage"] = urldecode($single["homepage"]);
		$status = mysql_result_check($sqlUser, $i, "level");
		if($status === "9") $single["status"] = "administrator";
		else if($status === "0") $single["status"] = "rejected";
		else $single["status"] = "normal";
		array_push($user, $single);
	}
	$res = array(); $res["log"] = "ok"; $res["data"] = $user;
	die(json_encode($res));
?>
