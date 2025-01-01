const router = require("express").Router();
const { Cookie } = require("express-session");
const passport = require("passport");

router.get("/", function (req, res, next) {
    res.render("enem", {
        user: req.user || undefined,
    });
});

module.exports = router;