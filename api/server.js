const express = require("express");
const cors = require("cors");
const app = express();
const moongose = require("mongoose");
const {getMessages, getMessage, sendMessage} = require('./handlers/message');
const { getPosts, getPost, createPost, deletePost } = require("./handlers/post");
const { createUser, login, deleteUser } = require("./handlers/user");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//message routes
app.get('/message', getMessages);
app.get('/message/:id',getMessage);
app.post('/message',sendMessage);
//delete routes
app.get('/post', getPosts)
app.get('/post/:id',getPost)
app.post('/post',createPost)
app.delete('/post/:id',deletePost)
//user routes
app.get('/user',login);
app.post('/user',createUser)
app.delete('/user/:id', deleteUser)


const dbURL ="********************";

moongose
  .connect(dbURL, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then((res) => {
    app.listen(5000);
    console.log("connected")
  })
  .catch((err) => {
    console.log(err);
  });