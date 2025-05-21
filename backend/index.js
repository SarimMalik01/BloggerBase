const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer=require('multer')
const fs=require("fs")
const path=require("path")
const redis = require('./RedisClient');


const uploadMiddleware=multer({dest:'uploads/'});
const User = require("./models/userModels");
const Post=require("./models/post");
const app = express();
const PORT = 3000;

const JWT_SECRET = "87365Abcd";

app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname+'/uploads')));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb+srv://devsarimmalik:PGQoAuU9DkFXKMlV@cluster0.yfwadem.mongodb.net/blogsApp?retryWrites=true&w=majority&appName=Cluster0');

app.get("/", (req, res) => {
  res.send("Hello, World!");
});


app.get("/user", async (req, res) => {
   console.log("hey")
  try {
    const token = await req.cookies.userToken;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); 
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ userName:user.userName,userId:user._id });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});


app.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ userName, password: hashedPassword });


    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

   
    res.cookie("userToken", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ data: { userName: newUser.userName, id: newUser._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});





app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName });

    if (!existingUser) {
      return res.status(301).json({ error: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("userToken", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      data: {
        userName: existingUser.userName,
        id: existingUser._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createPost", uploadMiddleware.single('file'), async (req, res) => {
  try {
    const token = req.cookies.userToken;
    const info = jwt.verify(token, JWT_SECRET); 
    const userId = info.id;

    const { id, title, summary, content, tags, isDraft } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    const tagsString = parsedTags.join(',');

    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const ext = originalname.split('.').pop();
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }

    let post;

    if (id && id !== ":id") {
      console.log("post id is provided");
      post = await Post.findById(id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      post.title = title || post.title;
      post.summary = summary || post.summary;
      post.content = content || post.content;
      post.tagsString = tagsString || post.tagsString;
      post.isDraft = isDraft ?? post.isDraft;
      if (newPath) post.cover = newPath;

      await post.save();
    } else {
      
      post = await Post.create({
        title,
        summary,
        tagsString,
        content,
        cover: newPath,
        author: userId,
        isDraft
      });
    }

    await redis.del(`autosave:${userId}`);

    return res.json({ message: id ? "Post Updated" : "Post Created", post });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




app.get("/posts",async(req,res)=>{
   const posts=await Post.find().populate('author',['userName']);
  
   res.json(posts);
})

app.get("/cache", async (req, res) => {
  
  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userId = user.id;

    const cache = await redis.get(`autosave:${userId}`);

    if (cache) {
    const parsedCache = JSON.parse(cache);
    console.log(parsedCache)
    return res.json(parsedCache);
    }

    
   

  } catch (err) {
    console.error("Error in /cache:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/viewPost/:id",async(req,res)=>{
   const id=req.params.id;
   console.log("request received")
   if(id!=":id")
   {
      const post=await Post.findById(id).populate('author',['userName']);
      res.json(post);
   }
  
  
   
})



app.post("/autosave", async (req, res) => {
  try {
    console.log("autosaved "+req.body)
    const content = req.body;
    const token = req.cookies.userToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const info = jwt.verify(token, JWT_SECRET);
    const userId = info.id;

    await redis.set(`autosave:${userId}`, JSON.stringify(content), 'EX', 360000);
    res.json({ message: "Autosaved successfully" });
    console.log("autosaved ",JSON.stringify(content))
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/logout",async(req,res)=>{
  console.log("logout called")
   res.clearCookie('userToken', {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax'
  });
  res.status(200).json({ message: 'Logged out' });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
