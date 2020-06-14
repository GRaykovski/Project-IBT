if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const userRouter = require('./routes/users')
const methodOverride = require('method-override')
const flash = require('express-flash');
const session = require('express-session')
const passport = require('passport')
const app = express()

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true ,
 useUnifiedTopology: true, useCreateIndex: true })

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index', { articles: articles })
})

app.use('/users', userRouter)
app.use('/articles', articleRouter)

app.listen(5000)