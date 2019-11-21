Consent App - Based On CEAN Auth App

This sample Register/Login front end was built using the Traversy Media tutotial ( https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ )

This was ported to Cloudant instead of MongoDb
to facilitate the deployment to IBM Cloud


[![Deploy to IBM Cloud](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/jpradier/ceanauthapp.git&branch=consent)




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


Make sure your MDM Server is up and running, and is accessible using the hostname mdmdemowin from your local machine (that will run chrome). Double-check that you can log into MDM using (mdmadmin/mdmadmin) at https://mdmdemowin:9443/mdmconsent/
To avoid CORS Blocking, make sure you are lauching chrome using the following command lines

alias chrome="/Applications/Google\\ \\Chrome.app/Contents/MacOS/Google\\ \\Chrome"
chrome --user-data-dir="/tmp/chrome_dev_test" --disable-web-security 
[Note you can also install a plugin such as "Allow CORS" to permanently enable CORS from your Chrome browser]