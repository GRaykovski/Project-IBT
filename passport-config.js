const { authenticate } = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

 function initialize(passport, getUserbyEmail, getUserByID){
    const authenticateUser = async (email, password, done)=> {
        const user = getUserbyEmail(email)
        if(user == null){
            return done(null, false, {message: 'No user with that email'})
        }

        try{
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorect'})
            }
        } catch(e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user,done)=>done(null, user.id))
    passport.deserializeUser((id,done)=>{
        done(null, getUserByID(id))
    })
}

module.exports = initialize