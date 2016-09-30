var mongoose = require('mongoose');
var Theme = require('../models/Theme.js');
var Campaign = require('../models/Campaign.js');
var Post = require('../models/Post.js');
var crypto = require('crypto');
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});
var passport = require('passport');

function getCampaigns(res) {
  Campaign.find(function (err, campaigns) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    res.json(campaigns); // return all campaigns in JSON format
  });
};
function getPosts(res) {
  Post.find(function (err, posts) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    res.json(posts); // return all posts in JSON format
  });
};
function getThemes(res){
  Theme.find(function (err, themes){
    if(err){
      res.send(err);
    }
    res.json(themes)
  });
}

module.exports = function (app, passport) {
// route middleware to ensure user is logged in - ajax get
  var auth = function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);

      // =============================================================================
    } else {
      next();
    }
  }

  app.get('/setup', function (req, res) {
    var cfmTheme = {
      name: 'CrowdFundMe',
      baseCss: 'Materialize',
      baseUrl: 'vendor/angular-material/angular-material.css',
      customCss: 'CrowdFundMe',
      customUrl: 'vendor/Materialize/dist/css/materialize.min.css',
      active: true
    };

    var theme = new Theme(cfmTheme);

    theme.save(function (err, theme){
      if (err) {
        console.log(err);
        res.json(err);
      }else {
        console.log(theme);
        res.redirect('/setup2')
      }
    })


  });
  app.get('/setup2', function (req, res) {
    var adminTheme = {
      name: 'Korra',
      baseCss: 'Angular Material',
      baseUrl: 'vendor/angular-material/angular-material.css',
      customCss: 'Korra',
      customUrl: 'vendor/Materialize/dist/css/materialize.min.css',
      active: false
    };

    var theme = new Theme(adminTheme);

    theme.save(function (err, theme){
      if (err) {
        console.log(err);
        res.json(err);
      }else {
        console.log(theme);
        res.redirect('/#/login')
      }
    })


  });

  /*app.post('/setup', function (req, res) {

    var cfmTheme = {
      name: 'CrowdFundMe',
      baseCss: 'Angular Material',
      baseUrl: 'vendor/angular-material/angular-material.css',
      customCss: 'CrowdFundMe',
      customUrl: 'vendor/Materialize/dist/css/materialize.min.css',
      active: true
    }

    var theme = new Theme(cfmTheme);

    theme.save(function (err, theme){
      if (err) {
        console.log(err)
        res.json(err);
      }else {
        console.log(theme)
        res.json(theme);
      }
    })


  });
*/
  // Campaigns ---------------------------------------------------------------------

  // get all campaigns
  app.get('/api/campaigns', function (req, res) {
    // use mongoose to get all campaigns in the database
    getCampaigns(res);
  });

  // get campaign by id
  app.get('/api/campaigns/:campaign_id', function (req, res) {
    Campaign.findOne({
      _id: req.params.campaign_id
    }, function (err, campaign) {
      if (err)
        res.send(err);

      res.json(campaign);
    });
  });

  // create campaign and send back all campaigns after creation
  app.post('/api/campaigns', multer({ storage: storage }).single('file'), function (req, res) {

    // create a campaign, information comes from AJAX request from Angular
    Campaign.create({
      title: req.body.title,
      description: req.body.description,
      raised: req.body.raised,
      imgPath: req.file.filename
    }, function (err, campaign) {
      if (err)
        res.send(err);
      // get and return all the campaigns after you create another
      getCampaigns(res);
    });

  });

  // update a campaign
  app.put('/api/campaigns/:campaign_id', multer({ storage: storage }).single('file'), function (req, res) {

    if (req.file){
      Campaign.findByIdAndUpdate(req.params.campaign_id, {
            $set: {
              title: req.body.title,
              description: req.body.description,
              raised: req.body.raised,
              imgPath: req.file.filename
            }}, {upsert:true}, function (err, campaign) {

            return res.json(true);
          }
      );
    }else {
      Campaign.findByIdAndUpdate(req.params.campaign_id, {
            $set: {
              title: req.body.title,
              description: req.body.description,
              raised: req.body.raised,
              imgPath: req.body.imgPath
            }}, {upsert:true}, function (err, campaign) {
        console.log(req.body.imgPath)
            return res.json(true);
          }
      );
    }
  });

  // delete a campaign
  app.delete('/api/campaigns/:campaign_id', function (req, res) {
    Campaign.remove({
      _id: req.params.campaign_id
    }, function (err, campaign) {
      if (err)
        res.send(err);

      getCampaigns(res);
    });
  });

  // Posts ---------------------------------------------------------------------

  // get all posts
  app.get('/api/posts', function (req, res) {
    // use mongoose to get all posts in the database
    getPosts(res);
  });

  // get post by id
  app.get('/api/posts/:post_id', function (req, res) {
    Post.findOne({
      _id: req.params.post_id
    }, function (err, post) {
      if (err)
        res.send(err);

      res.json(post);
    });
  });

  // create post and send back all posts after creation
  app.post('/api/posts', multer({ storage: storage }).single('file'), function (req, res) {

    // create a post, information comes from AJAX request from Angular
    Post.create({
      title: req.body.title,
      description: req.body.description,
      imgPath: req.file.filename
    }, function (err, post) {
      if (err)
        res.send(err);
      // get and return all the posts after you create another
      getPosts(res);
    });

  });

  // update a post
  app.put('/api/posts/:post_id', multer({ storage: storage }).single('file'), function (req, res) {

    if (req.file){
      Post.findByIdAndUpdate(req.params.post_id, {
            $set: {
              title: req.body.title,
              description: req.body.description,
              raised: req.body.raised,
              imgPath: req.file.filename
            }}, {upsert:true}, function (err, post) {

            return res.json(true);
          }
      );
    }else {
      Post.findByIdAndUpdate(req.params.post_id, {
            $set: {
              title: req.body.title,
              description: req.body.description,
              raised: req.body.raised,
              imgPath: req.body.imgPath
            }}, {upsert:true}, function (err, post) {
            console.log(req.body.imgPath)
            return res.json(true);
          }
      );
    }
  });

  // delete a post
  app.delete('/api/posts/:post_id', function (req, res) {
    Post.remove({
      _id: req.params.post_id
    }, function (err, post) {
      if (err)
        res.send(err);

      getPosts(res);
    });
  });

  /** API path that will upload the files */
  app.post('/upload', function(req, res) {
    upload(req,res,function(err){
      if(err){
        res.json({error_code:1,err_desc:err});
        return;
      }
      res.json({error_code:0,err_desc:null});
    })
  });


  // Theme ==========================================================
  app.get('/api/themes', function(req, res){
    getThemes(res);
  });

  app.get('/api/themes/:active', function(req, res){
    Theme.find({active: true}, function(err, theme){
      if (err){
        console.log(err);
        res.send(err)
      }else {
        console.log(theme);
        res.json(theme);
      }
    })
  });

  app.post('/api/themes', function(req, res){
    Theme.create ({
      name: req.body.name,
      base: req.body.base,
      custom: req.body.custom
    }, function(err, theme){
      if (err)
      res.send(err);

      getThemes(res);
    })
  });


  // Users =======================================================================


