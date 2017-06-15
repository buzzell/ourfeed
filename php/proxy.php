<?php
	$remoteImage = $_REQUEST['u'];
	$imginfo = getimagesize($remoteImage);
	header("Content-type: ".$imginfo['mime']);
	readfile($remoteImage);
?>