/**
 * Created with JetBrains WebStorm.
 * User: B1ackRainFlake
 * Author: Liuchenling
 * Date: 2/24/14
 * Time: 16:19
 */
(function(d){
    Object.prototype.on = function(m, f){
        if(d.addEventListener){
            this.addEventListener(m, f, false);
        }else{
            this.attachEvent(m, f);
        }
    };
    Object.prototype.off = function(m, f){
        if(d.removeEventListener){
            this.removeEventListener(m, f, false);
        }else{
            this.detachEvent(m, f);
        }
    };
    var alt = [
            "名字都不好好填!",
            "检查一下评论内容啦!"
        ],
        v = function(e,c){
            if(c) d.getElementsByTagName("form")[0][e].value = c;
            return d.getElementsByTagName("form")[0][e].value
        },
        addComment = function(r){
            var qzonelogo = "/images/head/" + r.qq + ".png",
                li = d.createElement("li"),
                div = d.createElement("div"),
                avatar = d.createElement("img"),
                strong = d.createElement("strong"),
                span = d.createElement("span"),
                p = d.createElement("p"),
                clear = d.createElement("div"),
                a1 = d.createElement("a"),
                a2 = d.createElement("a");
            a1.href = r.url;
            a2.href = r.url;
            li.id = "div-comment";
            li.className = "comment-cell";
            div.className = "comment-author";
            avatar.className = "avatar";
            avatar.src = qzonelogo,
            span.className = "datetime";
            clear.className = "clear";
            p.appendChild(d.createTextNode(r.content));
            strong.appendChild(d.createTextNode(r.name));
            span.appendChild(d.createTextNode(r.time.minute));
            a1.appendChild(avatar);
            div.appendChild(a1);
            a2.appendChild(strong);
            div.appendChild(a2);
            div.appendChild(span);
            li.appendChild(div);
            li.appendChild(p);
            li.appendChild(clear);
            if(r.content.split("@")[0] == "") li.style.marginLeft = "80px";
            d.getElementsByTagName("ol")[0].appendChild(li);
            Scroller.goTo($(".comment-list")[0].lastElementChild);
            d.getElementsByTagName("form")[0].reset();
            var avatars = $(".avatar");
            inv = setInterval(function(){
                if(avatars[avatars.length-1].naturalWidth)return clearInterval(inv);
                if(avatars[avatars.length-1].naturalWidth == 0 ){
                    avatars[avatars.length-1].src = avatars[avatars.length-1].src;
                }
            }, 500);
        };

    var replyComment = function(e){
        if(!v("name")){
            return alert(alt[0]);
        }
        if(!v("content")){
            return alert(alt[1]);
        }
        var ajax = new Ajax(),
            postString = "name="+v("name")+"&qq="+v("qq")+"&url="+v("url")+"&content="+v("content");
        ajax.post(location.href, postString, function(res){
            var result = JSON.parse(res);

            if (result.status == 0){
                return console.log(result.info);
            } else if (result.status == 1){
                return addComment(result);
            }
        });
    };
    if($("#submit"))
        $("#submit").on('click', replyComment);
    for(var i = 0, l = $(".comment-cell").length; i < l; i++){
        $(".comment-cell")[i].on("mouseover",function(){
            this.getElementsByClassName('at')[0].style.display = 'inline';
        });
        $(".comment-cell")[i].on("mouseout",function(){
            this.getElementsByClassName('at')[0].style.display = 'none';
        });
        $(".comment-cell")[i].getElementsByClassName('at')[0].on('click', function(){
            console.log(this);
            $('textarea')[0].value = this.firstChild.nodeValue + " " + $('textarea')[0].value;
            locatePoint(100,100);
            $('textarea')[0].click();
            Scroller.goTo($('#comment'))
        });
        if($(".comment-cell")[i].getElementsByTagName('p')[1].firstChild.nodeValue.split("@")[0] == ""){
            $(".comment-cell")[i].style.marginLeft = "80px";
        }
    }
})(document);
