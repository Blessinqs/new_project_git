/*
                    socket.on("new_post",(formData)=>{
                        var html = "";
                        html+= '<div class="post-container">';
                            html+='<div class="post-row">';
                                html+='<div class="user-profile">';
                                    html+='<img src="/public/images/1.jpg">';
                                    html+='<div>';
                                        html+='<p>file.user.name</p><br>';
                                        html+='<span>June 24 2022,13:30 pm</span>';
                                        html+='</div>';
                                    html+='</div>';
                                html+='<a href="#"><i class="fa fa-ellipsis-v"></i></a>';
                                html+='</div>';
                            
                            html+='<p class="post-text">Subscribe <span>Here bacause </span><%=file.description%> <a href="#">#YouTutorials</a><a href="#">#Tutorials</a></p>';
                            html+='/*<!--<img src="file.imagePath" class="post-img">-->';
                                html+='        <video muted controls id="videoPlayer" style="width: 100%;" poster="" class="thumbnail" onclick="this.play();">';
                                    html+='            <source class="dark-bg" src="file.imagePath"/>';
                                        html+='        </video>';
                                html+='    <div class="post-row">';
                                    html+='        <div class="activity-icons">';
                                        
                                        html+='            <button type="button" class="btn btn-default" onclick="doLike();">';
                                            html+='                <i class="fa fa-thumbs-up"></i>';
                                            html+='                <span id="likes">';
                                                html+='                    file.likes.length';
                                                html+='                </span>';
                                            html+='            </button>';
                                        
                                        html+='            <button type="button" class="btn btn-default" onclick="doDisLike();">';
                                            html+='                <i class="fa fa-thumbs-down"></i>';
                                            html+='                <span id="dislikes">';
                                                html+='                  file.dislikes.length';
                                              html+='                </span>';
                                            html+='            </button>';
                                       
                                        html+='        </div> ';
                                    
                                    
                                    html+='        <div class="post-profile-icon">';
                                        html+='            <img src="/public/images/member-2.png">';
                                        html+='        <i class="fas fa-caret-down"></i>';
                                        html+='            <p>users.name</p>  ';
                                        html+='        </div>';
                                    html+='        <input type="hidden" name="post_id" id="post_id" value="<%=file._id%>">';
                                    html+='    </div>';
    
                                html+='    <div class="card-header" style="color:rgb(181, 216, 216);">';
                                    html+='        <h6>All Comments:</h6>';
                                    html+='        <hr>';
                                    html+='        </div>';

                                    html+='        <div id="file._id" style="position: relative; top: 10%; width: 100%; height: 50%; opacity: 0.6; background-color: rgb(97, 42, 42); color: whitesmoke; overflow-y: scroll;">';
                                    html+='        <%';
                                    html+='            file.comments = file.comments.reverse();';
                                    html+='            file.comments.forEach(function(comment){';
                                        html+='            %>';
                                    html+='            <div class="media mb-4">';
                                        html+='            <input type="hidden"  class="comment_id" value="comment._id">';
                                        html+='            <div class="media-body">';
                                            html+='            <img src="/public/images/member-2.png" style="width: 30px; height: 30px;" class="d-flex mr-3 rounded-circle">';
                                            html+='            <h5 class="mt-0"><%=comment.user.name%></h5>';
                                            html+='            <%=comment.comment%>';
                                            html+='            <div id="replies" style="margin-left: 30px;">';
                                                html+='    <div class="card-header" style="color:rgb(181, 216, 216);">';
                                                    html+='        <hr>';
                                                    html+='    </div>';
                                                html+='    <%if(comment.replies){%>';
                                                    html+='   <%comment.replies.forEach(function(reply){%>';
                                                        html+='       <div class="media mb-4">';
                                                            
                                                            html+='         <div class="media-body">';
                                                                html+='             <img src="/public/images/member-2.png" style="width: 30px; height: 30px;" class="d-flex mr-3 rounded-circle">';
                                                                html+='               <h5 class="mt-0">reply.user.name</h5>';
                                                                html+='                 reply.reply';
                                                                html+='                </div>';
                                                            html+='             </div>';
                                                        html+='         <%})%>';
                                                    html+='       <%}%>';
                                                
                                                html+='     <div class="row" style="width:80%;">';
                                                    html+='      <div class="col-md-12">';
                                                    html+='          <form onsubmit="return postReply(this);">';
                                                        html+='           <input type="hidden" name="post_id" value="file._id">';
                                                        html+='                <input type="hidden" name="comment_id" value="comment._id">';
                                                          html+='                 <input type="hidden" name="name" value="users.name">';
                                                          html+='                 <div class="form-group">';
                                                            html+='                    <label>Write reply</label>';
                                                              html+='                        <textarea class="form-control" name="reply"></textarea>';
                                                                  html+='               </div>';
                                                          html+='                <button type="submit" class="btn btn-primary">Post</button>';
                                                          html+='             </form>';
                                                      html+='              </div>';
                                                  html+='              </div>';
    
                                                html+='           </div>';
                                            html+='        </div>';
                                        html+='     </div>';
                                
                                    html+='        <%})%>';
                                    html+='    </div>';
                                html+='   </div>';

                                html+='   <div class="card my-4">';
                                        html+='     <div class="card-header" style="color:darkslategrey;">';
                                            html+='          Leave Comment:';
                                            html+='    </div>';
                                        html+='   <div class="card-body">';
                                            html+='  <form onsubmit="return postComment(this);">';
                                                html+='    <div class="form-group">';
                                                    html+='         <input type="hidden" id="<%=file._id%>" name="post_id" value="<%=file._id%>">';
                                                    html+='            <input type="hidden" name="username" value="<%=users.name%>">';
                                                    html+='           <input type="hidden" name="email" >';
                                                    html+='             <textarea name="comment" class="form-control" id="comment-input" ></textarea>';
                                                    html+='        </div>';
                                
                                                html+='         <input type="submit" id="button" class="btn btn-primary" value="Comment">';
                                                html+='        </form>';
                                            html+='    </div>';
                                        html+='    </div>';
                             html+='</div> ';
                    });*/

function messagesDisplay(messages){
    var html = "";
    messages.forEach(function(msg){
        if(msg.user.name==username){
                html+='   <div class="chat-r">';
                html+='    <div class="sp"></div>';
                html+='    <div class="mess mess-r">';
                html+='        <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;" style="font-size: 12px;">'+msg.user.name+'</span>';
                html+='            <p style="font-size: 12px;">'+msg.message+'</p>';
                html+='                <div class="check">';
                html+='                    <span>4:00 PM</span>';
                html+='                </div>';     
                html+='        </div>';
                html+='    </div>';
            }else{
                html+='<div class="chat-l">';
                html+='    <div class="mess mess-r">';
                html+='        <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;" style="font-size: 12px;">'+msg.user.name+'</span>';
                html+='            <p style="font-size: 12px;">'+msg.message+'</p>';
                html+='                <div class="check">';
                html+='                    <span>4:00 PM</span>';
                html+='                </div>';
                html+='    </div>';
                html+='    <div class="sp"></div>';
                html+=' </div>';
            }
    })
    return html;

}

