Consent App - Based On CEAN Auth App

This sample Register/Login front end was built using the Traversy Media tutotial ( https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ )

This was ported to Cloudant instead of MongoDb
to facilitate the deployment to IBM Cloud

<<<<<<< HEAD
[![Deploy to IBM Cloud](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/AmaryGuisse/ceanauthapp.git&branch=consent)
=======
[![Deploy to IBM Cloud](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/jpradier/ceanauthapp.git&branch=consent)
>>>>>>> c1edb09e0069f8b9d4c1d70eaf8015dcceec7018


Note if you want to run it locally against your IBM Cloud Cloudant intance, provide a vacp-local.json file such as:
{
  "services": {
    "cloudantNoSQLDB": [
      {
        "credentials": {
          "url": "TODO - Replace with your cloudant URL"
        },
        "label": "cloudantNoSQLDB"
      }
    ]
  }
}