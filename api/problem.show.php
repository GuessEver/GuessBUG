<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_GET["oj"]) || !isset($_GET["id"])) die('{"log":"input error"}');
	$oj = $_GET["oj"]; $id = $_GET["id"];
	$for_prob_oj = $oj;
	$for_prob_id = $id;
	$article = array();
	$sqlArticle = @mysql_query("SELECT * FROM article WHERE for_prob_oj = \"$for_prob_oj\" AND for_prob_id = \"$for_prob_id\" ORDER BY aid DESC;") or die('{"log":"system error"}');
	for($i = 0; $i < mysql_num_rows($sqlArticle); $i++) {
		$visiblity = mysql_result_check($sqlArticle, $i, "visiblity");
		if($visiblity === "0") continue;
		$to_level = mysql_result_check($sqlArticle, $i, "to_level");
		if(getCurrentLevel() < $to_level) continue;
		$single = array();
		$single["aid"] = mysql_result_check($sqlArticle, $i, "aid");
		$single["title"] = mysql_result_check($sqlArticle, $i, "title");
			$single["title"] = urldecode($single["title"]);
		$from_uid = mysql_result_check($sqlArticle, $i, "from_uid");
		$sqlUser = @mysql_query("SELECT * FROM user WHERE uid = $from_uid;") or die('{"log":"system error"}');
		$single["author"] = mysql_result_check($sqlUser, 0, "name"); 
		array_push($article, $single);
	}
	$res = array(); $res["log"] = "ok"; $res["data"] = $article;
	die(json_encode($res));
?>
