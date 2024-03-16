const passport = require("passport");
const passportJWT = require("passport-jwt");
const Entreprise = require("../../models/Entreprise");
const ExtractJWT = passportJWT.ExtractJwt;

require("dotenv").config();

exports.authenticate = (req, res, next) => {
  passport.use(
    new passportJWT.Strategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await Entreprise.findById(payload._id);
          if (!user) {
            return done(null, false);
          }

          const result = user.toObject();
          delete result.password;

          return done(null, result);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
