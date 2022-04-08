const localStrat = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        if (user == null) {
            return done(null, false, { message: "Incorrect username" });
        }

        try{
            if(await bcryptjs.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password" });
            }
        }catch(err){
            return done(e)
        }
    };
    passport.use(new localStrat({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
}

module.exports = initialize;