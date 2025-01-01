const Shorten = require("shorten-firebase.realtime-database");
const session = require("express-session");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const passport = require("passport");
const express = require("express");
const path = require("path");

const connectFirebase = require("connect-session-firebase");
const database = require("./firebase");
require("./strategy");

express.urlencoded({
    extended: true,
});

const app = express();
const PORT = 8080;

const authRoute = require("./routes/google");
const enemRoute = require("./routes/enem");

const FirebaseStore = connectFirebase(session);
const store = new FirebaseStore({
    database: database.firebase.database(),
    sessions: "sessions",
});

app.use(
    session({
        secret: "some random secret",
        cookie: {
            maxAge: 172800000,
        },
        saveUninitialized: false,
        resave: false,
        name: "google.oauth2",
        store: store,
    })
);

app.use((req, res, next) => {
    if (req.path.endsWith("/") && req.path.length > 1) {
        const newPath = req.path.slice(0, -1);
        const query = req.url.slice(req.path.length);
        res.redirect(301, newPath + query);
    } else {
        next();
    }
});

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware Routes
app.use("/google", authRoute);
app.use("/enem", enemRoute);

function isAuthorized(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/auth");
    }
}

app.get(["/home", "/dashboard"], (req, res) => {
    return res.status(301).redirect("/");
});

app.get("/", (req, res) => {
    return res.status(200).render("index", {
        user: req.user || undefined,
    });
});

app.get("/google", (req, res) => {
    return res.status(301).redirect("/google");
});

app.get("/about", (req, res) => {
    return res.status(200).render("about", {
        user: req.user || undefined,
    });
});

app.get("/perfil", (req, res) => {
    return res.status(301).redirect("/profile");
});

app.get("/profile", isAuthorized, (req, res) => {
    return res.status(200).render("profile", {
        user: req.user || undefined,
    });
});

app.get("/contact", (req, res) => {
    return res.status(200).render("contact", {
        user: req.user || undefined,
    });
});

app.get("/teacher", isAuthorized, (req, res) => {
    return res.status(301).render("teacher", {
        user: req.user || undefined,
    });
});

app.listen(PORT, () => {
    console.log("SERVER IS ON!");
});
