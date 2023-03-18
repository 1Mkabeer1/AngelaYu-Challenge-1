const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/boss-challenge-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const News = require('./models/newsLeter');
const Page = require('./models/pages')
const app = express()
const port = 3000;


const pageContent = async()=> {
  try {
    await Page.deleteMany({});
    await Page.insertMany([{
        title:'homeStartingContent',
        content:"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
      },{
        title: 'aboutContent',
        content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
      },{
        title: "contactContent",
        content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
      }])  
     
  } catch (error) {
    console.log(error);
  }  

}
// pageContent()
// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))

const allPost = [];

// const news1 = new News({
//   title :'Day 1',
//   post: 'this is my first challenge news with mongo db under angela yu challenge.'
// })
// news1.save().then(news => console.log(news))


app.get('/', async(req, res)=>{ 
    const home = await Page.findOne({title:"homeStartingContent"});
    const allPost = await News.find({})   
    res.render('home', { home , allPost })
});


app.get('/about', async(req, res) => {
  const about = await Page.findOne({title:"aboutContent"});
  res.render('about', { about })
});

app.get('/contact', async(req, res)=>{
  const contact = await Page.findOne({title:"contactContent"})
  res.render('contact', { contact })
});
app.get('/compose', (req, res) => {
  res.render('compose')
});

app.post('/compose', async(req, res)=>{
  const { postTitle, postMsg } = req.body;
  const post = {
    title:postTitle,
    content:postMsg
  };
  const newPost = new News (post);
  await newPost.save()
  console.log(post);
  res.redirect('/compose')
})
app.get('/post', async(req, res)=>{
  const allPost = await News.find({})
  res.render('post', {allPost})
})

app.get('/posts/:id',async(req, res)=>{
  const { id } = req.params
  const {title, content} = await News.findById(id)
  res.render('singlepost',{title, content})
  console.log(id)
  
  // for (let post of allPost){
  //   const postTitle = _.lowerCase(post.title);
  //   const {title, content} = post;
  //   if (paramName === postTitle){
  //     res.render('singlepost',{title, content})
  //     console.log('Match Found');
  //   }
  // };
});

app.listen(port,()=>{
    console.log(`server started on port: ${port}`);
});