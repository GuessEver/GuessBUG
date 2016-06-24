<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_GET["aid"])) die('{"log":"input error"}');
	$aid = $_GET["aid"];
	if(!checkFunc($aid, 1, 0, "")) die('{"log":"input error"}');
	$sqlArticle = @mysql_query("SELECT * FROM article WHERE aid = $aid;") or die('{"log":"system error"}');
	if(mysql_num_rows($sqlArticle) > 1) die('{"log":"system error"}');
	if(mysql_num_rows($sqlArticle) === 0) die('{"log":"no"}');
	$submit_time = mysql_result_check($sqlArticle, 0, "submit_time");
	$from_uid = mysql_result_check($sqlArticle, 0, "from_uid");
	$to_level = mysql_result_check($sqlArticle, 0, "to_level");
	$for_prob_oj = mysql_result_check($sqlArticle, 0, "for_prob_oj");
	$for_prob_id = mysql_result_check($sqlArticle, 0, "for_prob_id");
	$title = mysql_result_check($sqlArticle, 0, "title");
		$title = urldecode($title);
	$content = mysql_result_check($sqlArticle, 0, "content");
		$content = urldecode($content);
	$visiblity = mysql_result_check($sqlArticle, 0, "visiblity");
	$userLevel = getCurrentLevel();
	if($visiblity === "0") {
		if($userLevel === "0") die('{"log":"no"}');
		if(!($userLevel === "9" || $_SESSION["uid"] === $from_uid)) die('{"log":"no"}');
	}
	else { // $visiblity === 1
		if($userLevel < $to_level) die('{"log":"permission denied"}');
	}
	$sqlUser = @mysql_query("SELECT * FROM user WHERE uid = $from_uid;") or die('{"log":"system error"}');
	$from_username = mysql_result_check($sqlUser, 0, "name");
	$article = array();
	$article["aid"] = $aid;
	$article["submit_time"] = $submit_time;
	$article["from_uid"] = $from_uid;
	$article["from_username"] = $from_username;
	$article["to_level"] = $to_level;
	$article["for_prob_oj"] = $for_prob_oj;
	$article["for_prob_id"] = $for_prob_id;
	$article["title"] = $title;
	$article["content"] = $content;
	$article["visiblity"] = $visiblity;
	$arr = array(); $arr["log"] = "ok"; $arr["data"] = $article;
	die(json_encode($arr));
?>
