function postComment(self){
    var ajax =new XMLHttpRequest();
    ajax.open("POST","/do-comment",true);
    ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    ajax.onreadystatechange =function(){
        if(this.readyState ==4 && this.status ==200){
            //Append in the comments layout
            var response = JSON.parse(this.responseText);
            var html = "";
            html += '<div class="media mb-4">';
                html+='<img class="d-flex mr-3 comment-img" src="'+response.user.image+'">';
                    html+='<div class="media-body">';
                        html+= '<h5 class="mt-0">ken</h5>';
                    html+=self.comment.value;
                html+='</div>';
            html+='</div>';

            document.getElementById("comments").innerHTML=html+document.getElementById("comments").innerHTML;
            self.comment.value = "";
        }
    }
    var postId =document.getElementById("postId").value;
    ajax.send("postId="+postId +"&comment="+self.comment.value);
    return false;
}





<div id="comments">
    <%
    file.comments = file.comments.reverse();
    file.comments.forEach(function(comment){
    %>
    <div class="media mb-4">
        <img class="d-flex mr-3 comment-img" src="<%=comment.user.image%>">
        <div class="media-body">
            <h5 class="mt-0"><%=comment.user.name%></h5>
            <%=comment.comment%>
            <div id="replies">
              <!--if(islogin)-->
                <div style="float: right;cursor:pointer;" onclick="createReplyNode(this);" data-comment-id="<%=comment._id%>">Reply</div>   
                <%comment.replies.forEach(function(reply){%>
                <div class="media mt-4">
                    <img src="<%=reply.user.image%>" class="d-flex mr-3 comment-img">
                    <div class="media-body">
                        <h5 class="mt-0"><%= reply.user.name%></h5>
                        <%= reply.reply%>
                    </div>
                </div>
                <%})%>
            </div>
        </div>
    </div>
    <%})%>
</div>


    <div class="card my-4">
        <div class="card-header">
           <p style="color:blueviolet;">Leave Comment:</p> 
        </div>
        <div class="card-body">
            <form onsubmit="return postComment(this);">
                <div class="form-group">
                    <textarea name="comment" class="form-control" ></textarea>
                </div>
               
                <input type="submit" class="btn btn-primary" value="Comment">
            </form>
        </div>
    </div>



      function createReplyNode(node){
            var commentId = node.getAttribute("data-comment-id");
            var html = "";
            html += '<div class="row">';
                html += '<div class="col-md-12">';
                    html +='<form onsubmit="return postReply(this);">';
                        html +='<input type="hidden" name="commentId" value="'+commentId+'">';
                        html +='<div class="form-group">';
                            html +='<label>Write reply</label>';
                                html +='<textarea class="form-control" name="reply"></textarea>';
                                    html +='</div>';
                            html +='<button type="submit" class="btn btn-primary" data-comment-id="'+commentId+'">Post</button>';
                           html +='</form>';
                           html +='</div>';
                           html +='</div>';
                           node.innerHTML = html;
                           node.removeAttribute("onclick");
                        }

        function postReply(form){
            var commentId = form.commentId.value;
            var reply = form.reply.value;

            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/do-reply",true);
            ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            ajax.onreadystatechange = function(){
                if(this.readyState==4 && this.status==200){
                    var response = JSON.parse(this.responseText);
                    var html ="";
                    html +='<div class="media mt-4">';
                        html += '<img class="d-flex mr-3 comment-img" src="'+response.user.image+'">';
                            html += '<div class="media-body">';
                                html += '<h5 class="mt-0">'+ response.user.name +'</h5>';
                            html +=form.reply.value;
                        html +='</div>';
                    html += '</div>';
                    document.getElementById("replies").innerHTML += html;
                    form.reply.value = "";
                }
            }
            ajax.send("commentId="+commentId+"&reply="+reply);
            return false;
        }

        function postComment(self){
            var ajax = new XMLHttpRequest();
            var postId = document.getElementById("postId").value;
            ajax.open("POST","/do-comment",true);
            ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            ajax.onreadystatechange = function(){
                if(this.readyState ==4 && this.status ==200){
                    //Append in the comments layout
                    var response = JSON.parse(this.responseText);
                    var html = "";
                    html += '<div class="media mb-4">';
                        html+='<img class="d-flex mr-3 comment-img" src="'+response.user.image+'">';
                            html+= '<div class="media-body">';
                                html+= '<h5 class="mt-0">'+response.user.name+'</h5>';
                            html+= self.comment.value;
                        html+='</div>';
                    html+='</div>';
                    document.getElementById("comments").innerHTML+=html;
                    self.comment.value = "";
                }
            }                                
            ajax.send("postId="+postId+"&comment="+self.comment.value);                            
            return false;
        }
         