const Cloudant = require("@cloudant/cloudant");
const cfenv = require("cfenv");

var cloudant, mydb;
// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require("../vcap-local.json");
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.log("Error loading vcap-local " + e);
}

const appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {};
const appEnv = cfenv.getAppEnv(appEnvOpts);
if (appEnv.services["cloudantNoSQLDB"]) {
  // Initialize database with credentials
  cloudant = Cloudant(appEnv.services["cloudantNoSQLDB"][0].credentials);
}
if (cloudant) {
  //database name
  var dbName = "mydb";
  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if (!err) {
      //err if database doesn't already exists
      console.log("Created database: " + dbName);
      const indexDef = {
        index: { fields: ['username'] },
        name: 'fooindex',
        type: 'json'
      };
      mydb = cloudant.use(dbName);
      mydb.createIndex(indexDef).then((result) => {
        console.log(result);
      });
    } else {
      console.log("Existing database: " + dbName);
    }
  });

  mydb = cloudant.use(dbName);
}
module.exports = mydb;