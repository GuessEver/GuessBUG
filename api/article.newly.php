<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	$number = isset($_GET["number"]) ? $_GET["number"] : "10";
	if(!checkFunc($number, 1, 0, "")) die('{"log":"input error"}');
	$sqlArticle = @mysql_query("SELECT * FROM article ORDER BY aid DESC LIMIT $number;") or die('{"log":"system error"}');
	$arr = array();
	for($i = 0; $i < mysql_num_rows($sqlArticle); $i++) {
		$visiblity = mysql_result_check($sqlArticle, $i, "visiblity");
		if($visiblity === "0") continue;
		$to_level = mysql_result_check($sqlArticle, $i, "to_level");
		if(getCurrentLevel() < $level) continue;
		$single = array();
		$single["aid"] = mysql_result_check($sqlArticle, $i, "aid");
		$single["submit_time"] = mysql_result_check($sqlArticle, $i, "submit_time");
		$single["from_uid"] = mysql_result_check($sqlArticle, $i, "from_uid");
			$sqlUser = @mysql_query("SELECT * FROM user WHERE uid = ".$single["from_uid"].";") or die('{"log":"system error"}');
			$single["from_username"] = mysql_result_check($sqlUser, 0, "name");
			$single["from_useremail"] = mysql_result_check($sqlUser, 0, "email");
		$single["title"] = mysql_result_check($sqlArticle, $i, "title");
			$single["title"] = urldecode($single["title"]);
		array_push($arr, $single);
	}
	$res = array(); $res["log"] = "ok"; $res["data"] = $arr;
	die(json_encode($res));
?>
