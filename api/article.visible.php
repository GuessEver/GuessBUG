<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_GET["aid"]) || !isset($_GET["visible"])) die('{"log":"input error"}');
	$aid = $_GET["aid"]; $visible = $_GET["visible"];
	if(!checkFunc($aid, 1, 0, "")) die('{"log":"input error"}');
	$sqlArticle = @mysql_query("SELECT * FROM article WHERE aid = $aid;") or die('{"log":"system error"}');
	/* check the permission */
		$from_uid = mysql_result_check($sqlArticle, 0, "from_uid");
		if(checkSESSIONStatus() === false) die('{"log":"permission denied"}');
		if($_SESSION["level"] === "0") die('{"log":"permission denied"}');
		if($_SESSION["level"] !== "9" && $_SESSION["uid"] !== $from_uid) die('{"log":"permission denied"}');
		if($_SESSION["level"] !== "9" && $for_prob_oj === "0") die('{"log":"permission denied"}');
	@mysql_query("UPDATE article SET visiblity = $visible WHERE aid = $aid;")
	or die('{"log":"system error"}');
	die('{"log":"ok"}');
?>
