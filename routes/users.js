const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const request = require('request');
const path = require('path')
const util = require('util');
const requestPromise = util.promisify(request);

const mydb = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
  var newUser = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    score: req.body.score,
    img: req.body.img
  };
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      mydb.insert(newUser, function (err, body) {
        if (err) {
          res.json({
            success: false,
            msg: "falsed to register user"
          });
        } else {
          res.json({
            success: true,
            msg: "User registered"
          });
        }
      });
    });
  });
});

// AUTHENTICATE
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const candidatePassword = req.body.password;

  mydb.find({
    "selector": {
      "username": {
        "$eq": username
      }
    },
    "fields": [
      "_id",
      "_rev",
      "username",
      "password"
    ],
    "sort": [{
      "username": "asc"
    }]
  }).then((results) => {
    const user = results.docs[0];
    if (!user) return res.json({
      success: false,
      msg: 'User not found'
    });
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({
          data: user
        }, "yoursecret", {
          expiresIn: 604000 // 1 week
        });
        return res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong password'
        });
      }
    });
  });
});

// PROFILE
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  res.json({
    user: req.user
  });
});

// DASHBOARD 
router.get('/topscore', (req, res, next) => {
  mydb.find({
    "selector": {
      "_id": {"$gt": 0}
    },
    "fields": [
      "_id",
      "name",
      "email", 
      "username", 
      "score", 
      "img"
    ],
    "sort": [{
      "score": "desc"
    }],
    "limit": 3,
    "skip": 0
  }).then((result)  => {
      console.log(result.docs);
      res.json(result.docs);
    });
  });
module.exports = router;