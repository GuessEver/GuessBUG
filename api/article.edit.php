<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_GET["aid"])) die('{"log":"input error"}');
	$aid = $_GET["aid"];
	if(!checkFunc($aid, 1, 0, "")) die('{"log":"input error"}');
	if(!isset($_POST["for_prob_oj"]) || !isset($_POST["for_prob_id"]) 
		|| !isset($_POST["title"]) || !isset($_POST["content"])) die('{"log":"input error"}');
	$for_prob_oj = $_POST["for_prob_oj"]; $for_prob_id = $_POST["for_prob_id"];
	if(!checkFunc($for_prob_oj, 1, 1, "-_,.")) die('{"log":"input error"}');
	if(!checkFunc($for_prob_id, 1, 1, "-_,.")) die('{"log":"input error"}');
	if($for_prob_oj === "" || $for_prob_id === "") die('{"log":"input error"}');
	$title = $_POST["title"]; $title = urlencode($title);
	if($title === "") die('{"log":"input error"}');
	$sqlArticle = @mysql_query("SELECT * FROM article WHERE aid = $aid;") or die('{"log":"system error"}');
	/* check the permission */
		$from_uid = mysql_result_check($sqlArticle, 0, "from_uid");
		if(checkSESSIONStatus() === false) die('{"log":"permission denied"}');
		if($_SESSION["level"] === "0") die('{"log":"permission denied"}');
		if($_SESSION["level"] !== "9" && $_SESSION["uid"] !== $from_uid) die('{"log":"permission denied"}');
		if($_SESSION["level"] !== "9" && $for_prob_oj === "0") die('{"log":"permission denied"}');
	$sqlOJ = @mysql_query("SELECT * FROM oj WHERE name = \"$for_prob_oj\";") or die('{"log":"system error"}');
	if($for_prob_oj !== "0") { // insert new oj
		if(mysql_num_rows($sqlOJ) === 0)
			$sqlOJ_new = @mysql_query("INSERT INTO oj (name) VALUES (\"$for_prob_oj\");") or die('{"log":"system error"}');
		$sqlOJ = @mysql_query("SELECT * FROM oj WHERE name = \"$for_prob_oj\";") or die('{"log":"system error"}');
		$for_prob_oj = mysql_result_check($sqlOJ, 0, "name");
	}
	$content = $_POST["content"]; $content = urlencode($content);
	@mysql_query("UPDATE article SET for_prob_oj = \"$for_prob_oj\", for_prob_id = \"$for_prob_id\", title = \"$title\", content = \"$content\", visiblity = 1 WHERE aid = $aid;")
	or die('{"log":"system error"}');
	die('{"log":"ok"}');
?>
