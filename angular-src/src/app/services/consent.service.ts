import { User } from './../models/user.model';
import { Consent } from './../models/consent.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  constructor( private httpClient: HttpClient) { }

  // Add General Consent
  SaveGeneralConsent(email: String, agree: Boolean) {
    const obj = { 'TCRMService': {
        '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
        'RequestControl': {
          'requestID': '10015',
          'DWLControl': {
            'requesterName': 'cusadmin',
            'requesterLanguage': '100'
          }
        },
        'TCRMTx': {
          'TCRMTxType': 'addConsent',
          'TCRMTxObject': 'ConsentBObj',
          'TCRMObject': {
            'ConsentBObj': {
              'ConsentOwnerId': email,
              'ProcPurpId': '728153040827580997',
              'AgreeInd': agree ? '1' : '0',
              'LanguageAgreedInType': '100',
              'EnforcementType': '2',
              'CreateDate': '2017-07-15',
              'StartDate': '2017-07-15',
              'ProfileSystemType': '2'
            }
          }
        }
      }
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic bWRtYWRtaW46bWRtYWRtaW4=',
        'Access-Control-Allow-Origin': '*'
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



  // Recevoir les consentements
  getUserConsents(email: String): Observable <Consent[]> {
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

    return this.httpClient.put('/api/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
                          .pipe( map((res: any) => { console.log(res);
                            let consents = res.TCRMService.TxResponse.ResponseObject.ConsentBObj;
                            if (!Array.isArray(consents)) { consents = Array.of(consents);  }
                            return consents;
                          })
                       );

  }

  activedConsent() {
      console.log('Consentement activé');
  }

  desactivedConsent() {
      console.log('consentement désactivé');
  }
}
