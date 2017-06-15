<?php
	$db = new PDO('mysql:host=localhost;dbname=DBNAME;charset=utf8', 'DBUSER', 'DBPASSWORD');
	do{
		$feedID = genRand();
		$stmt = $db->prepare("SELECT * FROM feeds WHERE feed_id= BINARY ?");
		$stmt->execute(array($feedID));
		$count = $stmt->rowCount();
	} while($count > 0);
	$time = gmdate("o-m-d\TH:i:s\Z");
	$stmt = $db->prepare("INSERT INTO feeds(feed_id,timest) VALUES(:fid,:tim)");
	$stmt->execute(array(':fid' => $feedID, ':tim' => $time));
	if($_REQUEST['nf']){
		header('Location: http://ourfeed.buzzell.me/'.$feedID);
	}else{
		header('Content-Type: application/json');
		echo json_encode(array('feed' => $feedID));
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