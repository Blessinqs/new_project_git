let message = document.getElementById('message'),
     feedback = document.getElementById("listnames");
let title =document.getElementById('chat-title');
var listchat = document.querySelectorAll('.user-name');
let flag=0;
const socket = io.connect();
const username = 'users.name';



function actionToggle(){
    var action = document.querySelector('.action');
    action.classList.toggle('activ')
}

function showchat(){
    var chatB = document.querySelector('.chat-container');
    var chatBox = document.querySelectorAll('.user');
    var nav = document.querySelector('.navigate');
    /*for (var i=0;i<chatBox.length;i++)
    {
        chatBox[i].addEventListener('click',()=>{
            console.log("cliked",i);
        }) }
    */
    chatBox.forEach((chat)=>{
        chat.onclick = function(e){
            if(flag==0){
                chatB.style.display = "block";
                chatB.style.width = '100%'
                flag=1;
            }else{
                nav.style.width = "90%";
                chatB.style.display = "none";
                flag=0;
            }
        }
    })
    
      /*
        chatBox[i].onclick=function(){
            if(flag==0){
                nav.style.width = "20%";
                chatBox[i].style.display = "block";
                flag=1;
            }else{
                nav.style.width = "90%";
                chatBox[i].style.display = "none";
                flag=0;
            }
        }*/
   
}


// emiting the user name to the server
socket.emit("username",username);

// catching the image to the client
socket.on('base64codeimage',(base64)=>{
document.getElementById('imag').src = base64;

//previewing the image with socket.io
document.getElementById('file').addEventListener('change',function(){
        const reader = new FileReader();
        reader.onload = function(){
        const base64 = this.result.replace(/.*base64,/,'');
        let base64string = "data:image/jpeg;charset-utf-8;base64,"+base64;
        socket.emit('base64codeimage',base64string);
    };
    reader.readAsDataURL(this.files[0]);
    },false);

if(username){
$("#chats").append(`
<div class="chat-r">
    <div class="sp"></div>
    <div class="mess mess-r">
        <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${username}</span>
            <img id="imag" src="${base64}" style="width:100%; height: 200px;">   
        </div>
    </div>`);
  }else{
    $("#chats").append(`
    <div class="chat-l">
        <div class="mess mess-r">
            <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${username}</span>
                <img id="imag" src="${base64}" style="width:100%; height: 200px;">  
                </div>
                <div class="sp"></div>
        </div>`);
}

});

//clicking the send message button 
document.getElementById('button').addEventListener('click',()=>{
//let message = document.getElementById('message').value;
    feedback.innerHTML=" ";
    socket.emit('message',message.value);
    //document.getElementById('message').value = "";
    message.value="";
});

message.addEventListener("keypress",function(){
socket.emit('typing',username);
})

message.addEventListener("touchstart",function(){
socket.emit('typing',username);
})

socket.on('typing',function(data){
feedback.innerHTML = '<p><em>'+data+' is typing..</em></p>'
})

    socket.on('message',(result)=>{
    if(username==result.user){
        $("#chats").append(`
        <div class="chat-r">
            <div class="sp"></div>
            <div class="mess mess-r">
                <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${result.user}</span>
                    <p>${result.message}<img src="/public/images/feeling.png" class="emoji" id="imag"></p>
                        <div class="check">
                            <span>4:00 PM</span>
                            <img src="/public/images/done.png" >
                        </div>       
                </div>
            </div>`);
    }else{
        $("#chats").append(`
            <div class="chat-l">
                <div class="mess mess-r">
                    <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${result.user}</span>
                        <p>${result.message}<img src="/public/images/feeling.png" class="emoji" id="imag"></p>
                            <div class="check">
                                <span>4:00 PM</span>
                            </div>
                        </div>
                        <div class="sp"></div>
                    </div>`);
        }
    });
 //getting the old maesages 
socket.on('oldmessages',(results)=>{
if(username==results.user){
    $("#chats").append(`
    <div class="chat-r">
        <div class="sp"></div>
          <div class="mess mess-r">
            <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${results.user}</span>
                <p>${results.message}<img src="/public/images/feeling.png" class="emoji"></p>
                    <div class="check">
                        <span>4:00 PM</span>
                        <img src="/public/images/done.png" >
                    </div>      
            </div>
        </div>`);
    }else{
    $("#chats").append(`
        <div class="chat-l">
            <div class="mess mess-r">
                <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${results.user}</span>
                    <p>${results.message}<img src="/public/images/feeling.png" class="emoji"></p>
                        <div class="check">
                            <span>4:00 PM</span>
                        </div>
                    </div>
                <div class="sp"></div>
            </div>`);
}
});


/*
socket.on('oldimage',(data)=>{

document.getElementById('imag').src = data;
console.log(data)
if(username){
$("#chats").append(`
<div class="chat-r">
    <div class="sp"></div>
    <div class="mess mess-r">
        <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${username}</span>
            <img id="imag" src="${data}" style="width:100%; height: 200px;">   
        </div>
    </div>`
);
}else if(username==undefined || !data){}
else{
$("#chats").append(`
<div class="chat-l">
    <div class="mess mess-r">
        <img src="/public/images/profile-pic.png" class="left-pp"><span style="padding:4px;">${username}</span>
            <img id="imag" src="${data}" style="width:100%; height: 200px;">  
            </div>
            <div class="sp"></div>
        </div>`
);
}

})*/

