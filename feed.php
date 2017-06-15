<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
        <title>OurFeed</title>
        <meta name="description" content="Whats really on your mind?">
        <meta property="og:type" content="website" />
        <meta property="og:title" content="OurFeed" />
        <meta property="og:description" content="Whats really on your mind?" />
        <meta property="og:url" content="<?= 'http://'.$_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI]?>" />
        <meta property="og:image" content="http://ourfeed.buzzell.me/img/ourfeed.png" />
        <meta name="theme-color" content="#e9ebee">
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="shortcut icon" href="/favicon.ico" />
		<link rel="stylesheet" href="css/bsButtons.css">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="css/style.css">
        <!--[if lt IE 9]><script src="js/respond.js"></script><script src="http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js"></script><![endif]-->
    </head>
    <body>
        <div class="lights on"></div>
        <div class="content flex">
            <div class="userBox"></div>
            <div class="postList"></div>
            <div class="loadingMore"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>
        </div>
        <!--[if lt IE 9]><script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script><![endif]-->
        <!--[if gte IE 9]><!--><script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script><!--<![endif]-->
        <script src="js/moment.js"></script>
        <script src="js/autosize.js"></script>
        <script src="js/feed.js"></script>
    </body>
</html>