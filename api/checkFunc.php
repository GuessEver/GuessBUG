<?php @session_start();
	function isNum($c) { // check if a char $c is a digit ([0-9])
		return ($c >= '0' && $c <= '9');
	}
	function isAlpha($c) { // check if a char $c is an alpha ([a-zA-Z])
		return ($c >= 'a' && $c <= 'z') || ($c >= 'A' && $c <= 'Z');
	}
	function isOther($c, $str) { // check if a char $c is in $str
		for($i = 0; $i < strlen($str); $i++) {
			if($c === $str[$i]) return true;
		}
		return false;
	}
	function checkFunc($str, $num, $alpha, $other) { // check if every character of a string $str is digit, alpha or in $other
		if(strlen($str) === 0) return false; 
		for($i = 0; $i < strlen($str); $i++) {
			$c = $str[$i];
			if(($num === 1 && isNUm($c) === true) 
				|| ($alpha === 1 && isAlpha($c) === true)
				|| (isOther($c, $other) === true)
				) continue;
			return false;
		}
		return true;
	}
	function checkEmail($str) { // check if a string $str is an email address
		$atPosition = -1; $dotPosition = -1;
		for($i = 0; $i < strlen($str); $i++) {
			if($str[$i] === '@') {
				$atPosition = $i;
				break;
			}
		}
		for($i = strlen($str) - 1; $i >= 0; $i--) {
			if($str[$i] === '.') {
				$dotPosition = $i;
				break;
			}
		}
		return ($atPosition > 0 && $atPosition < $dotPosition - 1 && $dotPosition < strlen($str) - 1);
	}
	function getCurrentLevel() { // get the level of the current user
		if(isset($_SESSION["status"]) && $_SESSION["status"] === "1") return $_SESSION["level"];
		return "0";
	}
	function mysql_result_check($sql, $i, $str) {
		$res = @mysql_result($sql, $i, $str);
		if($res === false) die('{"log":"system error"}');
		return $res;
	}

	/* SESSION check */
	function sessionOut() {
		unset($_SESSION["status"]);
		unset($_SESSION["uid"]);
		unset($_SESSION["name"]);
		unset($_SESSION["email"]);
		unset($_SESSION["homepage"]);
		unset($_SESSION["level"]);
		unset($_SESSION["password"]);
		return false;
	}
	function checkSESSIONStatus() {
		$name = isset($_SESSION["name"]) ? $_SESSION["name"] : '';
		$pwd = isset($_SESSION["password"]) ? $_SESSION["password"] : md5('');
		$sqlUser = @mysql_query("SELECT * FROM user WHERE name = \"$name\";");
		if($sqlUser === false || mysql_num_rows($sqlUser) !== 1) return sessionOut();
		$password = mysql_result($sqlUser, 0, "password");
		if($password === false || !password_verify($pwd, $password)) return sessionOut();
		$uid = mysql_result($sqlUser, 0, "uid");
		$email = mysql_result($sqlUser, 0, "email");
		$homepage = mysql_result($sqlUser, 0, "homepage");
			$homepage = urldecode($homepage);
		$level = mysql_result($sqlUser, 0, "level");
		if($password === false || $uid === false || $email === false || $homepage === false || $level === false) return sessionOut();
		$_SESSION["status"] = "1";
		$_SESSION["uid"] = $uid;
		$_SESSION["name"] = $name;
		$_SESSION["email"] = $email;
		$_SESSION["homepage"] = $homepage;
		$_SESSION["level"] = $level;
		$_SESSION["password"] = $pwd;
		return true;
	}
?>
