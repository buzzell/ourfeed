<?php
	$db = new PDO('mysql:host=localhost;dbname=DBNAME;charset=utf8', 'DBUSER', 'DBPASSWORD');
	$text = $_REQUEST['text'];
	$media = $_REQUEST['media'];
	$time = $_REQUEST['timest'];
	$feedID = $_REQUEST['feed'];
	$user = $_REQUEST['user'];
	do{
		$postID = genRand();
		$stmt = $db->prepare("SELECT * FROM posts WHERE post_id=?");
		$stmt->execute(array($postID));
		$count = $stmt->rowCount();
	} while($count > 0);
	$row = array(':pid' => $postID, ':fe' => $feedID, ':tim' => $time,':po' => nl2br($text), ':me' => $media, ':us' => $user);
	$stmt = $db->prepare("INSERT INTO posts(post_id,feed_id,timest,post,media,user) VALUES(:pid,:fe,:tim,:po,:me,:us)");
	$stmt->execute($row);
	header('Content-Type: application/json;charset=UTF-8');
	if($media != "{}"){echo json_encode(array('postId' => $postID, 'created' => $time,'post' => nl2br($text), 'media' => json_decode($media), 'user' => json_decode($user)));}else{
		echo json_encode(array('postId' => $postID, 'created' => $time,'post' => nl2br($text), 'user' => json_decode($user)));
	}
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