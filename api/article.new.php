<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_POST["for_prob_oj"]) || !isset($_POST["for_prob_id"]) || !isset($_POST["title"]) || !isset($_POST["content"])) die('{"log":"input error"}');
	$for_prob_oj = $_POST["for_prob_oj"]; $for_prob_id = $_POST["for_prob_id"];
	if(!checkFunc($for_prob_oj, 1, 1, "-_,.")) die('{"log":"input error"}');
	if(!checkFunc($for_prob_id, 1, 1, "-_,.")) die('{"log":"input error"}');
	if($for_prob_oj === "" || $for_prob_id === "") die('{"log":"input error"}');
	$title = $_POST["title"]; $title = urlencode($title);
	if($title === "") die('{"log":"input error"}');
	$content = $_POST["content"]; $content = urlencode($content);
	/* check the permission */
		if(checkSESSIONStatus() === false) die('{"log":"permission denied"}');
		if($_SESSION["level"] === "0") die('{"log":"permission denied"}');
		if($_SESSION["level"] !== "9" && $for_prob_oj === "0") die('{"log":"permission denied"}');
	$sqlOJ = @mysql_query("SELECT * FROM oj WHERE name = \"$for_prob_oj\";") or die('{"log":"system error"}');
	if($for_prob_oj !== "0") { // insert new oj
		if(mysql_num_rows($sqlOJ) === 0)
			$sqlOJ_new = @mysql_query("INSERT INTO oj (name) VALUES (\"$for_prob_oj\");") or die('{"log":"system error"}');
		$sqlOJ = @mysql_query("SELECT * FROM oj WHERE name = \"$for_prob_oj\";") or die('{"log":"system error"}');
		$for_prob_oj = mysql_result_check($sqlOJ, 0, "name");
	}
	$from_uid = $_SESSION["uid"];
	@mysql_query("INSERT INTO article (from_uid, for_prob_oj, for_prob_id, title, content) VALUES ($from_uid, \"$for_prob_oj\", \"$for_prob_id\", \"$title\", \"$content\");")
	or die('{"log":"system error"}');
	//$sqlArticle = @mysql_query("SELECT * FROM article WHERE from_uid = $from_uid ORDER BY aid DESC;") or die('{"log":"system error"}');
	//$aid = mysql_result_check($sqlArticle, 0, "aid");
	$aid = mysql_insert_id();
	$arr = array(); $arr["log"] = "ok"; $arr["aid"] = $aid;
	die(json_encode($arr));
?>
