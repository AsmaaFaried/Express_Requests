var express=require('express');
var app=express();
var fs=require('fs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var InsertedData={};
console.log("Server is running...");
//////////// Get Request   ////////////

var pages=['/login','/signup','/profile','/','/home'];

////// Handle Css files with middleware //////
app.use('/assets',express.static('./public')); // take directory of css files
///// use view ejs to write js code in html tag /////
app.set('view engine','ejs');
app.use('/',function(req,res,next){
    console.log("Request url: "+req.url);
    console.log("Request Method: "+req.method);

    if(!pages.includes(req.url)){
        res.status(404);
        res.send("Page not found");
    }
    next();
});
app.get('/',function(req,res){
    res.render('home');

});
app.get('/home',function(req,res){
    res.render('home',{username:req.body.username});

});
app.get('/login',function(req,res){
    res.render('login');

});
app.get('/signup',function(req,res){
    res.render('signup');

});
app.get('/profile',function(req,res){
    res.render('profile');
});


///////////////////////////////////////////////

////// Post request //////////////

// handle signup request
app.post('/signup',function(req,res){
    InsertedData=req.body;
    fs.readFile('data.json',function(err,fileData){
        var jsonOfFile = JSON.parse(fileData);
        console.log("File date: ")
        console.log(fileData);
        var InsertedEmail =req.body.email;
        const validEmail = hasValueDeep(jsonOfFile,InsertedEmail);
        if(validEmail)
        {
            res.status(400);
            res.send("Email already exists");
        }else{
            res.status(200);
            console.log("Inserted Data: ");
            console.log(InsertedData);
            jsonOfFile.push(req.body);
            res.send("Data inserted successfuly");
        }
        fs.writeFile('data.json', JSON.stringify(jsonOfFile),(err)=>{})
    });
    InsertedData=""; 
});
//// handle login request
app.post('/login',function(req,res){
    var IsValideEmail=false;
    var IsValidePassword=false;
    fs.readFile('data.json',function(err,fileData){
        var jsonOfFile = JSON.parse(fileData);
        var InsertedEmail =req.body.email;
        var InsertedPassword =req.body.password;
        IsValideEmail=hasValueDeep(jsonOfFile,InsertedEmail);
        IsValidePassword=hasValueDeep(jsonOfFile,InsertedPassword);
        if(IsValideEmail && IsValidePassword){
            InsertedData=req.body;
            res.status(200);
            res.render('profile',{username:InsertedData.email});
            console.log("User data is correct");
        }
        if(!IsValidePassword){
            res.status(400);
            res.send("You entered wrong password");
        }
        if(!IsValideEmail){
            res.status(400);
            res.send("You entered wrong email");
        }
    }); 
   
});

app.post('/home',function(req,res){

    console.log("Home page");
    res.render('home',{username:req.body.username});
});

app.post('/profile',function(req,res){
    res.render('profile',{username:req.body.username});
});

app.listen(3000); /// port


/// Search in json file ////////
function hasValueDeep(json, findValue) {
    const values = Object.values(json);
    let hasValue = values.includes(findValue);
    values.forEach(function(value) {
        if (typeof value === "object") {
            hasValue = hasValue || hasValueDeep(value, findValue);
        }
    })
    return hasValue;
  }