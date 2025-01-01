const router = require("express").Router();
const { Cookie } = require("express-session");
const passport = require("passport");

router.get("/", passport.authenticate("google"));
router.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
        successRedirect: "/",
    })
);

router.get("/logout", (req, res, next) => {
    if (req.user) {
        req.logout(function (err) {
            if (err) {
                return next(err); 
            };

            res.redirect('/');
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;