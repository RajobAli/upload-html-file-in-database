const express = require("express");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const app = express();


app.use(express.urlencoded({extended:true}));

app.use(express.json());

const port = 5000;

// connecting to DB

const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/usersTestDB");
        console.log("db is connected");

    }catch(error){
        console.log("db is not connected");
        console.log(error);
        process.exit(1);

    }
};

// creating schema and model

const userSchema = new mongoose.Schema({
name : {
    type: String,
    required : [true, "user name is required"]
},
image : {
    type: String,
    required : [true, "user image required"]
},
    


    
});

// model 

const User = mongoose.model("Users",userSchema);

// file uploaded

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploadedd");
    },

    filename:function(req,file,cb){
        const name = Date.now()+ '-' + file.originalname;
        cb(null,name);
    },
});
const uploade = multer({storage:storage})


app.get("/test",(req,res)=>{
    res.status(200).send("testing api");
});

app.get("/register",(req,res)=>{
    res.status(200).sendFile(__dirname + "/index.html");
});

app.post("/register",uploade.single("image"), async (req,res)=>{
    try{
        const newUser = new User({
            name : req.body.name,
            image: req.file.filename,
        });
        await newUser.save();
        res.status(201).send(newUser)


    }catch(error){
        res.status(500).send(error.message);

    }


    res.status(200).send("file is uploaded");
});

app.listen(port,async()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();
});