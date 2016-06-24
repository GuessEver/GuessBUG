<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_GET["username"])) die('{"log":"input error"}');
	$username = $_GET["username"];
	$sqlUser = @mysql_query("SELECT * FROM user WHERE name = \"$username\";") or die('{"log":"system error"}');
	if(mysql_num_rows($sqlUser) === 0) die('{"log":"no"}');
	$uid = mysql_result_check($sqlUser, 0, "uid");
	$sqlArticle = @mysql_query("SELECT COUNT(*) AS cnt FROM article WHERE from_uid = $uid;") or die('{"log":"system error"}');
	$total_articles = mysql_result_check($sqlArticle, 0, "cnt");
	$numbers_per_page = 15;//////////////////////////////////////// 15 articles per page
	$total_pages = ceil($total_articles / $numbers_per_page); 
	if($total_pages == 0) $total_pages = 1;
	$current_page = isset($_GET["page"]) ? $_GET["page"] : "1";
	if(!checkFunc($current_page, 1, 0, "")) $current_page = 1;
	if($current_page > $total_pages) $current_page = $total_pages;
	$st = ($current_page - 1) * $numbers_per_page;
	$sqlArticle = @mysql_query("SELECT * FROM article WHERE from_uid = $uid ORDER BY aid DESC LIMIT $st, $numbers_per_page;") or die('{"log":"system error"}');
	$arr = array(); $arr["log"] = "ok";
	$arr["total_pages"] = (string)$total_pages; $arr["current_page"] = (string)$current_page;
	$article = array();
	$sqlArticle_rows = mysql_num_rows($sqlArticle);
	for($i = 0; $i < $sqlArticle_rows; $i++) {
		$single = array();
		$single["aid"] = mysql_result_check($sqlArticle, $i, "aid");
		$single["submit_time"] = mysql_result_check($sqlArticle, $i, "submit_time");
		$single["to_level"] = mysql_result_check($sqlArticle, $i, "to_level");
		$single["title"] = mysql_result_check($sqlArticle, $i, "title");
			$single["title"] = urldecode($single["title"]);
		$single["visiblity"] = mysql_result_check($sqlArticle, $i, "visiblity");
		$userLevel = getCurrentLevel();
		if($single["visiblity"] === "0") {
			if($userLevel === "0") continue;
			if(!($userLevel === "9" || $_SESSION["uid"] === $uid)) continue;
		}
		else { // $single["visiblity"] === "1"
			if($userLevel < $to_level) continue;
		}
		array_push($article, $single);
	}
	$arr["data"] = $article;
	die(json_encode($arr));
?>
