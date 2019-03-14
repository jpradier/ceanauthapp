const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mydb = require('../config/database');

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = "yoursecret";
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        mydb.get(jwt_payload.data._id, (err, user) => {
			console.log(user);
			if(err){
				return done(err, false);
			}
			if (user){
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
    }));
};