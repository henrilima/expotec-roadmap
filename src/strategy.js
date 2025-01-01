const GoogleStrategy = require("passport-google-oauth20").Strategy;
const database = require("./firebase");
const passport = require("passport");
const usersRef = database.firebase.database().ref("users-sessions");

passport.serializeUser((user, done) => {
    done(null, user.key);
});

passport.deserializeUser((id, done) => {
    const userRef = database.firebase.database().ref(`users-sessions/${id}`);
    userRef.once(
        "value",
        (snapshot) => {
            const user = snapshot.val();
            if (user) {
                done(null, user);
            } else {
                done(new Error(`User with id ${id} not found`));
            }
        },
        (error) => {
            done(error);
        }
    );
});

passport.use(
    new GoogleStrategy(
        {
            // clientID: GOOGLE CLIENT ID,
            // clientSecret:    GOOGLE SECRET,
            callbackURL: "/google/callback",
            scope: ["profile", "email"],
        },
        async (acessToken, refreshToken, profile, done) => {
            try {
                const usersSnapshot = await usersRef
                    .orderByChild("googleId")
                    .equalTo(profile.id)
                    .once("value");
                const usersData = usersSnapshot.val();
                if (usersData) {
                    const userId = Object.keys(usersData)[0];
                    const user = usersData[userId];
                    user.key = userId;
                    user.avatar = profile._json.picture;
                    user.username = profile._json.given_name;
                    user.name = profile._json.name;
                    user.email = profile.emails[0].value;
                    user.tag = `${profile._json.given_name}#${user.discriminator}`;
                    await usersRef.child(userId).update(user);
                    return done(null, user);
                } else {
                    const discriminator =
                        Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    const newUser = {
                        googleId: profile.id,
                        name: profile._json.name,
                        avatar: profile._json.picture,
                        username: profile._json.given_name,
                        discriminator,
                        email: profile.emails[0].value,
                        tag: `${profile._json.given_name}#${discriminator}`,
                    };
                    const newUserRef = await usersRef.push(newUser);
                    const newUserSnapshot = await newUserRef.once("value");
                    const saveUser = newUserSnapshot.val();
                    saveUser.key = newUserRef.key;
                    done(null, saveUser);
                }
            } catch (err) {
                console.log(err);
                done(err, null);
            }
        }
    )
);
