<?php session_start();
	$hidden = isset($_GET["hidden"]) ? $_GET["hidden"] : 1;
	echo '<a href = "/">To Home</a> || ';
	echo '<a href = "admin.php?hidden='.$hidden.'">Refresh Dash Borad</a><br>';
	echo 'connecting...<br>';
	require_once("connection/connection.php");
	echo 'loading...<br>';
	include_once("api/checkFunc.php");
	echo "checking permission...<br>";
	if(!checkSESSIONStatus()) die("sign in first.");
	if(!isset($_SESSION["level"]) || $_SESSION["level"] !== "9") die("permission denied.");
?>
<?php
	$hash_map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	if(isset($_POST["addNumber"])) {
		$num = $_POST["addNumber"];
		for($i = 0; $i < $num; $i++) {
			$len = 10; $str = "";
			for($pos = 0; $pos < $len; $pos++) {
				$chr = mt_rand(0, strlen($hash_map));
				$str .= $hash_map[$chr];
			}
			echo "Adding [".$i."] => [".$str."]   ";
			$sql = @mysql_query("INSERT INTO invitation (string) VALUES (\"$str\");");
			if($sql) echo "Successfully!<br>"; else echo "Failed<br>";  
		}
		echo "Adding done.<br>";
		return;
	}
?>
<?php
	echo 'querying...<br><br>';
	$sqlInvitation = @mysql_query("SELECT * FROM invitation") or die("system error");
	$num = mysql_num_rows($sqlInvitation);
	echo $num." records found.";
	echo '<a = href = "admin.php?hidden=0"><button>Show All</button></a> <a = href = "admin.php?hidden=1"><button>Hideen used</button></a>';
	echo '<br><hr>';
	$html = '<table width = "100%" border = "1px">';
	$html .= "<tr><th>IID</th><th>String</th><th>Used</th></tr>";
	for($i = 0; $i < $num; $i++) {
		$number = @mysql_fetch_array($sqlInvitation) or die("system error");
		if($hidden && $number["used"]) continue;
		$html .= "<tr><td>".$number["iid"]."</td><td>".$number["string"]."</td><td>".$number["used"]."</td></tr>";
	}
	$html .= '</table>';
	echo $html;
	echo '<br><div>'
		.  '<form action = "admin.php?hidden='.$hidden.'" method = "post" onsubmit = "return confirm(\'Sure?\');">'
		.    '<input type = "submit" value = "Add"> '
		.    '<input type = "text" name = "addNumber"> Invitation Numbers'
		.  '</form>'
		.'</div>';
?>
