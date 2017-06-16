$(function () {
    var feed = {
        slug: window.location.pathname.slice(1),
        checkFeed: function(){
            var t = this;
            $.ajax({
                type: 'POST',
                url: t.slug+'.json',
                dataType: 'json',
                success: function(json){
                    if(!json.error){
                        t.fJson = json;
                        t.init();
                    }else{
                        $('.content').html('<div class="notfound">'+json.error+'</div>');
                    }
                }
            });
        },
        addUser: function(){
            gThis = this;
            $('.userBox').html(
                '<div style="display:block" class="whoIs">'+
                    '<input type="text" placeholder="Who are you?" spellcheck="false" />'+
                    '<div class="prom">'+
                        '<a class="btn btn-link disabled" role="button">Next</a>'+
                    '</div>'+
                '</div>');
            $('.whoIs input').on('keyup',function(){
                var tVal = $(this).val().trim();
                if(tVal != ""){
                    $('.whoIs a').removeClass('disabled').off('click').on('click',function(){
                        $(this).off('click').addClass('disabled').text('Save');
                        gThis.userName = tVal;
                        $('.whoIs input').attr({'placeholder':'What do you look like? (Image URL)','type':'url'}).val('').off('keyup').on('paste keyup',function(){
                            var tt = $(this);
                            setTimeout(function(){
                                var tVal = tt.val().trim();
                                if(tVal != "" && validateURL(encodeURI(tVal))){
                                    $('.whoIs a').removeClass('disabled').off('click').on('click',function(){
                                        gThis.userImage = tVal;
                                        if(hasStorage()){
                                            var temp = { 'name': gThis.userName, 'img': gThis.userImage};
                                            localStorage.setItem('userData_'+gThis.slug, JSON.stringify(temp));
                                        }
                                        $('.content').removeClass('flex');
                                        gThis.poster();
                                        gThis.postList();
                                        gThis.updateFeed();
                                        gThis.updateDateTime();
                                        $('.userImg').on('error', function(){
                                            $(this).attr('src','http://ourfeed.buzzell.me/img/ninja.png');
                                            gThis.userImage = 'http://ourfeed.buzzell.me/img/ninja.png';
                                        });
                                        $('.replyBox img').on('error', function(){
                                            $(this).attr('src','http://ourfeed.buzzell.me/img/ninja.png');
                                        });
                                    });
                                }else{
                                    $('.whoIs a').addClass('disabled').off('click');
                                }
                            }, 100);
                        });
                    });
                }else{
                    $('.whoIs a').addClass('disabled').off('click');
                }
            });
        },
        poster: function(){
            var gThis = this;
            var mediaObj={};
            $('.userBox').html(
                '<div class="notYou">'+
                    '<a role="button">Click here</a> if this is not you.'+
                '</div>'+
                '<div class="postBox" style="display:block;">'+
                    '<div class="postOverlay">'+
                        '<div class="spinner">'+
                            '<div class="rect1"></div>'+
                            '<div class="rect2"></div>'+
                            '<div class="rect3"></div>'+
                            '<div class="rect4"></div>'+
                            '<div class="rect5"></div>'+
                        '</div>'+
                    '</div>'+
                    '<img title="Not you?" class="userImg" src="'+this.userImage+'" />'+
                    '<textarea id="postcont" class="postcont"  rows="1" placeholder="What&#39;s really on your mind?"></textarea>'+
                    '<div class="postMedia" style="display: none;"></div>'+
                    '<div class="prom">'+
                        '<div class="shareBox clearfix">'+
                            '<div><input type="url" placeholder="Youtube URL" /></div>'+
                            '<div><input type="url" placeholder="Image URL" /></div>'+
                            '<div><input type="url" placeholder="Link" /></div>'+
                        '</div>'+
                        '<a class="btn btn-link disabled" role="button">Post</a>'+
                    '</div>'+
                '</div>');
             autosize($('.postBox .postcont'));
            $('.shareBox div').on('click',function(){
                $('.shareBox div').removeClass('active');
                $(this).addClass('active').find('input').focus();
            });
            $('.shareBox div input').on('click',function(){$(this).select()}).on('paste',function(){
                var t = $(this);
                setTimeout(function(){
                    if(validateURL(t.val().trim())){
                        $('.shareBox div input').blur();
                        $('.postBox .postMedia').removeClass('yt bigImg').show().html('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>')
                        $.ajax({
                            type: 'POST',
                            url: 'php/parse.php',
                            dataType: 'json',
                            cache:true,
                            data: {"u": t.val()},
                            success: function(json){
                                if(json.type == "youtube"){
                                    var mediaHtml = 
                                        '<div class="mediaRemove mainRemove"></div>'+
                                        '<div class="mediaImg">'+
                                            '<div class="mediaOverlay">'+
                                                '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACV0lEQVRYR+1XTU8TYRB+ZnZrhUT8SCReDGA8GXZbIR64YWIiMR78Bf4F/RVGykHDH+jBxKsmSvQKJ0lILQVDSBRbhJiIAYoptXQ7Y94SSEmqvCxre+mcNu/Ox7PPzLwzS2izUJvjowPgkIGC510E0UMANxW4rEQXCOgRoBsiXWCOM3AGgCsiMWZ2GtMnIjVmrgIIBNiDyG9ynDJUd1V1B6rbDvMGgIwQvRjIZreNfR1A3veHQPQOQG8rakJEvkN17NriYo7mhodjl4JgmYGBVgRviLHcNz9/gwqJxH0F3rQ4eD0cqd6hr8nkc1J91BYAwFPDwHsF7rYDAIDXlE8ksgAStgB6JyexmUohWFuzNfmX3qxhYFWBq7be+rJZaKWCnXQaxXS6/hxWlOgL5T2vCOYeWycGwIEYFjYnJlCenrY1P6pXq/2kFc+rMrNr66ERwIFNeWYmVFpEZNfUgNoGN3rNAJjzMGkRkSAyAGHSYq7v/wMglYJJy3ESKQCTAtMVpjusO0OkGl0Rjo8jWF8/7qOPvN8vwtO2oSXdTZGJbIS+iE5Md3NuPlPe9z+CKGnLXf0qDkH3X/x/aO8wEnlFBd9/pkSPbRmIVI/oCeWTyXtQnYrUsaUzJbpNOjrqFra2lgBct7SLRE1FPvUvLHj1pXRlcNB3HOftScbyqVCorsJ1x/ozmaXDtfzbyEhXUCo9IKJbMAuq6nkA52qq3cR8VkXijmocRDFhdhmICbA/RUWEmWsCBAD2GKiYtRxEZQAlAL9AVFTgBxPNxUVeXsnlzHnnz6jDAP4AEoxBP0TOwtcAAAAASUVORK5CYII=" />'+
                                            '</div>'+
                                            '<a href="http://www.youtube.com/watch?v='+json.media+'" target="_blank">'+
                                                '<img class="mediaCont" src="'+json.image+'" />'+
                                            '</a>'+
                                        '</div>'+
                                        '<div class="mediaInfo">'+
                                            '<h1><a href="http://www.youtube.com/watch?v='+json.media+'" target="_blank">'+json.title+'</a></h1>'+
                                            '<p>'+json.desc+'</p>'+
                                            '<div class="domain">'+json.domain.toUpperCase()+'</div>'+
                                        '</div>';
                                    $('.postBox .postMedia').addClass('yt');
                                    mediaObj = {"type":"youtube","media":json.media,"title":json.title,"desc":json.desc,"image":json.image,"domain":"YOUTUBE.COM"};
                                }else if (json.type == "image") {
                                    var mediaHtml = 
                                        '<div class="mediaImg">'+
                                            '<div class="mediaRemove mainRemove"></div>'+
                                            '<a href="'+json.media+'" target="_blank">'+
                                                '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'+
                                                '<img class="mediaCont" src="php/proxy.php?u='+encodeURIComponent(json.media)+'" />'+
                                                '<div class="domain">'+json.domain.toUpperCase()+'</div>'+
                                            '</a>'+
                                        '</div>';
                                    $('.postBox .postMedia').addClass('bigImg');
                                    mediaObj = {"type":"image","media":t.val(),"domain":json.domain.toUpperCase()};
                                }else if (json.type == "link") { 
                                    if(json.image){
                                        mediaObj['image'] = json.image;
                                        mediaObj['imgWidth'] = json.imgWidth;
                                        if(json.imgWidth > 399){
                                            $('.postBox .postMedia').addClass('bigImg');
                                        }
                                        var imgHtml = 
                                            '<div class="mediaImg">'+
                                                '<div class="mediaRemove imgRemove"></div>'+
                                                '<a href="'+json.media+'" target="_blank">'+
                                                    '<img class="mediaCont" src="php/proxy.php?u='+encodeURIComponent(json.image)+'" />'+
                                                '</a>'+
                                            '</div>';
                                         $('.postBox .postMedia').on('click','.imgRemove',function(e){
                                            e.stopPropagation();
                                            $('.postBox .mediaImg').remove();
                                            $('.postBox .postMedia').addClass('bigImg');
                                            delete mediaObj.image;
                                            delete mediaObj.imWidth;
                                        });
                                    }else{
                                        $('.postBox .postMedia').addClass('bigImg');
                                        var imgHtml = "";
                                    }
                                    var tit = (json.title)?json.title:json.domain;
                                    var p = (json.desc)?'<p>'+json.desc+'</p>':'';
                                    var mediaHtml = 
                                        '<div class="mediaRemove mainRemove"></div>'+
                                            imgHtml+
                                        '<div class="mediaInfo">'+
                                            '<h1><a href="'+json.media+'" target="_blank">'+tit+'</a></h1>'+
                                            p+
                                            '<div class="domain">'+json.domain.toUpperCase()+'</div>'+
                                        '</div>';
                                    mediaObj.type = "link";
                                    mediaObj.media = t.val();
                                    mediaObj.title = tit;
                                    if(p != ""){
                                        mediaObj.desc = json.desc;
                                    }
                                    mediaObj.domain = json.domain.toUpperCase();
                                }
                                $('.postBox .postMedia').html(mediaHtml);
                                $('.bigImg .mediaImg a img').on('load',function(){
                                    $(this).siblings('.spinner').remove();
                                    $(this).siblings('.domain').show();
                                });
                                $('.mainRemove').on('click',function(){
                                    $('.postBox .postMedia').html('').hide();
                                    mediaObj = {};
                                });
                            }
                        });
                    }else{
                        var p = t.attr('placeholder');
                        var a = 'a ';
                        if(p == "Image URL"){
                            a = 'an ';
                        }
                        t.val("That wasn't "+a+p);
                        setTimeout(function(){
                            t.val('');
                        },2000);
                    }
                },100);
            });
            $('.userImg').click(function(){
                var togg = $(this).attr('data-togg');
                if(togg == "true"){
                    $('.notYou').slideUp('fast');
                    $(this).attr('data-togg','false');
                }else{
                    $('.notYou').slideDown('fast');
                    $(this).attr('data-togg','true');
                }
            });
            $('.notYou a').click(function(){
                if(hasStorage()){
                    localStorage.removeItem('userData_'+gThis.slug);
                }
                window.location = "http://ourfeed.buzzell.me/"+gThis.slug;
            })
            $('.userBox .postcont').on('keyup paste',function(e){
                var t = $(this);
                setTimeout(function(){
                    if(t.val().trim() != ""){
                        $('.prom a').removeClass('disabled').off('click').on('click',function(){
                            $(this).off('click').addClass('disabled');
                            $('.postOverlay').show();
                            $.ajax({
                                type: 'POST',
                                url: 'php/addPost.php',
                                dataType: 'json',
                                data: {feed:gThis.slug,text:htmlEncode(t.val()),media:JSON.stringify(mediaObj),timest:moment.utc().format(),user:'{"username":"'+gThis.userName+'","image":"'+gThis.userImage+'"}'},
                                success: function(json){
                                    $('.postList').prepend(gThis.genPost(json));
                                    $('.bigImg .mediaImg a img').on('load',function(){
                                        $(this).siblings('.spinner').remove();
                                        $(this).siblings('.domain').show();
                                    });
                                    gThis.postedIDS.push(json.postId);
                                    autosize($('.replyBox textarea'));
                                    t.val('').css('height','37px');
                                    $('.postBox .postMedia').hide().html('');
                                    $('.shareBox div input').val('');
                                    $('.shareBox div').removeClass('active');
                                    $('.postOverlay').hide();
                                    mediaObj = {};
                                }
                            });
                        });
                    }else{
                        $('.prom a').addClass('disabled').off('click');
                    }
                },100)
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
                                    '<img class="mediaCont" src="php/proxy.php?u='+encodeURIComponent(j.media.media)+'" />'+
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
                                    '<img class="mediaCont" src="php/proxy.php?u='+encodeURIComponent(j.media.image)+'" />'+
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
            var replyHtml = (j.replies)?this.genReplies(j.replies):'';
            var postHtml = 
                '<div id="'+j.postId+'" class="postItem">'+
                    '<div class="postMain">'+
                        '<div class="postBody">'+
                            '<p>'+j.post+'</p>'+
                        '</div>'+
                        '<div class="postBy clearfix">'+
                            '<img src="'+j.user.image+'" />'+
                            '<h2>'+j.user.username+'</h2>'+
                            '<a href="http://ourfeed.buzzell.me/post/'+j.postId+'#'+moment(j.created).format()+'" target="_blank"><time datetime="'+j.created+'">'+this.timeFromNow(j.created)+'</time></a>'+
                        '</div>'+
                    '</div>'+
                    mediaHtml+
                    '<div class="postReplies">'+
                        '<div class="replyBox">'+
                            '<img src="'+this.userImage+'" />'+
                            '<textarea data-postID="'+j.postId+'" rows="1" placeholder="Leave a reply"></textarea>'+
                            '<a class="btn btn-link disabled" role="button">Post</a>'+
                        '</div>'+
                        '<div class="replyCont">'+
                            replyHtml+
                        '</div>'+
                    '</div>'+
                '</div>';
            return postHtml;
        },
        genReplies: function(r){
            var gThis = this;
            var repliesHtml = '';
            var overthree = 0;
            $.each(r, function(k,v){
                var hideit = ""
                if(k > 2){ 
                    overthree += 1;
                    hideit = ' style="display:none;"';
                }
                repliesHtml += 
                    '<div class="postReply"'+hideit+'>'+
                        '<img src="'+v.user.image+'" />'+
                        '<h3>'+v.user.username+' </h3>'+
                        '<p>'+v.reply+'</p>'+
                        '<time datetime="'+v.created+'">'+gThis.timeFromNow(v.created)+'</time>'+
                    '</div>';
            });
            if(overthree > 0){
                repliesHtml += '<div class="moreReplies"><a class="btn btn-link" role="button">'+overthree+' more replies</a></div>';
            }
            return repliesHtml;
        },
        postList: function(){
            var gThis = this;
            if(gThis.fJson.posts){
                var postListHtml = "";
                $.each(gThis.fJson.posts, function(i, post){
                    postListHtml += gThis.genPost(post);
                });
                $('.postList').html(postListHtml);
                autosize($('.replyBox textarea'));
                if(gThis.fJson.paging && Object.keys(gThis.fJson.posts).length == 25){
                    gThis.loadMore(gThis.fJson.paging);
                }
            }
        },
        addReply: function(){
            var gThis = this;
            var taText = $(this);
            var rbParent = taText.parent('.replyBox');
            if(taText.val().trim() != ""){
                $(rbParent).find('a').removeClass('disabled').show().off('click').on('click',function(){
                    rbParent.addClass('loading');
                    $(this).off('click').addClass('disabled').html('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>')  
                    taText.attr('disabled','disabled');
                    $.ajax({
                        type: 'POST',
                        url: 'php/addReply.php',
                        dataType: 'json',
                        data: {post:taText.attr('data-postID'),text:htmlEncode(taText.val()),timest:moment.utc().format(),user:'{"username":"'+feed.userName+'","image":"'+feed.userImage+'"}'},
                        success: function(json){
                            rbParent.parent('.postReplies').find('.replyCont').prepend('<div class="postReply"><img src="'+json.user.image+'" /><h3>'+json.user.username+' </h3><p>'+json.reply+'</p><time datetime="'+json.created+'">'+feed.timeFromNow(json.created)+'</time></div>');
                            $(rbParent).find('a').text('Post').hide();
                            taText.val('').css('height','40px').removeAttr('disabled');
                        }
                    });
                });
            }else{
                $(rbParent).find('a').addClass('disabled').hide().off('click');
            }
        },
        loadMore: function(p){
            var gThis = this;
            $(window).on('scroll',function(){
                if($(window).scrollTop() + $(window).height() > ($(document).height()-100)) {
                    $(window).off('scroll');
                    $('.loadingMore').show();
                    $.ajax({
                        type: 'POST',
                        url: p.next,
                        dataType: 'json',
                        success: function(json){
                            if(json.paging){
                                var postListHtml = "";
                                $.each(json.posts, function(i, post){
                                    postListHtml += gThis.genPost(post);
                                });
                                $('.postList').append(postListHtml);
                                $('.bigImg .mediaImg a img').on('load',function(){
                                    $(this).siblings('.spinner').remove();
                                    $(this).siblings('.domain').show();
                                });
                                $('.loadingMore').hide();
                                gThis.loadMore(json.paging);
                            }
                            $('.loadingMore').hide();
                        }
                    });
                }
            });        
        },
        updateFeed: function(){
            var gThis = this
            setTimeout(function(){
                var updateURL = "http://ourfeed.buzzell.me/"+gThis.slug+".json?not="+JSON.stringify(gThis.postedIDS);
                if(gThis.fJson.paging){
                    updateURL += "&limit=100&before="+gThis.fJson.paging.cursors.before;
                }
                $.ajax({
                    type: 'POST',
                    url: updateURL,
                    dataType: 'json',
                    success: function(json){
                        if(json.paging){
                            var postListHtml = ""
                            $.each(json.posts, function(i, post){
                                postListHtml += gThis.genPost(post);
                            });
                            $('.postList').prepend(postListHtml);
                            autosize($('.replyBox textarea'));
                            if(gThis.fJson.paging){
                                gThis.fJson.paging.cursors.before = json.paging.cursors.before;
                                gThis.fJson.paging.previous = json.paging.previous;
                                gThis.fJson.posts = $.merge(json.posts, gThis.fJson.posts);
                            }else{
                                gThis.fJson.paging = json.paging;
                                gThis.fJson.posts = json.posts;
                            }  
                        }
                        gThis.updateFeed();
                    } 
                });
            }, 10000);
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
            $(this).parents('.postMedia').addClass('bigImg');
            $(this).parents('.mediaImg').addClass('ytWrapper').html(embedHtml);
        },
        init: function(){
            this.postedIDS = [];
            this.nowtime = moment.utc().format(); 
            if(hasStorage() && localStorage['userData_'+this.slug]){
                var gThis = this;
                var t = JSON.parse(localStorage['userData_'+this.slug]);
                this.userName = t.name;
                this.userImage = t.img;
                $('.content').removeClass('flex');
                this.poster();
                this.postList();
                this.updateFeed();
                this.updateDateTime();
                $('.userImg').on('error', function(){
                    $(this).attr('src','http://ourfeed.buzzell.me/img/ninja.png');
                    gThis.userImage = 'http://ourfeed.buzzell.me/img/ninja.png';
                });
                $('.replyBox img').on('error', function(){
                    $(this).attr('src','http://ourfeed.buzzell.me/img/ninja.png');
                });
            }else{
                this.addUser();
            }
            hideSwitch();
            $('.bigImg .mediaImg a img').on('load',function(){
                $(this).siblings('.spinner').remove();
                $(this).siblings('.domain').show();
            });
            $('.lights').on('click',lights);
            $('.postList').on('click', '.moreReplies a', function(){
                $(this).parents('.replyCont').find('.postReply').show();
                $(this).hide();
            });
            $('.postList').on('click', '.yt .mediaImg a', this.ytEmbed);
            $('.postList').on('keyup', '.replyBox textarea', this.addReply);
        }
    }
    feed.checkFeed();
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
function hasStorage(){var m='modernizr';try{localStorage.setItem(m,m);localStorage.removeItem(m);return true;}catch(e){return false;}}
function validateURL(textval){var urlregex = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})?$/;return urlregex.test(textval);}
function htmlEncode(value){return $('<div/>').text(value).html();}