<?php @session_start();
	require_once("../connection/connection.php");
	include_once("checkFunc.php");
	if(!isset($_POST["uid"]) || !isset($_POST["oldPassword"]) || !isset($_POST["newPassword"])
		|| !isset($_POST["email"]) || !isset($_POST["homepage"])
	) die('{"log":"input error"}');
	$uid = $_POST["uid"]; $pwd = $_POST["oldPassword"]; $newpwd = $_POST["newPassword"];
	$email = $_POST["email"]; $homepage = $_POST["homepage"];
		if($homepage === "") $homepage = $host_addr."blog/".$name;
		if(substr($homepage, 0, 4) !== "http") $homepage = "http://" + $homepage; 
		$homepage = urlencode($homepage);
	if(!checkFunc($pwd, 1, 1, "~!@#$%^&*()_-+=,.?:;")) die('{"log":"input error"}');
	if(!checkFunc($newpwd, 1, 1, "~!@#$%^&*()_-+=,.?:;")) die('{"log":"input error"}');
	if(!checkEmail($email)) die('{"log":"input error"}');
	if(checkSESSIONStatus() === false) die('{"log":"permission denied"}');
	if($_SESSION["level"] !== "9" && $_SESSION["uid"] !== $uid) die('{"log":"permission denied"}');
	$sqlUser = @mysql_query("SELECT * FROM user WHERE uid = $uid;") or die('{"log":"system error"}');
	if(mysql_num_rows($sqlUser) !== 1) die('{"log":"system error"}');
	$password = mysql_result_check($sqlUser, 0, "password");
	if(password_verify($pwd, $password) !== true) die('{"log":"permission denied"}');
	if($newpwd === md5('')) $newpwd = $pwd;
	$newpwd = password_hash($newpwd, PASSWORD_BCRYPT);
	@mysql_query("UPDATE user SET password = \"$newpwd\", email = \"$email\", homepage = \"$homepage\" WHERE uid = \"$uid\";")
	or die('{"log":"system error"}');
	die('{"log":"ok"}');
?>
