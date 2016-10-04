/**
 * Created by Frank on 10/3/2016.
 */
passport.use('local-update', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if ( req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                var user            = req.user;
                user.local.email    = email;
                user.local.name     = name;
                user.local.username = username;
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));
app.get('/api/users', auth, function(req, res) {
    getUsers(res);
});

app.get('/api/users/:user_id', function (req, res) {
    User.findOne({
        _id: req.params.user_id
    }, function (err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
});

app.put('/api/users/:user_id', function(req, res) {
    var user = req.body;
    var userId = req.params.id;
    console.log(user);
    console.log(userId);
    if (!req.body.email || !req.body.password) {
        return res.json({ error: 'Email and Password required' });
    }
    passport.authenticate('local-update', function(err, user, info) {
        if (err) {
            return res.json(err);
        }
        if (user.error) {
            return res.json({ error: user.error });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.json(err);
            }
            res.redirect( '/#/profile' );
        });
    })(req, res);
});

