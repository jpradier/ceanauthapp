import { User } from './../models/user.model';
import { Consent } from './../models/consent.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jsonpFactory } from '@angular/http/src/http_module';


@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  constructor( private httpClient: HttpClient) { }

  // Add General Consent
  addGeneralConsent(email: String, agree: Boolean): Observable<String> {
    const ProcPurpId = '728153040827580997';
    return this.addConsent(email, ProcPurpId, agree);
  }

  // Participation in the Sprint
  addParticipationSprint(email: String, agree: Boolean): Observable<String>  {
    const ProcPurpId = '919653040842573137';
    return this.addConsent(email, ProcPurpId, agree);
  }

  // REceive Promotional Information
  receivePromotionalInfo(email: String, agree: Boolean): Observable<String>  {
    const ProcPurpId = '314553040846845067';
    return this.addConsent(email, ProcPurpId, agree);
  }

  // Sharing Of Data
  sharingOfData(email: String, agree: Boolean): Observable<String>  {
    const ProcPurpId = '821553040852370058';
    return this.addConsent(email, ProcPurpId, agree);
  }

  public addConsent(email: String, ProcPurpId: string, agree: Boolean): Observable<String> {
    console.log('inside addconsent');
    const obj = {
    'TCRMService': {
      '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
      'RequestControl': {
        'requestID': '10015',
        'DWLControl': {
          'requesterName': 'cusadmin',
          'requesterLanguage': '100',
          'requesterTimeZone': 'UTC'
        }
      },
      'TCRMTx': {
        'TCRMTxType': 'addConsent',
        'TCRMTxObject': 'ConsentBObj',
        'TCRMObject': {
          'ConsentBObj': {
            'ConsentOwnerId': email,
            'ProcPurpId': ProcPurpId,
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

    const now = new Date();
    obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.StartDate = now.toISOString().replace('T', ' ').replace('Z', '');
    obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.CreateDate = now.toISOString().replace('T', ' ').replace('Z', '');


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic bWRtYWRtaW46bWRtYWRtaW4=',
        'Access-Control-Allow-Origin': '*'
      })
    };
console.log('inside addconsent1');
    return this.httpClient
      .put('http://mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
      .pipe( map((res: any) => {
        console.log(res);
        const consentRes = res.TCRMService.TxResponse.ResponseObject.ConsentBObj.ConsentId;

        return consentRes;
      }),
    );
  }


  // Update Consent
  updateConsent(consent): Observable<String> {
    const obj = { 'TCRMService': {
      '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
      'RequestControl': {
        'requestID': '10015',
        'DWLControl': {
          'requesterName': 'cusadmin',
          'requesterLanguage': '100',
          'requesterTimeZone': 'UTC'
        }
      },
      'TCRMTx': {
        'TCRMTxType': 'updateConsent',
        'TCRMTxObject': 'ConsentBObj',
        'TCRMObject': {
          'ConsentBObj': {
            'ConsentId': '',
            'AgreeInd': '',
            'EndDate': '',
            'EndReasonType': '',
            'ConsentLastUpdateDate': ''
          }
        }
      }
    }
  };

  obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.ConsentId = consent.ConsentId;
  obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.AgreeInd = consent.AgreeInd;
  const now = new Date();
  obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.EndDate = now.toISOString().replace('T', ' ').replace('Z', '');
  obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.EndReasonType = '13';
  obj.TCRMService.TCRMTx.TCRMObject.ConsentBObj.ConsentLastUpdateDate = consent.ConsentLastUpdateDate;

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic bWRtYWRtaW46bWRtYWRtaW4=',
      'Access-Control-Allow-Origin': '*'
    })
  };
    return this.httpClient.put('http://mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
      .pipe( map((res: any) => {
        console.log(res);
        const consentRes = res.TCRMService.TxResponse.ResponseObject.ConsentBObj.ConsentId;
        return consentRes;
      }),
    );
  }

  getUserConsentsByProcPurp(email: String, procPurpId: String): Observable <Consent[]> {
    return this.getUserConsents(email).pipe(
      map((consents: any[]) => {
        return consents.filter( consent => consent.ProcPurpId === procPurpId);
    })
 );
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

    return this.httpClient.put('http://mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
                          .pipe( map((res: any) => { console.log(res);
                            let consents = res.TCRMService.TxResponse.ResponseObject.ConsentBObj;
                            if (!Array.isArray(consents)) { consents = Array.of(consents);  }
                            return consents;
                          })
                       );

  }

  // Afficher tous les processing purpose

  getAllProcessingPurpose(): Observable<Consent[]> {
    const obj = {
      'TCRMService': {
        '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
        'RequestControl': {
            'requestID': 1000,
            'DWLControl': {
                'requesterName': 'cusadmin',
                'requesterLocale': '100',
                'requesterTimeZone': 'UTC'
            }
        },
        'TCRMInquiry': {
            'InquiryType': 'getAllProcessingPurpose',
            'InquiryParam': {
                'tcrmParam': []
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
    return this.httpClient.put('http://mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
                          .pipe( map((res: any) => { console.log(res);
                          const unfilteredProcPurposes = res.TCRMService.TxResponse.ResponseObject.ProcessingPurposeBObj;
                          return unfilteredProcPurposes.filter( procPurp => procPurp.ProcPurpParentType === '1000510');
                          })
    );
}

// Recevoir la description du consentement
  getProcPurpDescription(procPurpId: String): Observable <String> {

          const obj = {
            'TCRMService': {
              '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
              'RequestControl': {
                  'requestID': 1000,
                  'DWLControl': {
                      'requesterName': 'cusadmin',
                      'requesterLocale': '100',
                      'requesterTimeZone': 'UTC'
                  }
              },
              'TCRMInquiry': {
                  'InquiryType': 'getProcessingPurpose',
                  'InquiryParam': {
                      'tcrmParam': [{
                          '@name': 'ProcPurpId',
                          '$': procPurpId
                      }, {
                          '@name': 'InquiryLevel',
                          '$': '0'
                      }]
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
        return this.httpClient.put('http://mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
                              .pipe( map((res: any) => { console.log(res);
                              return res.TCRMService.TxResponse.ResponseObject.ProcessingPurposeBObj.ProcPurpDescription;
                              })
    );
  }
}
