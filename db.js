const mysql = require("mysql");
const bcrypt = require('bcryptjs');
require("dotenv").config();


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    port: process.env.DB_PORT
});

let db = {};

db.getUser = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM users WHERE User_Id = ?', [id], (error, user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user[0]);
        });
    });
};


db.getUserByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM users WHERE Email = ?', [email], (error, result)=>{
            if(error){
                return reject(error);
            }
            let user = result[0];
            if(!user){
                return resolve(user);
            }
            pool.query('Select Cart_Id FROM cart WHERE User_Id = ?',[user.User_Id],(err,res)=>{
                if(err){
                    return reject(err); 
                }
                return resolve({Cart_Id : res[0].Cart_Id, ...user });
              });
        });
    });
};


db.insertUser = async (firstName, lastName, email, password) =>{
    let hashedPassword = await bcrypt.hash(password,10);
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO users (FirstName, LastName, Email, User_Pass) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hashedPassword], (error, result)=>{
            if(error){
                return reject(error);
            }
              let userId = result.insertId;
              pool.query('INSERT INTO cart (User_Id) VALUES (?)',[userId],(err,res)=>{
                if(err){
                    return reject(err); 
                }
                return resolve({User_Id : userId, Cart_Id : res.insertId});
              });
        });
    });
};

// db.insertUser('Moatasem','Ashmawy','thedashash9@gmail.com','Hello123').then((user)=>console.log(user)).catch((err)=> console.log(err));
// bcrypt.compare('Hello123','$2a$10$dpj6xOw6DXjtwO9sbts71e.xsfYV24hUiGApU6RQ1PQjr1w0u/DFO').then((result)=> console.log(result));

db.updateUserInfo = (userId ,firstName, lastName, email, address)=>{
    return new Promise((resolve,reject)=>{
        pool.query(`UPDATE users
        SET FirstName = ?, LastName = ?, Address = ?, Email = ?
        WHERE User_Id = ?`,[firstName,lastName,address,email,userId],(error,result)=>{
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
};

db.changeUserPassword = async (userId, password)=>{
    let hashedPassword = await bcrypt.hash(password,10);
    return new Promise((resolve,reject)=>{
        pool.query(`UPDATE users
        SET User_Pass = ?
        WHERE User_Id = ?`,[hashedPassword,userId],(error,result)=>{
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
  
};

db.getProducts = ()=>{
    return new Promise((resolve,reject)=>{
        pool.query(`SELECT * FROM product`,(error,result)=>{
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
};

db.addProduct = (category_id,p_name,p_price,p_desc,p_img,p_quantity)=>{
    return new Promise((resolve,reject)=>{
        pool.query(`INSERT INTO product (Category_Id, Product_Name, Product_Price, Product_Desc, Product_Img, Quantity)
        VALUES (?,?,?,?,?,?)`,[category_id,p_name,p_price,p_desc,p_img,p_quantity],(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.deleteProduct = (p_id)=>{
    return new Promise((resolve,reject)=>{
        pool.query(`DELETE FROM product WHERE Product_Id =?`,[p_id],(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports = db;