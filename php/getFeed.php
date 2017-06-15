<?php
	$db = new PDO('mysql:host=localhost;dbname=DBNAME;charset=utf8', 'DBUSER', 'DBPASSWORD');
	$i = $_REQUEST['i'];
	$l = $_REQUEST['limit'];
	if(empty($l)){
		$l = 25;	
	}
	$stmt = $db->prepare("SELECT * FROM feeds WHERE feed_id= BINARY ?");
	$stmt->execute(array($i));
	if($stmt->rowCount() > 0){
		$feed = $stmt->fetch(PDO::FETCH_ASSOC);
		$feedArr = array(
			'feedId' => $feed['feed_id'],
			'created' => $feed['timest']
		);
		$stmt = $db->prepare("SELECT * FROM posts WHERE feed_id= BINARY ? ORDER BY id DESC LIMIT 1");
		$stmt->execute(array($i));
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$after = $results[0];
		if($_REQUEST['after']){
			$stmt = $db->prepare("SELECT * FROM posts WHERE post_id= BINARY ?");
			$stmt->execute(array($_REQUEST['after']));
			$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$after = $results[0];
			$d = "<";
		}elseif($_REQUEST['before']){
			$stmt = $db->prepare("SELECT * FROM posts WHERE post_id= BINARY ?");
			$stmt->execute(array($_REQUEST['before']));
			$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$after = $results[0];
			$d = ">";
		}else{
			$after['id'] = $after['id'] + 1;
			$d = "<";
		}
		$stmt = $db->prepare("SELECT * FROM posts WHERE feed_id = :fid AND id ".$d." :id ORDER BY id DESC LIMIT :li");
		$stmt->bindParam(':fid', $i, PDO::PARAM_STR);
		$stmt->bindParam(':id', $after['id'], PDO::PARAM_INT);
		$stmt->bindParam(':li', intval($l), PDO::PARAM_INT);
		$stmt->execute();
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if(count($results) > 0){
			$feedArr['paging']['cursors']['before'] = $results[0]['post_id'];
			$feedArr['paging']['previous'] = 'http://ourfeed.buzzell.me/'.$i.'.json?limit='.$l.'&before='.$results[0]['post_id'];
			$feedArr['paging']['cursors']['after'] = end($results)['post_id'];
			$feedArr['paging']['next'] = 'http://ourfeed.buzzell.me/'.$i.'.json?limit='.$l.'&after='.end($results)['post_id'];
		}
		if($results.count()>0){
			$time = array();
		}
		foreach($results as $v){
			$time[] = $v['timest'];
			$postArr = array(
				'postId' => $v['post_id'],
				'created' => $v['timest'],
				'post' => $v['post'],
				'user' => json_decode($v['user'])
			);
			if($v['media'] != "{}"){
				$postArr['media'] = json_decode($v['media']);
			}
			$stmt = $db->prepare("SELECT * FROM replies WHERE post_id= BINARY ? ORDER BY id DESC");
			$stmt->execute(array($v['post_id']));
			$replyCount = $stmt->rowCount();
			if($replyCount > 0){
				$postArr['replyCount'] = $replyCount;
			}
			$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
			foreach($results as $v){
				$replyArr = array(
					'replyId' => $v['reply_id'],
					'created' => $v['timest'],
					'reply' => $v['reply'],
					'user' => json_decode($v['user'])
				);
				$postArr['replies'][] = $replyArr;
			}
			$feedArr['posts'][$v['post_id']] = $postArr;
		}
		if(($_REQUEST['before'] && $_REQUEST['not']) || $_REQUEST['not']){
			$postedIDS = json_decode($_REQUEST['not']);
			foreach($postedIDS as $val){
				unset($feedArr['posts'][$val]);
			}
		}
		if($feedArr['posts']){
			array_multisort($time, SORT_DESC, $feedArr['posts']);
		}
		header('Content-Type: application/json; charset=UTF-8');
		if($_REQUEST['jpp'] == 1){
			echo json_encode($feedArr, JSON_PRETTY_PRINT);
		}else{
			echo json_encode($feedArr);
		}
	}else{
		header('Content-Type: application/json;charset=UTF-8');
		echo json_encode(array('error' => 'The feed was not found'));
	}
?>