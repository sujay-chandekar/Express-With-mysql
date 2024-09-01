const express = require("express");
const app = express();
const path = require("path");
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const methodOverride = require("method-override");

app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

let port = 8080;
app.listen(port,(req,res)=>{
    console.log(`App listening on port ${port}`);
});
//connection of mysql 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Sujay@10',
  });
//home route
app.get("/",(req,res)=>{
   let q = "SELECT COUNT(*) FROM User";
   try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let total = result[0]["COUNT(*)"];
        res.render("home.ejs",{total});
    });
   }catch(err){
        console.log("some err DB");
   }
});

//users
app.get("/users",(req,res)=>{
    let q = `SELECT * FROM User`;
    try{
     connection.query(q,(err,result)=>{
         if(err) throw err;
         let data = [];
         data = result;
         res.render("users.ejs",{data});
     });
    }catch(err){
         console.log("some err DB");
    }   
});

//Edituser
app.get("/users/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM User WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edituser.ejs",{user});
        });
       }catch(err){
            res.send("some err DB");
       }
});

//Update DB

app.patch("/users/:id",(req,res)=>{
    let {id} = req.params;
    console.log(req.body);
    let {pass:frompass,username:newUser} = req.body;
    let q = `SELECT * FROM User WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(frompass != user.password){
                res.send("Worng Password.");
            }else{
                let q2 = `UPDATE User SET username='${newUser}' WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    res.redirect("/users");
                });
               }
        });
    }
    catch(err){
            res.send("some err DB");
       }
});

app.patch("/users/:id/delete",(req,res)=>{
    let {id} = req.params;
    console.log(id);
    let q = `SELECT * FROM User WHERE id='${id}'`;
    let {mail:frommail,pass:newpass} = req.body;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(frommail == user.email && newpass == user.password){
                let q2 = `DELETE FROM User WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    res.redirect("/users");
                });
            }else{
                res.send("Wrong Email or password");
               }
        });
    }
    catch(err){
            res.send("some err DB");
       }
});
//delete

app.get("/users/:id/delete",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM User WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
            let user = result[0].id;
            res.render("deleteUser.ejs",{user});
        });
       }catch(err){
            res.send("some err DB");
       }
});

//new user
app.get("/user/new",(req,res)=>{
    res.render("newUser.ejs");
});
//new user create in DB

app.post("/users/createAc",(req,res)=>{
    let {mail:email,pass:password,user:username} = req.body;
    console.log(req.body);
    let id = faker.string.uuid();
    let q = `INSERT INTO User (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(`User created successfully remember your id ${id}`);
        });
    } catch (err) {
        res.send("some error with DB");
    }
});

//Generating random data
// let randomData = ()=> {
//     return [
//       faker.string.uuid(),
//       faker.internet.userName(),
//       faker.internet.email(),
//       faker.internet.password(),
//     ];
//   }
//   console.log(randomData());
// let data = [];
// for(let i = 1;i <= 100 ; i++){
//     data.push(randomData());
// }
// console.log(data);
// let q = `INSERT INTO User VALUES ?`;
// try{
// connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// });
// } catch(err){
//     console.log(err);
// }