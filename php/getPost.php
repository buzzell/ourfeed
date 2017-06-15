<?php
	$db = new PDO('mysql:host=localhost;dbname=DBNAME;charset=utf8', 'DBUSER', 'DBPASSWORD');
	$i = $_REQUEST['i'];
	$l = $_REQUEST['limit'];
	if(empty($l)){
		$l = 25;	
	}
	$stmt = $db->prepare("SELECT * FROM posts WHERE post_id= BINARY ?");
	$stmt->execute(array($i));
	if($stmt->rowCount() > 0){
		$post = $stmt->fetch(PDO::FETCH_ASSOC);
		$postArr = array(
			'postId' => $post['post_id'],
			'created' => $post['timest'],
			'post' => $post['post'],
			'user' => json_decode($post['user']),
		);
		if($post['media'] != "{}"){
			$postArr['media'] = json_decode($post['media']);
		}
		$stmt = $db->prepare("SELECT * FROM replies WHERE post_id= BINARY ? ORDER BY id DESC LIMIT 1");
		$stmt->execute(array($i));
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$after = $results[0];
		if($stmt->rowCount() > 0){
			if($_REQUEST['after']){
				$stmt = $db->prepare("SELECT * FROM replies WHERE reply_id= BINARY ?");
				$stmt->execute(array($_REQUEST['after']));
				$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$after = $results[0];
			}else{
				$after['id'] = $after['id'] + 1;
			}
			$stmt = $db->prepare("SELECT * FROM replies WHERE post_id = :fid AND id < :id ORDER BY id DESC LIMIT :li");
			$stmt->bindParam(':fid', $i, PDO::PARAM_STR);
			$stmt->bindParam(':id', $after['id'], PDO::PARAM_INT);
			$stmt->bindParam(':li', intval($l), PDO::PARAM_INT);
			$stmt->execute();
			$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if(count($results) > 0){
				$postArr['paging']['after'] = end($results)['reply_id'];
				$postArr['paging']['next'] = 'http://ourfeed.buzzell.me/post/'.$i.'.json?limit='.$l.'&after='.end($results)['reply_id'];
			}
		}
		if($results.count()>0){
			$time = array();
		}
		foreach($results as $v){
			$time[] = $v['timest'];
			$replyArr = array(
				'replyId' => $v['reply_id'],
				'created' => $v['timest'],
				'reply' => $v['reply'],
				'user' => json_decode($v['user'])
			);
			$postArr['replies'][] = $replyArr;
		}
		if($postArr['replies']){
			array_multisort($time, SORT_DESC, $postArr['replies']);
		}
		header('Content-Type: application/json;charset=utf-8');
		echo json_encode($postArr,JSON_PRETTY_PRINT);
	}else{
		header('Content-Type: application/json;charset=utf-8');
		echo json_encode(array('error' => 'The post was not found'));
	}
?>