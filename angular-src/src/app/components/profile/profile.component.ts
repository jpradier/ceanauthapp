import { ConsentService } from './../../services/consent.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {User} from '../../models/user.model';

import { subscribeOn } from 'rxjs/operators';
import { Consent } from 'src/app/models/consent.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
   user: User = new User();
   consents: Consent[];
   agree: Boolean = false;



  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private consentService: ConsentService,

  ) {}

  ngOnInit() {

    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
      this.consentService.getUserConsents(this.user.email).subscribe((res: Consent[]) => {
        this.consents = res;
       });
    });
  }

  switchConsent() {
  if (this.agree === true) {
    this.consentService.SaveGeneralConsent(this.user.email, this.agree);
    this.consentService.getUserConsents(this.user.email).subscribe((res: Consent[]) => {
      this.consents = res;
     });
    this.flashMessage.show('Consentement activé', {
      cssClass: 'alert-success',
      timeout: 3000
      });
  } else {
        this.flashMessage.show('Consentement désactivé', {
          cssClass: 'alert-danger',
          timeout: 3000
        });
      }

}

  // switchActivedConsent() {
  //   this.consentService.activedConsent() ;
  // }

  // switchDesactivedConsent() {
  //   this.consentService.desactivedConsent();
  // }

  //     onRecievConsent(email: string) {
  //       const obj = {'TCRMService': {
  //         '@schemaLocation': 'http://www.ibm.com/mdm/schema MDMDomains.xsd',
  //         'RequestControl': {
  //           'requestID': 1000,
  //           'DWLControl': {
  //           'requesterName': 'cusadmin',
  //           'requesterLocale': '100',
  //           'requesterTimeZone': 'UTC'
  //           }
  //         },
  //         'TCRMInquiry': {
  //           'InquiryType': 'getAllConsentByParty',
  //           'InquiryParam': {
  //             'tcrmParam': [{
  //             '@name': 'ConsentOwnerId',
  //             '$': this.user.email
  //           },
  //           {
  //             '@name': 'InquiryLevel',
  //             '$': '0'
  //           },
  //           {
  //             '@name': 'Filter',
  //             '$': ''
  //           }
  //         ]
  //       }
  //     }
  //   }
  // };

  // const httpOptions = {
  //           headers: new HttpHeaders({
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //           'Authorization': 'Basic bWRtYWRtaW46bWRtYWRtaW4=',
  //          'Access-Control-Allow-Origin': '*'
  //         })
  //       };


  // this.httpClient
  //   .put('/api/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
  //   .subscribe(data => {
  //       console.log( 'les donnes de retour de la requete : ' + data);
  //       this.consents[this.i] = data;
  //   }, error => {
  //     console.log('les erreurs : ' + error);
  //   });

  //   }


}
