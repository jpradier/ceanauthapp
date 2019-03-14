var db;
var cloudant;
var dbCredentials = { dbName: 'meanauth'};
var fs = require('fs');

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    return vcapServices.url;
}

function initDBConnection() {
 
    dbCredentials.url = "https://7ca33733-b7f3-4d85-a879-61bc1f2189e7-bluemix:e898931a133bb282ae137cec32bd9c2f5b77486a1c9c26d2a2bb4e9c9dd385c3@7ca33733-b7f3-4d85-a879-61bc1f2189e7-bluemix.cloudantnosqldb.appdomain.cloud";

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();
var newDoc = { "name" : "Amary Guisse", "email": "amary.guisse@fr.ibm.com", "username": "aguisse", "password" : "toto"};
db.insert(newDoc, function(err, doc) {
  if(err || !doc) {
    console.log(err);
  } else {
    // console.log(doc);
    db.find({ "selector": { "_id": { "$gt": 0 } }, "fields": [ "_id", "name", "email" ] }, function(err, result) {
      if (!err) {
        console.log(result.docs);
     }
   })   
  }
});

// db.find({ "selector": { "_id": { "$gt": 0 } }, "fields": [ "_id", "name", "email", "username" ] }, function(err, result) {
// 	 if (!err) {
// 		 console.log(result.docs);
// 	}
// })
// db.get('6f5256cbad591e5174ff60238bea202f', function(err, user) {
// 	console.log(user);
// })