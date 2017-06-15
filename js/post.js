$(function(){
	var post = {
        slug: window.location.pathname.slice(1),
        checkPost: function(){
            var t = this;
            $.ajax({
                type: 'POST',
                url: '/'+t.slug+'.json?limit=1000',
                dataType: 'json',
                success: function(json){
                    if(!json.error){
                        t.pJson = json;
                        t.init();
                    }else{
                        $('.content').html('<div class="notfound">'+json.error+'</div>');
                    }
                }
            });
        },
        genPost: function(j){
            if(j.media){
                if(j.media.type == "youtube"){
                    var mediaHtml = 
                        '<div class="postMedia yt">'+
                            '<div class="mediaImg">'+
                                '<div class="mediaOverlay">'+
                                    '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACV0lEQVRYR+1XTU8TYRB+ZnZrhUT8SCReDGA8GXZbIR64YWIiMR78Bf4F/RVGykHDH+jBxKsmSvQKJ0lILQVDSBRbhJiIAYoptXQ7Y94SSEmqvCxre+mcNu/Ox7PPzLwzS2izUJvjowPgkIGC510E0UMANxW4rEQXCOgRoBsiXWCOM3AGgCsiMWZ2GtMnIjVmrgIIBNiDyG9ynDJUd1V1B6rbDvMGgIwQvRjIZreNfR1A3veHQPQOQG8rakJEvkN17NriYo7mhodjl4JgmYGBVgRviLHcNz9/gwqJxH0F3rQ4eD0cqd6hr8nkc1J91BYAwFPDwHsF7rYDAIDXlE8ksgAStgB6JyexmUohWFuzNfmX3qxhYFWBq7be+rJZaKWCnXQaxXS6/hxWlOgL5T2vCOYeWycGwIEYFjYnJlCenrY1P6pXq/2kFc+rMrNr66ERwIFNeWYmVFpEZNfUgNoGN3rNAJjzMGkRkSAyAGHSYq7v/wMglYJJy3ESKQCTAtMVpjusO0OkGl0Rjo8jWF8/7qOPvN8vwtO2oSXdTZGJbIS+iE5Md3NuPlPe9z+CKGnLXf0qDkH3X/x/aO8wEnlFBd9/pkSPbRmIVI/oCeWTyXtQnYrUsaUzJbpNOjrqFra2lgBct7SLRE1FPvUvLHj1pXRlcNB3HOftScbyqVCorsJ1x/ozmaXDtfzbyEhXUCo9IKJbMAuq6nkA52qq3cR8VkXijmocRDFhdhmICbA/RUWEmWsCBAD2GKiYtRxEZQAlAL9AVFTgBxPNxUVeXsnlzHnnz6jDAP4AEoxBP0TOwtcAAAAASUVORK5CYII=" />'+
                                '</div>'+
                                '<a role="button" data-ytid="'+j.media.media+'">'+
                                    '<img class="mediaCont" src="'+j.media.image+'" />'+
                                '</a>'+
                            '</div>'+
                            '<div class="mediaInfo">'+
                                '<h1><a href="http://www.youtube.com/watch?v='+j.media.media+'" target="_blank">'+j.media.title+'</a></h1>'+
                                '<p>'+j.media.desc+'</p>'+
                                '<div class="domain">'+j.media.domain.toUpperCase()+'</div>'+
                            '</div>'+
                        '</div>';
                }else if (j.media.type == "image") {
                    var mediaHtml = 
                        '<div class="postMedia bigImg">'+
                            '<div class="mediaImg">'+
                                '<a href="'+j.media.media+'" target="_blank">'+
                                    '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'+
                                    '<img class="mediaCont" src="/php/proxy.php?u='+encodeURIComponent(j.media.media)+'" />'+
                                    '<div class="domain">'+j.media.domain+'</div>'+
                                '</a>'+
                            '</div>'+
                        '</div>';
                }else if (j.media.type == "link") {
                    var bcl = "";                  
                    if(j.media.image){
                        if(j.media.imgWidth > 399){
                            bcl = ' bigImg';
                        }
                        var imgHtml = 
                            '<div class="mediaImg">'+
                                '<a href="'+j.media.media+'" target="_blank">'+
                                    '<img class="mediaCont" src="/php/proxy.php?u='+encodeURIComponent(j.media.image)+'" />'+
                                '</a>'+
                            '</div>';
                    }else{
                        var imgHtml = "";
                        bcl = ' bigImg';
                    }
                    var p = (j.media.desc)?'<p>'+j.media.desc+'</p>':'';
                    var mediaHtml =
                        '<div class="postMedia'+bcl+'">'+
                            imgHtml+
                            '<div class="mediaInfo">'+
                                '<h1><a href="'+j.media.media+'" target="_blank">'+j.media.title+'</a></h1>'+
                                p+
                                '<div class="domain">'+j.media.domain.toUpperCase()+'</div>'+
                            '</div>'+
                        '</div>';
                }
            }else{
                mediaHtml = "";
            }
            var replyHtml = (j.replies)?'<div class="postReplies"><div class="replyCont">'+this.genReplies(j.replies)+'</div></div>':'';
            var postHtml = 
                '<div id="'+j.postId+'" class="postItem">'+
                    '<div class="postMain">'+
                        '<div class="postBody">'+
                            '<p>'+j.post+'</p>'+
                        '</div>'+
                        '<div class="postBy clearfix">'+
                            '<img src="'+j.user.image+'" />'+
                            '<h2>'+j.user.username+'</h2>'+
                            '<a href="#'+moment(j.created).format()+'"><time datetime="'+j.created+'">'+this.timeFromNow(j.created)+'</time></a>'+
                        '</div>'+
                    '</div>'+
                    mediaHtml+
                    replyHtml+
                '</div>';
            return postHtml;
        },
        genReplies: function(r){
            var gThis = this;
            var repliesHtml = '';
            $.each(r, function(k,v){
                repliesHtml += 
                    '<div class="postReply">'+
                        '<img src="'+v.user.image+'" />'+
                        '<h3>'+v.user.username+' </h3>'+
                        '<p>'+v.reply+'</p>'+
                        '<time datetime="'+v.created+'">'+gThis.timeFromNow(v.created)+'</time>'+
                    '</div>';
            });
            return repliesHtml;
        },
        updateDateTime: function(){
            var gThis = this;
            setTimeout(function(){
                $('time').each(function(i){
                    var dt = $(this).attr('datetime');
                    $(this).text(gThis.timeFromNow(dt));
                });
                gThis.updateDateTime();
            },10000)
        },
        timeFromNow: function(lTime){
            var dtime = "";
            this.nowtime = moment.utc().format();
            var hourDiff = moment(this.nowtime).diff(moment(lTime), 'hours');
            if(hourDiff == 0){
                var minDiff = moment(this.nowtime).diff(moment(lTime), 'minutes');
                if(minDiff == 0){
                    var secDiff = moment(this.nowtime).diff(moment(lTime), 'seconds');
                    if(secDiff == 0){
                        dtime = "Now";
                    }else{
                        dtime = secDiff+"s";
                    }
                }else{
                    dtime = minDiff+"m";
                }
            }else if (hourDiff < 23) {
                dtime = hourDiff+"h";
            }else if(hourDiff < 47) {
                dtime = "Yesterday at "+moment(lTime).format('LT');
            }else{
                dayDiff = moment(this.nowtime).diff(moment(lTime), 'days');
                if(dayDiff > 30){
                    if(moment(lTime).format('YYYY') < moment(this.nowtime).format('YYYY')){
                        dtime = moment(lTime).format('MMMM D[,] YYYY');
                    }else{
                        dtime = moment(lTime).format('MMMM D');
                    }
                }else{
                   dtime = moment(lTime).format('MMMM D [at] h:mm[]a'); 
                }
            }
            return dtime; 
        },
        ytEmbed: function(){
            var ytid = $(this).attr('data-ytid');
            embedHtml = '<iframe src="https://www.youtube.com/embed/'+ytid+'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
            var pmParent = $(this).parents('.postMedia');
            var miParent = $(this).parents('.mediaImg');
            pmParent.addClass('bigImg');
            miParent.addClass('ytWrapper').html(embedHtml);
        },
        init: function(){
            this.nowtime = moment.utc().format(); 
            $('.content').removeClass('flex');
            $('.content').removeClass('flex').html(this.genPost(this.pJson)).on('click', '.yt .mediaImg a', this.ytEmbed);
            hideSwitch();
            $('.lights').on('click',lights);
            $('.bigImg .mediaImg a img').on('load',function(){
                $(this).siblings('.spinner').remove();
            });
        }
    }
    post.checkPost();   
});
var h = moment().format('H');
if(h < 6 || h >= 20){
    $('body').addClass('night');
    $('.lights').removeClass('on').addClass('off');
}
function lights(){
    if($(this).hasClass('on')){
        $(this).removeClass('on').addClass('off');
        $('body').addClass('night');
    }else{
        $(this).removeClass('off').addClass('on');
        $('body').removeClass('night');
    }
}
function hideSwitch(){
    var wWidth = $(window).outerWidth();
    if(wWidth < 870){
        $('.lights').fadeOut('fast');
    }else{
        $('.lights').fadeIn('fast')
    }
}
$(window).on('resize', hideSwitch);