// normal routes ===============================================================

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {

    req.logout();
    res.redirect( '/' );
  });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

  // locally --------------------------------
  // LOGIN ===============================

  // process the login form
  app.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
      return res.json({ error: 'Email and Password required' });
    }
    passport.authenticate('local-login', function(err, user, info) {
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
        res.redirect( '/#/admin/campaigns' );
      });
    })(req, res);
  });

  // SIGNUP =================================

  // process the signup form
  app.post('/signup', function(req, res, next) {
    console.log(req.body)
    if (!req.body.email || !req.body.password) {
      return res.json({ error: 'Email, Username, and Password required' });
    }
    passport.authenticate('local-signup', function(err, user, info) {
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
        res.send(user);
      });
    })(req, res);
  });


  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/#/admin/home',
        failureRedirect : '/#/login'
      }));

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect : '/#/profile',
        failureRedirect : '/'
      }));


  // google ---------------------------------

  // send to google to do the authentication
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect : '/#/profile',
        failureRedirect : '/'
      }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

  // locally --------------------------------
  app.post('/connect/local', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
      return res.json({ error: 'Email and Password required' });
    }
    passport.authenticate('local-signup', function(err, user, info) {
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

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
      passport.authorize('facebook', {
        successRedirect : '/#/profile',
        failureRedirect : '/'
      }));

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
      passport.authorize('twitter', {
        successRedirect : '/#/profile',
        failureRedirect : '/'
      }));


  // google ---------------------------------

  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback',
      passport.authorize('google', {
        successRedirect : '/#/profile',
        failureRedirect : '/'
      }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/#/profile');
    });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', function(req, res) {
    var user            = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/#/profile');
    });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', function(req, res) {
    var user           = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
      res.redirect('/#/profile');
    });
  });

  // google ---------------------------------
  app.get('/unlink/google', function(req, res) {
    var user          = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/#/profile');
    });
  });

  app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });
// =============================================================================
  app.get('/api/users', auth, function(req, res) {
    res.send(req.user);
  });

  // show the home page (will also have our login links)
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });



};

