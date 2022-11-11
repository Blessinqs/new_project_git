var html ="";

db =mongodb+srv://Blessings:<password>@clusterschool99.hx9azpa.mongodb.net/?retryWrites=true&w=majorit
html+=`<div class="post-container">
        <div class="post-row">
            <div class="user-profile">
                <img src="/public/images/1.jpg">
                <div>
            <p style="color: white;position: relative; top: 7px; ">
            ${post.user.name}
            </p><br>
            <span style="position: relative; top: -10px;">June 24 2022,13:30 pm</span>
        </div>
    </div>
    <a href="#" style="color: white;"><i class="fa fa-ellipsis-v" ></i></a>
</div>
<input type="hidden" id="post_id" value="file._id">
<p class="post-text">${post.description}<a href="#">#more here</a></p>`;
if(post.imagePath){
    if(post.imagePath.split('.').pop()=='mp4'){
    html+=`<video muted controls id="videoPlayer" style="width: 100%;height: 100%;" poster="" class="thumbnail" onclick="this.play();">
            <source class="dark-bg" src="${post.imagePath}"/>
        </video>`
    
        }else{
    html+=`<img src="${post.imagePath}" style="width: 100%;height: 100%;" class="post-img">`;
    }
} 
html+=` <div class="post-row">
        <div class="activity-icons">
            
            <button type="button" class="btn btn-default" onclick="doLike();">
                <i class="fa fa-thumbs-up"></i>
                <span id="likes">
                    ${post.likes.length}
                </span>
            </button>
            
            <button type="button" class="btn btn-default" onclick="doDisLike();">
                <i class="fa fa-thumbs-down"></i>
                <span id="dislikes">
                  ${post.dislikes.length}
                </span>
            </button>

            <button type="button" class="btn btn-default" onclick="doDisLike();">
                <i class="fa fa-share"></i>
                <span id="share">
                  ${post.dislikes.length}
                </span>
            </button>
            <a href="/all-comments/${post._id}" style="text-decoration: none;"><i class="fa fa-comment-alt"></i></a>

            <button type="button" class="btn btn-default">
                <i class="fa fa-comment-alt"></i>
                <span id="comment">
                  ${post.comments.length}
                </span>
            </button>
           
        </div> 
                                          
        <div class="post-profile-icon">
            <img src="//">
            <span></span>  
        </div>

        <input type="hidden" name="post_id" id="post_id" value="${post._id}">
    </div>

    <div id="${post._id}" style="position: relative;top: 12%; 
        width: 100%; 
        height: 40%; 
        background-color: rgb(58, 17, 17); 
        color: whitesmoke;
        overflow-y: scroll;
        overflow-x: hidden;">`;
       
        post.comments = post.comments.reverse();
        post.comments.forEach(function(comment){
      
        html+=`<div class="media mb-4" style="margin-top: -5px;">
            <input type="hidden"  class="comment_id" value="${comment._id}">
            <div class="media-body">
                <img src="/public/images/member-2.png" style="width: 30px; height: 30px;" class="d-flex mr-3 rounded-circle">
                <h5 class="mt-0" style="position: relative; left: 32px; top: -30px;">${comment.user.name}</h5>
                <p style="color: white; position: relative; left: 20px;top: -25px;">${comment.comment}</p>
                <div id="replies" style="margin-left: 30px;">`;
            if(comment.replies){
                comment.replies.forEach(function(reply){
                    html+=`<div class="media mb-4">   
                            <div class="media-body">
                                <img src="/public/images/member-2.png" style="width: 30px; height: 30px;" class="d-flex mr-3 rounded-circle">
                                <h5 class="mt-0" style="position: relative; left: 32px; top: -30px;">${reply.user.name}</h5>
                                <p style="color: white; position: relative; left: 20px;top: -25px;">${reply.reply}</p>
                            </div>
                        </div>`;
                        })
                    }
                    
                    html+=`<div class="row" style="width:80%;">
                      <div class="col-md-12" style="display: inline-flex;">
                          <form onsubmit="return postReply(this);">
                            <input type="hidden" name="post_id" value="${post._id}">
                              <input type="hidden" name="comment_id" value="${comment._id}">
                              <input type="hidden" name="name" value="${users.name}">
                              <div class="form-group" style="margin-top:-30px;">
                                  <label>Write Reply</label>
                                      <textarea class="form-control" name="reply"></textarea>
                              </div>
                              <button type="submit" class="btn btn-primary">Post</button>
                          </form>
                      </div>
                    </div>

                </div>
            </div>
        </div>`;
    
        })
    html+=`</div>
      <div class="comment-body" style="background-color: rgb(58, 17, 17); border-radius: 5px;padding: 5px;padding-bottom: 0px;" >
        <form onsubmit="return postComment(this);">
                <input type="hidden" id="${post._id}" name="post_id" value="${post._id}">
                <input type="hidden" name="username" value="${users.name}">
            <div style="display: inline;  ">
                <textarea name="comment" id="comment-input" placeholder="Type comment..." style="padding-top:5px;padding-left: 5px; outline: none; width: 87%; height: 40px;border-radius: 5px;"></textarea>
                <input type="submit" id="button" class="btn btn-primary" value="Send" style="position: relative; top: -15px;">
            </div>
            
        </form>
    </div>
</div>`;