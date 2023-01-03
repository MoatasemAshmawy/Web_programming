const express= require('express');
require("dotenv").config();
const db = require('./db');
const path = require('path');
const session = require('express-session');
const app=express();
const { dirname } = require('path');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/assets/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({storage:storage});
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



const  sessionStore = new mysqlStore(options);


app.use(['/node_modules','/auth/node_modules'], express.static(__dirname + '/node_modules'));
app.use(['/css','/auth/css'], express.static(__dirname + '/public/css'));
app.use(['/scripts','/auth/scripts'], express.static(__dirname + '/public/scripts'));
app.use(['/assets','/auth/assets'], express.static(__dirname + '/public/assets'));
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




//I can pass an array of paths
app.get(['/','/home'], (req,res) =>{
    res.sendFile('/public/index.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
   
})

app.get('/products', (req,res) =>{
    res.sendFile('/public/products.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
   
})

app.get('/adminlogin',(req,res)=>{
    if(req.session.adminId){
        res.redirect('/adminpage');
    }
    else{
    res.sendFile('/public/adminlogin.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
    }
})

app.get('/adminpage',(req,res)=>{
    if(req.session.adminId){
    res.sendFile('/public/adminpage.html',{root : __dirname} ,(err) =>{
        console.log(err);
    });
    } else {
        res.redirect('/adminlogin');
    }


})

app.post('/logoutadmin',(req,res)=>{
    req.session.destroy();
    res.redirect('/adminlogin');
})

app.post('/auth/admin',(req,res)=>{
    
    const password =req.body.password;
    const user = req.body.username;

    if(password === process.env.ADMIN_PASS && user === process.env.ADMIN_USER){
        req.session.adminId = 1;
        res.json({login:true});
    }else{
        
        res.json({login:false});
        
    }
})

app.post('/addproduct',upload.single('product_image'),(req,res)=>{
    const {product_name,product_price,product_quantity,product_desc} = req.body;
    const image = req.file;
    db.addProduct(1,product_name,product_price,product_desc,image.filename,product_quantity)
    .then((result)=> console.log("Succesfully added product"));
})

app.get('/getproducts',async (req,res)=>{
    let result = await db.getProducts();
    res.json(result);
})

app.listen(PORT, ()=>{console.log(`server is listening on ${PORT}`)});