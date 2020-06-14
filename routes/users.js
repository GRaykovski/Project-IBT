const express = require('express')
const router = express.Router()
const bcrypt =require('bcryptjs')
const passport = require('passport')
const initilizePassport = require('../passport-config')
const flash = require('express-flash')
const methodOverride = require('method-override')
const users = []
initilizePassport(passport, email => 
    users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

router.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('users/register')
})

router.post('/register',checkNotAuthenticated, async (req, res) =>{
    try {
        const hashedPassword = await bcrypt.hash( req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/users/login')
    } catch{
        res.redirect('/users/register')
    }
})

router.get('/login',checkNotAuthenticated , (req, res) => {
    res.render('users/login')
})

router.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}))

router.delete('/logout',(req, res)=>{
    req.logOut()
    res.redirect('/users/login')
})

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
       return res.redirect('/')
    }
    next()
}

module.exports = router