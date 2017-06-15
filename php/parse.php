<?php
	$validImgType = array('image/png','image/jpg','image/jpeg','image/jpe','image/gif');
	$url = $_REQUEST['u'];
	$urlParts = parse_url($url);
	$domainParts = explode(".", $urlParts['host']);
	$l = count($domainParts);
	$topDomain = $domainParts[$l-2];
	$tld = $domainParts[$l-1];
	$urlHeaders = get_headers(rtrim($url,"/"), 1);
    if(isset($urlHeaders['Content-Type'])){
        $type = strtolower($urlHeaders['Content-Type']);
        if(in_array($type, $validImgType)){
        	$returnArr = array(
				'type' => 'image',
				'media' => $_REQUEST['u'],
				'imgType' => str_replace('image/','',$type),
				'domain' => $urlParts['host']
			);
        }else{
        	if((strtolower($topDomain) == "youtube" && $urlParts['path'] == "/watch") || (strtolower($topDomain) == "youtu")){
        		if($urlParts['path'] == "/watch"){
        			parse_str($urlParts['query']);
        		}else{
        			$v = str_replace("/", "", $urlParts['path']);
        		}
        		$returnArr = array(
					'type' => 'youtube',
					'media' => $v,
					'domain' => $topDomain.'.'.$tld
				);
				$returnArr = array_merge($returnArr, getMetaData($url));
        	}else {
        		$returnArr = array(
					'type' => 'link',
					'media' => $url,
					'domain' => $topDomain.'.'.$tld
				);
				$returnArr = array_merge($returnArr, getMetaData($url,true));
        	}
        }
    }else{
    	$returnArr = array(
			'type' => 'link',
			'media' => $url,
			'domain' => $topDomain.'.'.$tld
		);
    }
    echo json_encode($returnArr);
    function getMetaData($u,$link = false){
    	$tempArr = array();
    	$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, 0);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    	curl_setopt($ch, CURLOPT_URL, $u);
    	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		$html = curl_exec($ch);
    	curl_close($ch);
    	$doc = new DOMDocument();
		$doc->loadHTML($html);
		$metas = $doc->getElementsByTagName('meta');
		for ($i = 0; $i < $metas->length; $i++){
			$meta = $metas->item($i);
			if($meta->getAttribute('name') == 'description'){
				$tempArr['desc'] = substr($meta->getAttribute('content'), 0, 150).'...';
			}
			if($meta->getAttribute('property') == 'og:description'){
				$tempArr['desc'] = substr($meta->getAttribute('content'), 0, 150).'...';
			}
			if($meta->getAttribute('name') == 'title'){
				$tempArr['title'] = $meta->getAttribute('content');
			}
			if($meta->getAttribute('property') == 'og:title'){
				$tempArr['title'] = $meta->getAttribute('content');
			}
			if($meta->getAttribute('property') == 'og:image'){
				$tempArr['image'] = $meta->getAttribute('content');
			}
			if($meta->getAttribute('property') == 'og:image:width'){
				$tempArr['imgWidth'] = $meta->getAttribute('content');
			}
		}
		$links = $doc->getElementsByTagName('link');
		for ($i = 0; $i < $links->length; $i++){
			$link = $links->item($i);
			if($link->getAttribute('rel') == 'image_src'){
				$tempArr['image'] = $link->getAttribute('href');
			}
		}
		if(empty($tempArr['title'])){
			$nodes = $doc->getElementsByTagName('title');
			$tempArr['title'] = $nodes->item(0)->nodeValue;
		}
		if($link && $tempArr['image'] && empty($tempArr['imgWidth'])){
			$tempArr['imgWidth'] = getimagesize($tempArr['image'])[0];
		}
		return $tempArr;
    }
?>