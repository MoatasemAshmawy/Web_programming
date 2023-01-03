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
        pool.query('SELECT * FROM users WHERE id= ?', [id], (error, user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user);
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
                return resolve({userId : userId, cartId : res.insertId});
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



module.exports = db;