import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  constructor( private httpClient: HttpClient) { }

  getUserConsent(email: String) {
    const obj = {
      'TCRMService': {
         '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
         'RequestControl': {
            'requestID': 604157,
            'DWLControl': {
               'requesterName': 'mdmadmin',
               'requesterLocale': 'en_US',
               'requesterTimeZone': 'UTC'
            }
         },
         'TCRMTx': {
            'TCRMTxType': 'searchConsent',
            'TCRMTxObject': 'ConsentSearchBObj',
            'TCRMObject': {
               'ConsentSearchBObj': {
                  'ConsentOwnerId': email,
                  'EnforcementType': '2',
                  'ProfileSystemType': '2',
                  'InquiryLevel': '3'
               }
            }
         }
      }
   };

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic bWRtYWRtaW46bWRtYWRtaW4='
    })
  };

    this.httpClient
    .put('/api/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
    .subscribe(data => {
        console.log( 'les donnes de retour de la requete : ' + data);
    }, error => {
      console.log('les erreurs : ' + error);
    });
  }

  activedConsent() {
      console.log('Consentement activé');
  }

  desactivedConsent() {
      console.log('consentement désactivé');
  }
}
