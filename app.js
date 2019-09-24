var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./model/user");
mongoose.connect("mongodb://localhost:27017/auth",{useNewUrlParser:true});

var app = express();

app.use(require("express-session")({
	secret:"sidisbest",
	resave:false,
	saveUninitialized:false
}));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===============
// Routes
//===============
				//register
			//============
app.get("/register",function (req,res) {
	res.render('register');
});

app.post("/register",function (req,res) {
	
	User.register(new User({username:req.body.username}),req.body.password,function (err,user) {
		if (err) {
			console.log(err);
		}else{
			passport.authenticate("local")(req,res,function (argument) {
				res.redirect("/secret");
			});
		}
	});
});

//login
//middleware
app.get("/login",function (req,res) {
	res.render('login');
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"

})
,function (req,res) {
	
});

app.get("/",function (req,res) {
	res.render('home');
	
});

app.get("/secret",isLoggedIn,function (req,res) {
	res.render('secret');
});

//logout

app.get("/logout",function (req,res) {
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next) {
	 if (req.isAuthenticated()) {
	 	return next();
	 }
	 res.redirect("/login")
}

app.listen("3000",function () {
	console.log("server is started...");
});