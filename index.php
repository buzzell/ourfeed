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
        <meta property="og:url" content="http://ourfeed.buzzell.me/" />
        <meta property="og:image" content="http://ourfeed.buzzell.me/img/ourfeed.png" />
        <meta name="theme-color" content="#e9ebee">
        <link rel="icon" type="image/png" href="/favicon-32x32.png?v=1" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png?v=1" sizes="16x16" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <link rel="stylesheet" href="css/bsButtons.css">
        <!--[if lt IE 9]><script src="js/respond.js"></script><script src="http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js"></script><![endif]-->
        <style type="text/css">
            html, body{
                height:100%;
            }
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color:#e9ebee;
            }
            body.night{
                background-color:#333;
            }
            .btn{
                height: 46px;
                width: 136px;
                text-align: center;
            }
            .spinner {
                width: 50px;
                height: 30px;
                text-align: center;
                font-size: 10px;
                position: absolute;
                top: 20%;
                left: 50%;
                margin-left: -25px;
                margin-top: -15px;
                z-index: 1000;
            }
            .spinner > div {
                background-color: #eee;
                height: 100%;
                width: 6px;
                display: inline-block;
                -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
                animation: stretchdelay 1.2s infinite ease-in-out;
            }
            .spinner .rect2 {
                -webkit-animation-delay: -1.1s;
                animation-delay: -1.1s;
            }
            .spinner .rect3 {
                -webkit-animation-delay: -1.0s;
                animation-delay: -1.0s;
            }
            .spinner .rect4 {
                -webkit-animation-delay: -0.9s;
                animation-delay: -0.9s;
            }
            .spinner .rect5 {
                -webkit-animation-delay: -0.8s;
                animation-delay: -0.8s;
            }
            @-webkit-keyframes stretchdelay {
                0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
                20% { -webkit-transform: scaleY(1.0) }
            }
            @keyframes stretchdelay {
                0%, 40%, 100% { 
                    transform: scaleY(0.4);
                    -webkit-transform: scaleY(0.4);
                }  20% { 
                    transform: scaleY(1.0);
                    -webkit-transform: scaleY(1.0);
                }
            }
        </style>
    </head>
    <body>
        <a class="btn btn-default btn-lg" role="button" href="http://ourfeed.buzzell.me/newfeed">New Feed</a>
        <!--[if lt IE 9]><script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script><![endif]-->
        <!--[if gte IE 9]><!--><script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script><!--<![endif]-->
        <script src="js/moment.js"></script>
        <script type="text/javascript">
            $(function(){
                var h = moment().format('H');
                if(h < 6 || h >= 20){
                    $('body').addClass('night');
                }
            }); 
        </script>
    </body>
</html>