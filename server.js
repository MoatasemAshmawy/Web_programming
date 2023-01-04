const express= require('express');
require("dotenv").config();
const db = require('./db');
const bcrypt = require('bcryptjs');
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

app.get('/login', (req,res) =>{
    res.sendFile('/public/login.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
   
})

app.get('/register', (req,res) =>{
    res.sendFile('/public/register.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
   
})

app.get('/cart', (req,res) =>{
    res.sendFile('/public/shopping_cart.html',{root : __dirname} ,(err) =>{
        console.log(err);
    })
   
})

app.get('/myaccount', (req,res) =>{
    if(req.session.userId){
        res.sendFile('/public/account.html',{root : __dirname} ,(err) =>{
            console.log(err);
        })
    }else{
        res.redirect('/login');
    }
})

app.get('/about', (req,res) =>{
    res.sendFile('/public/about.html',{root : __dirname} ,(err) =>{
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

app.post('/logoutuser',(req,res)=>{
    req.session.destroy();
    res.redirect('/home');
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

app.post('/auth/user', async (req,res)=>{
    
    const password =req.body.password;
    const email = req.body.email;
    let user = await db.getUserByEmail(email); 
    
    if(user){
        let hashedPassword = user.User_Pass;
        let isMatch = await bcrypt.compare(password,hashedPassword);
        if(isMatch){
            req.session.userId = user.User_Id;
            req.session.cartId = user.Cart_Id;
            res.json({login:true})
        }
        else{
            res.json({login:false});
        }
    }
    else{
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


app.post('/registeruser', async (req,res)=>{

    const {email,password,f_name,l_name} = req.body;
    
    let user = await db.getUserByEmail(email);
    
    if(user){
        res.json({register:false})
    }else{
        let registered = await db.insertUser(f_name,l_name,email,password);
        req.session.userId = registered.User_Id;
        req.session.cartId = registered.Cart_Id;
        res.json({register:true});
    }
})


app.post('/updateinfo', async (req,res)=>{

    const {address,f_name,l_name} = req.body;
    
    let user = await db.getUser(req.session.userId);
    
    if(!user){
        res.json({register:false});
    }else{
        let registered = await db.updateUserInfo(req.session.userId,f_name,l_name,user.Email,address);
        res.json({register:true});
    }
})


app.post('/addtocart', async (req,res)=>{
    const product_id = req.body.product_id;
    const cartId = req.session.cartId;
    let result = await db.addToCart(cartId,product_id);
    res.json(result);
})

app.post('/deletefromcart', async (req,res)=>{
    const product_id = req.body.product_id;
    const cartId = req.session.cartId;
    let result = await db.deleteCartItem(cartId,product_id);
    res.json(result);
})


app.get('/getcartproducts',async (req,res)=>{
    if(!req.session.cartId){
        res.json({login:false});
        return;
    }
    const cartId = req.session.cartId;
    let result = await db.getCartProducts(cartId);
    res.json({result,login:true});
})

app.listen(PORT, ()=>{console.log(`server is listening on ${PORT}`)});