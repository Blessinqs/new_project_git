var express = require("express");
var app = express();
var formidable = require("formidable");
var http = require("http").createServer(app);
//const server = http.createServer(app);
var path =require('path');
var mongodb = require("mongodb");
const mongoose = require('mongoose');
var cors = require('cors');
const multer = require('multer');
const methodOverride= require('method-override');
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
var fs = require('fs');
const io = require('socket.io')(http,{
    cors:{
    origin:"http://localhost/:7070",
}});
var download = require("download");
var downloader = require("nodejs-file-downloader");

var bodyParser = require("body-parser");
var bcyrpt = require("bcrypt");
var PORT = process.env.PORT || 7070
//var fileSystem = require("fs");
app.use(methodOverride('_method'));

var expressSession = require("express-session");
var MongoDBStore = require('connect-mongodb-session')(expressSession);
app.use("/public",express.static(__dirname+"/public"));
app.use("/views",express.static(__dirname+"/views"));
//app.use(cors());
var storeMod = new MongoDBStore({
    uri: 'mongodb+srv://Blessings:bless123@clusterschool99.hx9azpa.mongodb.net/video_streams',
    collection: 'Sessions'
  });
app.set("view engine","ejs");
app.use(expressSession({
    "key":"user_id",
    "secret":"User secret Object Id",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
    "resave":true,
    "saveUninitialized":true,
    store: storeMod,

}));

var users={};
var files={}
var email;
app.use(bodyParser.json({
    limit:"10000mb"
}));

let vidfiles={}
let gfs;

const store = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'https://drive.google.com/drive/my-drive/videos');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
})

const store2 = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'https://drive.google.com/drive/my-drive/videos');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
})

const uploadImage = multer({
    storage:store,
    fileFilter:function(req,file,callback){
        if(file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="video/mp4"){
            callback(null,true);
        }else{
            console.log("Only jpg and png images are allowed....!");
            callback(null,false);
        }
    },
    limits:{
        fileSize:1024*1024*1024
    }
})

const uploadVideo = multer({
    storage:store2,
    fileFilter:function(req,file,callback){
        if( file.mimetype=="video/mp4"){
            callback(null,true);
        }else{
            console.log("Only mp4 videos....!");
            callback(null,false);
        }
    },
    limits:{
        fileSize:1024*1024*1024
    }
})


app.use(bodyParser.urlencoded({
    extended:true,
    limit:"10000mb",
    parameterLimit:1000000
}));

let bas64image = "";
let messages =[];
let allusers=[];
const allmessages = {
    general:[],
    random:[],
    jokes:[],
    javascript:[]
};

function getUser(id,callBack){
    database.collection("users").findOne({
        "_id":ObjectId(id)
    },function(error,user){
        callBack(user);
    });
}

function To2Digits(num){
    return num.toString().padStart(2,'0');
}

function formatTimeAndDate(date){
    return {
       year:[
           To2Digits(date.getDate()),
            To2Digits(date.getMonth()+1),
            date.getFullYear(), 
        ].join(' '),
       hrs:[
            To2Digits(date.getHours()),
            To2Digits(date.getMinutes()),
            To2Digits(date.getSeconds()),
        ].join(':'),
    }
}

