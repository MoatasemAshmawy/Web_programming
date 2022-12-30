const express= require('express');
require("dotenv").config();
const path = require('path');
const session = require('express-session');
const app=express();
const mysql = require("mysql");
const { dirname } = require('path');
const mysqlStore = require('express-mysql-session')(session);
const PORT= process.env.APP_PORT;
const IN_PROD = process.env.NODE_ENV === 'production';
const ONE_DAY = 1000 * 60 * 60 * 24;
const options ={
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
    
};

const db_pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    port: process.env.DB_PORT
});

const  sessionStore = new mysqlStore(options);


app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: ONE_DAY,
        sameSite: true,
        secure: IN_PROD
    }
}));


db_pool.query(`
CREATE TABLE IF NOT EXISTS Users  (
    User_Id int AUTO_INCREMENT NOT NULL,
    FirstName varchar(255),
    LastName varchar(255),
    Address varchar(255),
    Email varchar(255),
    User_Pass varchar(255),
    PRIMARY KEY (User_Id)
);`, (err, result)=>{
    if(err){

        console.log(err);
    }
    console.log(result);

})

//I can pass an array of paths
app.get(['/','/home'], (req,res) =>{
    req.session.userId = 114;
    console.log(req.session);
    res.sendFile('/public/index.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
   
})

// app.post('/auth/user', (req,res) =>{


// })


app.listen(PORT, ()=>{console.log(`server is listening on ${PORT}`)});