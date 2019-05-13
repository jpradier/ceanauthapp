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
        password: req.body.password
    };
    bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password,  salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
            mydb.insert(newUser, function (err, body) {
                if (err) {
                    res.json({ success: false, msg: "falsed to register user" });
                } else {
                    res.json({ success: true, msg: "User registered" });
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
        "sort": [
           {
              "username": "asc"
           }
        ]
     }).then((results) => {
        const user = results.docs[0];
        if (!user) return res.json({success: false, msg: 'User not found'});
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, "yoursecret", {
                    expiresIn: 604000 // 1 week
                });
                return res.json({
                    success:true,
                    token: 'JWT '+token,
                    user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }    
        });
    });
});

// PROFILE
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

var cnf = require('../config/mdm-cnf');

var serviceUrl = 'http://' + path.join(cnf.host + ':' + cnf.port || 80
, cnf.path || '/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful')
var authorization = cnf.authtoken ? 'Basic ' + cnf.authtoken
: Buffer.from('mdmadmin:mdmadmin').toString('base64')


var addConsentTx = {
    "TCRMService": {
      "@schemaLocation": "http://www.ibm.com/mdm/schema MDMDomains.xsd",
      "RequestControl": {
        "requestID": "10015",
        "DWLControl": {
          "requesterName": "cusadmin",
          "requesterLanguage": "100"
        }
      },
      "TCRMTx": {
        "TCRMTxType": "addConsent",
        "TCRMTxObject": "ConsentBObj",
        "TCRMObject": {
          "ConsentBObj": {
            "ConsentOwnerId": "james.lebas@fr.ibm.com",
            "ProcPurpId": "728153040827580997",
            "AgreeInd": "1",
            "LanguageAgreedInType": "100",
            "EnforcementType": "2",
            "CreateDate": "2017-11-01",
            "StartDate": "2017-11-01",
            "ProfileSystemType": "2"
          }
        }
      }
    }
  };  


/**
 * @namespace dateHelper
 */
var dateHelper = {
  /**
   * Get current date with the MDM format (yyyy-mm-dd hh:mm:ss.eeee)
   * @returns date string
   */
  'now': () => {
      var now = new Date()
      //now.setHours(now.getHours() + 1)
      return now.toISOString().replace('T', ' ').replace('Z', '')
  },
  /**
   * Get date 10 years from now with the MDM format (yyyy-mm-dd hh:mm:ss.eeee)
   * @returns date string
   */
  'end': () => {
      var end = new Date()
      //end.setHours(end.getHours() + 1)
      end.setYear(end.getFullYear() + 10)
      return end.toISOString().replace('T', ' ').replace('Z', '')
  }
}

// CONSENT
router.put('/consent', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    console.log(req);
    console.log({ user: req.user, consent: {procpurpid : req.body.procpurpid, agreeind: req.body.agreeind} });

    var now = dateHelper.now()
    var end = dateHelper.end()


    var options = {
      method: 'PUT',
      url: serviceUrl,
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': authorization,
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      json: true
    }
    options.body = addConsentTx;
    options.body.TCRMService.TCRMTx.TCRMObject.ConsentBObj.ConsentOwnerId = req.user.email;
    options.body.TCRMService.TCRMTx.TCRMObject.ConsentBObj.AgreeInd = 1;
    options.body.TCRMService.TCRMTx.TCRMObject.ConsentBObj.CreateDate = now;
    options.body.TCRMService.TCRMTx.TCRMObject.ConsentBObj.StartDate = now;

    var result = await requestPromise(options);
    console.log(result.body.TCRMService.ResponseControl.ResultCode);
    return res.json({"Result" : result.body.TCRMService.ResponseControl.ResultCode });
    
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
});


module.exports = router;