http.listen(PORT,async ()=>{
    console.log("Server Running on port 7070");

    //database is done/connection here ----->
    mongoClient.connect("mongodb+srv://Blessings:bless123@clusterschool99.hx9azpa.mongodb.net/video_streams",function(error,client){
    database=client.db("video_streams");

    //home router is here now  ----->
    app.get("/", function(req,res){
        res.render('index1');
        //res.render('indexes');
    });

    app.get('/documents',(req,res)=>{
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("videos").find({}).toArray((error,videos)=>{
                   
                    if(!videos || videos.length==0){

                        res.render('docs',{
                            videos: videos?videos:"",
                            users:user,
                            profile:user.profile[user.profile.length-1],
                            "isLogin": req.session.user_id ? true : false,
                        });

                        } else {

                            if(user.profile.length>0){  
                                res.render('docs',{
                                    videos:videos?videos:"",
                                    users:user,
                                    profile:user.profile[user.profile.length-1],
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }else{
                                res.render('docs',{ 
                                    videos: videos?videos:"",
                                    users:user,
                                    profile:"/public/images/avatar.png",
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }
                        
                        } 
                       
                    });
            });
         }else{
            res.redirect("/login");
        }

    });

    app.get('/tutorial',(req,res)=>{
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("videos").find({}).toArray((error,videos)=>{
                    if(!videos || videos.length==0){
                        res.render('tutorial',{
                            videos: videos?videos:"",
                            users:user,
                            profile:user.profile[user.profile.length-1],
                            "isLogin": req.session.user_id ? true : false,
                        });
                        } else {
                            if(user.profile.length>0){  
                                res.render('tutorial',{
                                    videos:videos?videos:"",
                                    users:user,
                                    profile:user.profile[user.profile.length-1],
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }else{
                                res.render('tutorial',{ 
                                    videos:videos?videos:"",
                                    users:user,
                                    profile:"/public/images/avatar.png",
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }
                        
                        } 
                       
                    });
            });
         }else{
            res.redirect("/login");
        }

    });

    app.get("/download/:id",async (req,res)=>{
     
        var files = await database.collection("posts").find({}).toArray();
        if (req.session.user_id){
            var file = 'http://localhost:7070';
            getUser(req.session.user_id,function(user){
                files.forEach(element => {
                    if(element._id==req.params.id){
                        (async()=>{
                            const actualDownload = new downloader({
                                url:file+element.imagePath,
                                directory:"/Downloads",
                                onProgress:function(percentage,chunk,remainingSize){
                                    console.log(percentage);
                                   
                                }
                            })
        
                            try{
                                await actualDownload.download()
                                console.log("Done...!")
                            }catch(error){
                                console.log("An error occured")
                            }
    
                        })();  
                    }
                });

            });
         }else{
            res.redirect("/login");
        }

    
    });


     app.post("/create-class",function(req,res){
        //check if the user is logged in or not
        if (req.session.user_id){  
               var description = req.body.name
                getUser(req.session.user_id,function(user){
                    var currentTime = formatTimeAndDate(new Date());
                    //insert in database
                    database.collection("classes").insertOne({
                            "createdBy":{
                                    "_id":user._id,
                                    "name": user.name,
                                    "image":user.profile.length? user.profile[0]: "/public/images/avatar.png",
                                 },
                                "description":description,
                                "createdAt":currentTime,
                                "likes":[],
                                "students": [],
                                "comments":[],
                                "timetable":[],
                                "media":[]    
                        },
                    function(error,class1){
                        //Insert in the users collection too the data
                        database.collection("users").updateOne({
                        "_id":ObjectId(req.session.user_id)
                            },{
                                  $push:{
                                      "My_class":{
                                          "_id":class1.insertedId,
                                          "description":description,
                                      }
                                  } 
                               });
                               res.redirect("/classes");
                            });
                    });
        }else{
            res.redirect("/login")
        }
    });

    app.get("/classrooms", function(req,res){
        res.render('chats');
    });

    

    app.get("/madis",(req,res)=>{
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                if(user.profile.length>0){           
                    res.render('comments',{
                        users:user,
                        profile:user.profile[user.profile.length-1],
                        "isLogin": req.session.user_id ? true : false,
                    });
                }else{
                    res.render('comments',{
                        users:user,
                        profile:"/public/images/avatar.png",
                        "isLogin": req.session.user_id ? true : false,
                    });
                }
            });
         }else{
            res.redirect("/login");
        }
        

    });

    app.get("/solution",(req,res)=>{
        res.render('solutions',{
            users:users
        });
    });

    app.get("/profile",function(req,res){
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                if(user.profile.length>0){           
                    res.render('profile',{
                        users:user,
                        profile:user.profile[user.profile.length-1],
                        "isLogin": req.session.user_id ? true : false,
                    });
                }else{
                    res.render('profile',{
                        users:user,
                        profile:"/public/images/avatar.png",
                        "isLogin": req.session.user_id ? true : false,
                    });
                }
            });
         }else{
            res.redirect("/login");
        }
       
   
    });



    app.get("/tutorial",(req,res)=>{
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                if(user.profile.length>0){           
                    res.render('tutorial',{
                        files:files,
                        users:user,
                        profile:users.profile[users.profile.length-1],
                        "isLogin": req.session.user_id ? true : false,
                    });
                }else{
                    res.render('tutorial',{
                        files:files,
                        users:user,
                        profile:"/public/images/avatar.png",
                        "isLogin": req.session.user_id ? true : false,
                    });
                }
        
            });
         }else{
            res.redirect("/login");
        }
        
    })
   
       
    
     // Creating the new post here
    /* app.post("/post-upload",function(req,res){
        //check if the user is logged in or not
        if (req.session.user_id){  
               var description = req.body.description
                getUser(req.session.user_id,function(user){
                    var currentTime = new Date().getTime();
                            //insert in database
                    database.collection("posts").insertOne({
                            "user":{
                                    "_id":user._id,
                                    "name": user.name,
                                    "image":user.image,
                                 },
                                "description":description,
                                "createdAt":currentTime,
                                "likes":[],
                                "dislikes":[],
                                "comments": [],
                                "shares":[]      
                        },
                    function(error,data){
                        //insert in the users collection too the data
                        database.collection("users").updateOne({
                        "_id":ObjectId(req.session.user_id)
                            },{
                                  $push:{
                                      "posts":{
                                          "_id":data.insertedId,
                                          "description":description,
                                      }
                                  } 
                               });
                               res.redirect("/home");
                            });
                    });
        }else{
            res.redirect("/login")
        }
    });*/

    
        //routes again for chating two between the user and the groups 
    
    app.get("/users",function(req,res){
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("users").find({}).toArray((error,all)=>{
                    if(user.profile.length>0){           
                        res.render('Students',{
                            all:all,
                            users:user,
                            profile:user.profile[user.profile.length-1],
                            "isLogin": req.session.user_id ? true : false,
                        });
                    }else{
                        res.render('Students',{
                            all:all,
                            users:user,
                            profile:"/public/images/avatar.png",
                            "isLogin": req.session.user_id ? true : false,
                        });
                    }
                
                })
            });
         }else{
            res.redirect("/login");
        }
        
       
    });

    app.get("/Joinedclass",function(req,res){
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("users").find({}).toArray((error,all)=>{
                    if(user.profile.length>0){           
                        res.render('board',{
                            all:all,
                            users:user,
                            profile:user.profile[user.profile.length-1],
                            "isLogin": req.session.user_id ? true : false,
                        });
                    }else{
                        res.render('board',{
                            all:all,
                            users:user,
                            profile:"/public/images/avatar.png",
                            "isLogin": req.session.user_id ? true : false,
                        });
                    }
                
                })
            });
         }else{
            res.redirect("/login");
        }
        
       
    });

    app.get("/roomJoined/:id",async(req,res)=>{
        var files = await database.collection("classes").find({}).toArray();
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                files.forEach(element => {
                    if(element._id==req.params.id){
                        database.collection("users").find({}).toArray((error,all)=>{
                        if(user.profile.length){           
                            res.render('board',{
                                all:all,
                                room:element,
                                users:user,
                                profile:user.profile[user.profile.length-1],
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }else{
                            res.render('board',{
                                all:all,
                                room:element,
                                users:user,
                                profile:"/public/images/avatar.png",
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }
                        })
    
                       
                    }
                });
            });
         }else{
            res.redirect("/login");
        }
       
    });

    app.get("/watch/:id",async(req,res)=>{
        var files = await database.collection("videos").find({}).toArray();
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                files.forEach(element => {
                    if(element._id==req.params.id){
                        if(user.profile.length>0){           
                            res.render('video-watch',{
                                all:files,
                                video:element,
                                users:user,
                                profile:user.profile[user.profile.length-1],
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }else{
                            res.render('video-watch',{
                                all:files,
                                video:element,
                                users:user,
                                profile:"/public/images/avatar.png",
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }
                    }
                });
            });
         }else{
            res.redirect("/login");
        }
     
    });

    app.get("/groups",function(req,res){

        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("chats").find({}).toArray((error,chats)=>{
                    if(!chats || chats.length==0){
                        res.render('groupchat',{
                            chats:chats,
                            users:user,
                            profile:user.profile[user.profile.length-1],
                            "isLogin":req.session.user_id ? true :false,
                        });
                        } else {
        
                            if(user.profile.length){           
                                res.render('groupchat',{
                                    chats:chats,
                                    users:user,
                                    profile:user.profile[user.profile.length-1],
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }else{
                                res.render('groupchat',{
                                    chats:chats,
                                    users:user,
                                    profile:"/public/images/avatar.png",
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }
                        
                        } 
        
                        });

              
            });
         }else{
            res.redirect("/login");
        }

        });

    app.get("/all-comments/:postId",async(req,res)=>{
        var files = await database.collection("posts").find({}).toArray();
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                files.forEach(element => {
                    if(element._id==req.params.postId){
                        if(user.profile.length>0){           
                            res.render('comment-section',{
                                post:element,
                                users:user,
                                profile:user.profile[user.profile.length-1],
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }else{
                            res.render('comment-section',{
                                post:element,
                                users:user,
                                profile:"/public/images/avatar.png",
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }
                    }
                });
            });
         }else{
            res.redirect("/login");
        }
        
    })
   

    app.get("/chat-page/:id",async (req,res)=>{
        var files = await database.collection("chats").find({}).toArray();
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                files.forEach(element => {
                    if(element._id==req.params.id){
                        if(user.profile.length){           
                            res.render('chatpage',{
                                chats:element,
                                users:user,
                                profile:user.profile[user.profile.length-1],
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }else{
                            res.render('chatpage',{
                                chats:element,
                                users:user,
                                profile:"/public/images/avatar.png",
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }
                    }
                });
            });
         }else{
            res.redirect("/login");
        }
       
      
    });

    app.get("/chatuser/:id",async (req,res)=>{
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){

                user.friends.forEach(function(friend){
                    //console.log(friend);
                    if(friend._id==req.params.id){
                        
                        if(user.profile.length){           
                            res.render('user_chat',{
                                chats:friend,
                                users:user,
                                messages:"",
                                profile:user.profile[user.profile.length-1],
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }else{
                            res.render('user_chat',{
                                chats:friend,
                                users:user,
                                profile:"/public/images/avatar.png",
                                "isLogin": req.session.user_id ? true : false,
                            });
                        }
                    }
                })
                   
 
            });
         }else{
            res.redirect("/login");
        }
       
      
    });

    app.post("/create-room",function(req,res){
        //check if the user is logged in or not
        if (req.session.user_id){  
               var chatname = req.body.name;
                getUser(req.session.user_id,function(user){
                    //insert chats rooms in the database 
                    database.collection("chats").insertOne({
                                "createdBy":{
                                    "_id":user._id,
                                    "name": user.name,
                                    "image":user.profile.length? user.profile[0]:"/public/images/avatar.png"
                                        },
                                "room":chatname,
                                "createdAt":formatTimeAndDate(new Date()),
                                "membersList":[],
                                "is_User":false,
                                "messages":[],
                                "images":[],
                                "videos":[]   
                        },
                    function(error,chat){
                        //insert in the users collection too the chatroom
                        database.collection("users").updateOne({
                        "_id":ObjectId(req.session.user_id)
                            },{
                                  $push:{
                                      "Chats":{
                                          "_id":chat.insertedId,
                                          "description":chatname,
                                      }
                                  } 
                               });
                               res.send({
                                   "_id":chat.insertedId
                               });
                            });
                    });
        }else{
            res.redirect("/login")
        }
    });

    app.post("/add-friend",function(req,res){
        //check if the user is logged in or not
        if (req.session.user_id){  
               var chatname = req.body.name
                getUser(req.session.user_id,function(user){
                    //insert chats rooms in the database 
                    database.collection("users").findOneAndUpdate({
                        "_id":ObjectId(req.session.user_id)
                            },{
                                  $push:{
                                      "friends":{
                                          "_id":req.body.id,
                                          "name":chatname,
                                          "profile":[],
                                          "messages":[],
                                          "user_status":[],
                                          "createdAt": formatTimeAndDate(new Date()),
                                          "is_friend":true
                                      }
                                  },function(error,chat){
                                      //insert in the users collection too the chatroom
                                             res.send({
                                              "_id":chat.insertedId
                                              });      
                            }
                        })
                })

        }else{
            res.redirect("/login")
        }
    });

    app.get("/signup",function(req,res){
        res.render("logs/signup");
    });

    app.get("/classes",function(req,res){
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("classes").find({}).sort({"_id":-1}).toArray((error,classes)=>{
            
                    if(user.profile.length>0){  
                        res.render('classes',{
                            classes:classes,
                            users:user,
                            profile:user.profile[user.profile.length-1],
                            "isLogin": req.session.user_id ? true : false,
                        });
                    }else{
                        res.render('classes',{ 
                            classes:classes,
                            users:user,
                            profile:"/public/images/avatar.png",
                            "isLogin": req.session.user_id ? true : false,
                        });
                    }
                })
            });
         }else{
            res.redirect("/login");
        }



    });

    app.get("/home", function(req,res){
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("posts").find({}).sort({"_id":-1}).toArray((error,files)=>{
                    if(!files || files.length==0){
                        res.render('chat',{
                            files:false,
                            profile:"/public/images/avatar.png", 
                           "isLogin": req.session.user_id ? true : false,
                        });
                        } else {
                            if(user.profile.length>0){  
                                res.render('chat',{
                                    files:files,
                                    users:user,
                                    profile:user.profile[user.profile.length-1],
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }else{
                                res.render('chat',{
                                    files:files,
                                    users:user,
                                    profile:"/public/images/avatar.png",
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }    
                        } 
                        });
            });
         }else{
            res.redirect("/login");
        }

            });

    app.get("/library",(req,res)=>{
        if (req.session.user_id){
            getUser(req.session.user_id,function(user){
                database.collection("posts").find({}).sort({"_id":-1}).toArray((error,files)=>{
                    if(!files || files.length==0){
                        res.render('library',{
                            files:false,
                           "isLogin": req.session.user_id ? true : false,
                         
                        });
                        } else {
                            if(user.profile.length>0){           
                                res.render('library',{
                                    files:files,
                                    users:user,
                                    profile:user.profile[user.profile.length-1],
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }else{
                                res.render('library',{
                                    files:files,
                                    users:user,
                                    profile:"/public/images/avatar.png",
                                    "isLogin": req.session.user_id ? true : false,
                                });
                            }
                        } 
                    });
            });
         }else{
            res.redirect("/login");
        }

    });

   
    app.get("/login",function(req,res){
        res.render("logs/login",{
            "error":"",
            "message":""
        });
    });

    app.post("/login",function(req,res){
        //check if email exists
        database.collection("users").findOne({
            "email":req.body.email
        },function(error,user){
            if(user==null){
                res.send("Emails does not exist");
            }else{
                //compare hashed password
                bcyrpt.compare(req.body.password,user.password,function(error,isVerify){
                    if(isVerify){
                        //Save user ID in session
                        req.session.user_id=user._id;
                        //console.log(req.body.name)
                        var userdata = async ()=>{
                            return database.collection("users").findOne({"_id":req.session.user_id})   
                            }
                            userdata().then(data=>{
                                users=data;
                                res.redirect("/home");
                            });     
                    }else{
                        res.send("Password is not correct")
                    }
                });
            }
        }); 
    });

    app.get("/logout",function(req,res){
        req.session.destroy();
        res.redirect("logs/login");
    });

    app.post("/post-upload",function(req,res){
        //check if the user is logged in or not
        if (req.session.user_id){  
               var description = req.body.description
                getUser(req.session.user_id,function(user){
                    var currentTime = formatTimeAndDate(new Date());
                            //insert in database
                    database.collection("posts").insertOne({
                            "user":{
                                    "_id":user._id,
                                    "name": user.name,
                                    "image":req.body.user_img
                                 },
                                "description":description,
                                "createdAt":currentTime,
                                "imagePath":req.body.image,
                                "likes":[],
                                "dislikes":[],
                                "comments": [],
                                "shares":[]      
                        },
                    function(error,data){
                        //insert in the users collection too the data
                        database.collection("users").updateOne({
                        "_id":ObjectId(req.session.user_id)
                            },{
                                  $push:{
                                      "posts":{
                                          "_id":data.insertedId,
                                          "description":description,
                                      }
                                  } 
                               });
                               res.send({_id:data.insertedId});
                            });
                    });
        }else{
            res.redirect("/login")
        }
    });

    app.post("/videos-upload",function(req,res){
        //check if the user is logged in or not
        if (req.session.user_id){  
               var description = req.body.description
                getUser(req.session.user_id,function(user){
                    var currentTime = formatTimeAndDate(new Date());
                    
                            //insert in database
                    database.collection("videos").insertOne({
                            "user":{
                                    "_id":user._id,
                                    "name": user.name,
                                    "image":req.body.user_img
                                 },
                                "description":description,
                                "createdAt":currentTime,
                                "title":req.body.title,
                                "videoPath":req.body.video,
                                "downloads":[],
                                "views":0,
                                "watch":[],
                                "likes":[],
                                "subscribers":[],
                                "dislikes":[],
                                "comments": [],
                                "shares":[]      
                        },
                    function(error,data){
                        //insert in the users collection too the data
                        database.collection("users").updateOne({
                        "_id":ObjectId(req.session.user_id)
                            },{
                                  $push:{
                                      "videos":{
                                          "_id":data.insertedId,
                                          "description":description,
                                      }
                                  } 
                               });
                               res.send({"_id":data.insertedId});
                            });
                    });
        }else{
            res.redirect("/login")
        }
    });

    app.post("/do-upload-video",uploadVideo.single('video'),(req,res)=>{
        if(req.file){
            res.send("/"+req.file.path.replace(/\\/g,'/').replace(/\\/g,'/'));
        } 
    })

    app.post("/profile-photo",(req,res)=>{
        if(req.session.user_id){
            database.collection("users").updateOne({
                "_id":ObjectId(req.session.user_id)
                    },{
                          $push:{
                              "profile":{
                                  "image":req.body.image,
                                  "description":req.body.description,
                                  
                              },
                              "images":{
                                    "image":req.body.image,
                              }
                          }
                         
                       });
                    res.send({
                        "_id":req.session.user_id
                    })

        }else{
            res.redirect('/login')
        }
    })

    app.post("/do-upload-file",uploadImage.single('image'),(req,res)=>{
        if(req.file){
            res.send("/"+req.file.path.replace(/\\/g,'/').replace(/\\/g,'/'));
        } 
    })

    app.post("/do-caption",function(req,res){
        if(req.session.user_id){
           getUser(req.session.user_id,function(user){
            database.collection("chats").findOneAndUpdate({
                   "_id":ObjectId(req.body.chatid)
               },{
                   $push:{
                       "messages":{
                           "_id":ObjectId(),
                           "user":{
                               "_id":user._id,
                               "name":user.name,
                               "image":user.profile.length? user.profile[0]:"/public/images/avatar.png"
                           },
                           "message":req.body.caption,
                           "createdAt":formatTimeAndDate(new Date()),
                           "file":req.body.filesPath,      
                       }
                   }
               },function(error,chat){
                   res.send({
                       text:"message successfull",
                       _id:chat.insertedId
                   }) 
                   //send notification to post publisher
                   //var channelid = data.value.user._id;
                   /*database.collection("users").updateOne({
                       "_id":ObjectId(channelid)
                   },{
                       $push:{
                           "notifications":{
                               "_id":ObjectId(),
                               "type":"new_comment",
                               "content":req.body.comment,
                               "is_read":false,
                               "user":{
                                   "_id":user._id,
                                   "name":user.name,
                                   "image":user.image
                               }
                           }
                       }
                   })*/
               });
           });
        }else{
            res.json({
                "status":"error redirection",
                "message":"Please login"
            });
        }
    });

    app.post("/do-caption-user",function(req,res){
        if(req.session.user_id){
           getUser(req.session.user_id,function(user){
            database.collection("users").findOneAndUpdate({
                    "_id":ObjectId(user._id),
                    "friends._id":req.body.chatid
               },{
                   $push:{
                       "friends.$.messages":{
                           "_id":ObjectId(),
                           "user":{
                               "_id":user._id,
                               "name":user.name,
                               "image":user.profile.length? user.profile[0]:"/public/images/avatar.png"
                           },
                           "message":req.body.caption,
                           "createdAt": formatTimeAndDate(new Date()),
                           "file":req.body.filesPath,      
                       }
                   }
               },function(error,chat){
                   res.send({
                       text:"message successfull",
                       _id:chat.insertedId
                   }) 
                   //send notification to post publisher
                   //var channelid = data.value.user._id;
                   /*database.collection("users").updateOne({
                       "_id":ObjectId(channelid)
                   },{
                       $push:{
                           "notifications":{
                               "_id":ObjectId(),
                               "type":"new_comment",
                               "content":req.body.comment,
                               "is_read":false,
                               "user":{
                                   "_id":user._id,
                                   "name":user.name,
                                   "image":user.image
                               }
                           }
                       }
                   })*/
               });
           });
        }else{
            res.json({
                "status":"error redirection",
                "message":"Please login"
            });
        }
    });


    app.post("/do-user-message",function(req,res){
        if(req.session.user_id){
            var message_id = ObjectId();
           getUser(req.session.user_id,function(user){
            database.collection("users").findOneAndUpdate({
                   "_id":ObjectId(user._id),
                   "friends._id":req.body.chatid
               },{
                   $push:{
                       "friends.$.messages":{
                           "_id":message_id,
                           "user":{
                               "_id":user._id,
                               "name":user.name,
                               "image":user.profile.length? user.profile[0]:"/public/images/avatar.png"
                           },
                           "message":req.body.message,
                           "createdAt": formatTimeAndDate(new Date()),
                           "file":"",

                           "videos":[]      
                       }
                   }
                  
               },function(error,chat){
            
                   res.send({
                       text:"message successfull",
                       _id:chat.insertedId
                   }) 
                   //send notification to post publisher
                   //var channelid = data.value.user._id;
                   /*database.collection("users").updateOne({
                       "_id":ObjectId(channelid)
                   },{
                       $push:{
                           "notifications":{
                               "_id":ObjectId(),
                               "type":"new_comment",
                               "content":req.body.comment,
                               "is_read":false,
                               "user":{
                                   "_id":user._id,
                                   "name":user.name,
                                   "image":user.image
                               }
                           }
                       }
                   })*/
               });
           });
        }else{
            res.json({
                "status":"error redirection",
                "message":"Please login"
            });
        }
    });

    app.post("/do-message",function(req,res){
        if(req.session.user_id){
            var message_id = ObjectId();
           getUser(req.session.user_id,function(user){
            database.collection("chats").findOneAndUpdate({
                   "_id":ObjectId(req.body.chatid),
               },{
                   $push:{
                       "messages":{
                           "_id":message_id,
                           "user":{
                               "_id":user._id,
                               "name":user.name,
                               "image":user.profile.length? user.profile[0]:"/public/images/avatar.png"
                           },
                           "message":req.body.message,
                           "createdAt": formatTimeAndDate(new Date()),
                           "file":"",
                           "videos":[]      
                       }
                   }
                  
               },function(error,chat){
            
                   res.send({
                       text:"message successfull",
                       _id:chat.insertedId
                   }) 
                   //send notification to post publisher
                   //var channelid = data.value.user._id;
                   /*database.collection("users").updateOne({
                       "_id":ObjectId(channelid)
                   },{
                       $push:{
                           "notifications":{
                               "_id":ObjectId(),
                               "type":"new_comment",
                               "content":req.body.comment,
                               "is_read":false,
                               "user":{
                                   "_id":user._id,
                                   "name":user.name,
                                   "image":user.image
                               }
                           }
                       }
                   })*/
               });
           });
        }else{
            res.json({
                "status":"error redirection",
                "message":"Please login"
            });
        }
    });


    app.post("/do-comment",function(req,res){
        if(req.session.user_id){
           getUser(req.session.user_id,function(user){
            database.collection("posts").findOneAndUpdate({
                   "_id":ObjectId(req.body.post_id)
               },{
                   $push:{
                       "comments":{
                           "_id":ObjectId(),
                           "user":{
                               "_id":user._id,
                               "name":user.name,
                               "image":req.body.user_img?req.body.user_img:"/public/images/avatar.png"
                           },
                           "comment":req.body.comment,
                           "email":req.body.email,
                           "createdAt": formatTimeAndDate(new Date()),
                           "replies":[]
                       }
                   }
               },function(error,post){
                   res.send({
                       text:"comment successfull",
                       _id:post.insertedId
                   }) 
                   //send notification to post publisher
                   //var channelid = data.value.user._id;
                   /*database.collection("users").updateOne({
                       "_id":ObjectId(channelid)
                   },{
                       $push:{
                           "notifications":{
                               "_id":ObjectId(),
                               "type":"new_comment",
                               "content":req.body.comment,
                               "is_read":false,
                               "user":{
                                   "_id":user._id,
                                   "name":user.name,
                                   "image":user.image
                               }
                           }
                       }
                   })*/
               });
           });
        }else{
            res.json({
                "status":"error redirection",
                "message":"Please login"
            });
        }
    });

    io.on("connection",function(socket){
        socket.on("new_post",async (formData)=>{
            var files = await database.collection("posts").find({}).toArray();
            files.forEach(element => {
                if(element._id==formData._id){

                    io.emit("post",element);
                    }
                });
            });

        socket.on("new_video",async (formData)=>{
                var files = await database.collection("videos").find({}).toArray();
                files.forEach(element => {
                    if(element._id==formData._id){
                        socket.emit("new_video",element);
                        }
                    });
                });
        
        socket.on("join class",(roomId,userId)=>{
            socket.join(roomId);
            io.to(roomId).emit("user-connected",userId);
            socket.on('disconnect-video',()=>{
                socket.to(roomId).broadcast.emit("disconnection",userId)
            })
        })

        socket.on("user_profile",async (formData)=>{
            var files = await database.collection("users").find({}).toArray();
            files.forEach(element => {
                if(element._id==formData._id){    
                    var path = element.profile[users.profile.length-1];
                    socket.broadcast.emit("user_profile",path);
                }
            });
        });

        socket.on("chatroom",async (id)=>{
            var chats = await database.collection("chats").find({}).toArray();
            chats.forEach(element => {
                if(element._id==id){
                    socket.emit("open_chat",element);
                    
                }
            });
        });


            socket.on("joining", (comment) => {
            //console.log(comment.post_id);
            socket.join(comment.post_id);
            socket.activeRoom = comment.post_id;
            io.to(socket.activeRoom).emit("new_comment",comment);
           
            });

            socket.on("userJoin", (id) => {
                socket.join(id);
                socket.roomId = id;
                //console.log(socket.roomId);
               //io.to(socket.id).emit("new_msg",chat); 
                });
            socket.on("new_group",async (group)=>{
                var chats = await database.collection("chats").find({}).toArray();
                chats.forEach(element => {
                    if(element._id==group._id){
                       
                        io.emit("new_group",element);
                        
                    }
                });
            
           
                
            })
           
            socket.on("chat_message", (chat) => {
                io.to(socket.roomId).emit("new_msg",chat);
                });

            socket.on('typing',(username)=>{
                io.to(socket.roomId).emit('typing',username);
            });

            socket.on('clicked',(data)=>{
                io.to(socket.roomId).emit('clicked',data);
            });

           
            /*
            socket.on("new_chat", (chat) => {
              io.to(socket.activeroom).emit("new_chat", chat);
                });*/

           /*    
            socket.on("new_msg",function(msg){
            //io.emit("new_comment",comment);
              io.to(socket.activeroom).emit("new_msg",msg);
            });
            */
        socket.on("new_reply",function(reply){
            io.emit("new_reply",reply);
        });




        socket.on('username',(username)=>{
            socket.username = username;
            //console.log(socket.username);
        });
     
        for(let message of messages)
            socket.emit('oldmessages',results={user:socket.username, message:message})
     
        socket.emit('oldimage',bas64image)
     
        socket.on('base64codeimage',(base64)=>{
            bas64image = base64;
            
            io.sockets.emit('base64codeimage',bas64image)
        });
     
        socket.emit('base64codeimage',bas64image);
     
        socket.on('message', (message) =>{
            messages.push(message);
            io.sockets.emit('message', result={user:socket.username, message:message} )
        });

        socket.on("join server",(username)=>{
            const user = {
                username,
                id:socket.id,
            };
            allusers.push(user);
            io.emit("new user", allusers);
        });

       socket.on("join room",(roomName,cb)=>{
            socket.join(roomName);
            cb(allmessages[roomName]);
            socket.emit("joined",allmessages[roomName]);
        })

        socket.on("send message",({content,to, sender, chatName,isChannel})=>{
            if(isChannel){
                const payload = {
                    content,
                    chatName,
                    sender,
                };
                socket.to(to).emit("new message",payload);
               } else {
                const payload = {
                    content,
                    chatName:sender,
                    sender
                };
                socket.to(to).emit("new message",payload);  
            };
            if(allmessages[chatName]){
                allmessages[chatName].push({
                    sender,
                    content
                });
            };
        });

        socket.on("disconnect",()=>{
            allusers = allusers.filter(u=>u.id !== socket.id);
            io.emit("out user",allusers)
        });

        });

    app.post("/do-reply",function(req,res){
        if(req.session.user_id){
            var reply_id = ObjectId();
            var commentId = req.body.comment_id;
            getUser(req.session.user_id,function(user){
                database.collection("posts").findOneAndUpdate({
                    "_id":ObjectId(req.body.post_id),
                    "comments._id": ObjectId(commentId)
                },{
                    $push:{
                        "comments.$.replies":{
                            "_id":reply_id,
                            "user":{
                                "_id":user._id,
                                "name":user.name,
                                "image":req.body.user_img?req.body.user_img:"/public/images/avatar.png"
                            },
                            "reply": req.body.reply,
                            "createdAt":formatTimeAndDate(new Date())
                        }
                    }
                },function(error1,data){

                  /*  for(var a=0; a<data.value.comments.length;a++){
                        var comment = data.value.comments[a];

                        if(comment._id==commentId){
                            var _id = comment.user_id;

                            database.collection("users").updateOne({
                                "_id":ObjectId(_id)
                            },{
                                $push:{
                                    "notifications":{
                                        "_id":ObjectId(),
                                        "type":"new_reply",
                                        "content":req.body.reply,
                                        "user":{
                                            "_id":user._id,
                                            "name":user.name,
                                            "image":user.image
                                        }
                                    }
                                }
                            });
                            break;
                        }
                    }*/

                    res.json({
                       _id:commentId,
                       "message":"Reply has been posted",
                       "user":{
                           "_id":user._id,
                           "name":user.name,
                           "image":user.profile[0]
                       }
                    });
                });
            });
        } else{
            res.json({
                "status":"error",
                "message":"Please login to perform this action"
            });
        }
    });

    app.post("/read-notification",function(req,res){
        if(req.session.user_id){
            database.collection("users").updateOne({
                $and:[{
                    "_id":ObjectId(req.session.user_id)
                },{
                    "notifications._id":ObjectId(req.body.notificationId)
                }]
            },{
                $set:{
                    "notification.$.is_read":true
                }
            },function(error1,data){
                res.json({
                    "status":"success",
                    "message":"Notification has been marked read"
                })
            })
        }else{
            res.json({
                "status":"error",
                "message":"please login to perform this action"
            })
        }
    })

    app.get("/get_user",function(req,res){
        if(req.session.user_id){
            getUser(req.session.user_id,function(user){
                delete user.password;
                res.json({
                    "status":"success",
                    "message":"Record has been fetched",
                    "user":user
                })
            })
        }else{
            res.json({
                "status":"error",
                "message":"Please login to perform this action"
            });
        }
    });

    app.post("/do-like",function(req,res){
        if(req.session.user_id){
            //check if already liked
            database.collection("posts").findOne({
                "_id":ObjectId(req.body.postid),
                "likes._id": req.session.user_id
            }, function(error,post){
                if(post==null){
                    //
                    database.collection("posts").updateOne({
                        "_id":ObjectId(req.body.postid)
                    },{
                        $push:{
                            "likes":{
                                "_id": req.session.user_id
                            }
                        }
                    },function(error,data){
                        res.json({
                            "status":"success",
                            "message":"Post has been liked"
                        });
                    });
                }else{
                    res.json({
                        "status":"error",
                        "message":"Already liked this post"
                    });
                }
            });
        }else{
            res.json({
                "status":"error",
                "message":"Please Login"
            });
        }
    });

    

    //Dislikes posts

    app.post("/do-dislike",function(req,res){
        if(req.session.user_id){
            //check if already liked
            database.collection("posts").findOne({
                "_id":ObjectId(req.body.postid),
                "dislikes._id": req.session.user_id
            }, function(error,post){
                if(post==null){
                    // Push in the dislikes array
                    database.collection("posts").updateOne({
                        "_id":ObjectId(req.body.postid)
                    },{
                        $push:{
                            "dislikes":{
                                "_id": req.session.user_id
                            }
                        }
                    },function(error,data){
                        res.json({
                            "status":"success",
                            "message":"Post has been disliked"
                        });
                    });
                }else{
                    res.json({
                        "status":"error",
                        "message":"Already disliked this post"
                    });
                }
            });
        }else{
            res.json({
                "status":"error",
                "message":"Please Login"
            });
        }
    });

    app.post("/signup",function(req,res){
        name = req.body.name;
        email = req.body.email 
        database.collection("users").findOne({
            "email":req.body.email},
            function(error,user){
                if(user==null){
                   // not exists
                   //convert password to hash value
                   bcyrpt.hash(req.body.password,10,function(error,hash){
                        database.collection("users").insertOne({
                            "name":req.body.name,
                            "email":req.body.email,
                            "password":hash,
                            "gender":"",
                            "Groups":[],
                            "broadcasts":{
                                "_id":ObjectId(),
                                "friends":[]
                            },
                            "education":{
                                "schoolLastAttended":"",
                                "categories":"",
                                "ProgramsOfInterests":""
                            },
                            "profile":[],
                            "images":[],
                            "Books":[],
                            "friends":[],
                            "subscribers":0,
                            "subscriptions":[],//Channels Subcribed
                            "playlists":[],
                            "videos":[],
                            "history":[],
                            "notifications":[]
                        },function(error,data){
                            res.redirect("/home");
                        });
                   });
                }else{
                    //exists
                    res.send("Email already exists");
                }
            });

        });

        app.post("/signuped",function(req,res){
            name = req.body.name;
            email = req.body.email 
            database.collection("users").findOne({
                "email":req.body.email},
                function(error,user){
                    if(user==null){
                       //convert password to hash value
                       bcyrpt.hash(req.body.password,10,function(error,hash){
                            database.collection("users").insertOne({
                                "name":req.body.name,
                                "email":req.body.email,
                                "password":hash,
                                "gender":"",
                                "profile":[],
                                "images":[],
                                "Books":[],
                                "broadcasts":{
                                    "_id":ObjectId(),
                                    "friends":[]
                                },
                                "education":{
                                    "schoolLastAttended":"",
                                    "categories":"",
                                    "ProgramsOfInterests":""
                                },
                                "IsSupervisor":"",
                                "Students":{
                                    "_id":ObjectId(),
                                    "all":[],
                                },
                                "friends":[],
                                "classes":[],
                                "subscribers":0,
                                "subscriptions":[],//Channels Subcribed
                                "playlists":[],
                                "videos":[],
                                "history":[],
                                "notifications":[]
                            },function(error,data){
                                res.redirect("/home");
                            });
                       });
                    }else{
                        //exists
                        res.send("Email already exists");
                    }
                });
    
            });
    });

});


