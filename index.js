import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"sectrets",
  password:"123456",
  port:5432,
});

const app = express();
const port = 3000;

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  var email=req.body["username"];
  var password=req.body["password"];
  var checkresult =await db.query("SELECT * from users where email= ($1)",[email]);
  if(checkresult.rows.length>0)
  {
    res.send("Email already exists");
  }else
  {
    await db.query("INSERT into users (email,password) VALUES ($1,$2)",[email,password]);
    res.render("secrets.ejs");
  }
  
});

app.post("/login", async (req, res) => {
  var email=req.body["username"];
  var password=req.body["password"];  
  try{
    var result=db.query("Select username,password FROM users WHERE username=($1)",[email]);
    if(result.rows[0].password===password)
    {
      res.render("secrets.ejs");
    }
    else
    {
      res.render("Wrong Password")
    }
  }catch(err)
  {
    res.send("username does not exist");
  }  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
