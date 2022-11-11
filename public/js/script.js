var settingsmenu = document.querySelector(".settings-menu");
var darkBtn = document.getElementById('dark-btn');
var upload = document.querySelector('.status-btn');
var status_main = document.getElementById('user-status-main');
var close = document.getElementById('close-status');

function settingsMenuToggle(){
    settingsmenu.classList.toggle("settings-menu-height");
}

upload.onclick = ()=>{
    status_main.style.display="block";
}

close.onclick = ()=>{
    status_main.style.display="none";
}

darkBtn.onclick = function(){
    darkBtn.classList.toggle("dark-btn-on");
   document.body.classList.toggle('dark-theme');

    if(localStorage.getItem("theme")=="light"){
        localStorage.setItem("theme","dark");
    }else{
        localStorage.setItem("theme","light");
    }
}

if(localStorage.getItem("theme")=="light"){
    darkBtn.classList.remove('dark-btn-on');
    document.body.classList.remove("dark-theme");

}
else if(localStorage.getItem("theme")==dark){
    darkBtn.classList.add('dark-btn-on');
    document.body.classList.add("dark-theme");
}
else{
localStorage.setItem("theme","light");
}
/*
var loader=document.getElementById("loading-area");
window.addEventListener("load",vanish);
function vanish(){
    loader.style.display="none";
}*/

                                    


