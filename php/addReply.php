<?php
	$db = new PDO('mysql:host=localhost;dbname=DBNAME;charset=utf8', 'DBUSER', 'DBPASSWORD');
	$text = $_REQUEST['text'];
	$time = $_REQUEST['timest'];
	$postID = $_REQUEST['post'];
	$user = $_REQUEST['user'];
	do{
		$replyID = genRand();
		$stmt = $db->prepare("SELECT * FROM replies WHERE reply_id= BINARY ?");
		$stmt->execute(array($replyID));
		$count = $stmt->rowCount();
	} while($count > 0);
	$row = array(':rid' => $replyID, ':pid' => $postID, ':tim' => $time,':po' => nl2br($text), ':us' => $user);
	$stmt = $db->prepare("INSERT INTO replies(reply_id,post_id,timest,reply,user) VALUES(:rid,:pid,:tim,:po,:us)");
	$stmt->execute($row);
	header('Content-Type: application/json;charset=UTF-8');
	echo json_encode(array('replyID' => $replyID, 'created' => $time,'reply' => nl2br($text), 'user' => json_decode($user)));
	function genRand($length = 16) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
	    return $randomString;
	}
?>