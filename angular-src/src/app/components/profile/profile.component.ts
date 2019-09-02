import { ConsentService } from './../../services/consent.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from '../../models/user.model';

import { subscribeOn } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
   user = new User();
  consents: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private consentService: ConsentService,
    private httpClient: HttpClient

  ) {
  }

  ngOnInit() {

    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
      this.onRecievConsent(this.user.email);
    }, err => {
      console.log(err);
      return false;
    });

  }

      onRecievConsent(email: string) {
        const obj = {'TCRMService': {
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
            'InquiryType': 'getAllConsentByParty',
            'InquiryParam': {
              'tcrmParam': [{
              '@name': 'ConsentOwnerId',
              '$': this.user.email
            },
            {
              '@name': 'InquiryLevel',
              '$': '0'
            },
            {
              '@name': 'Filter',
              '$': ''
            }
          ]
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
        this.consents = data;
    }, error => {
      console.log('les erreurs : ' + error);
    });

    }
    //  function switchActivedConsent() {
    //     this.consentService.activedConsent() ;
    // }

    //  function switchDesactivedConsent() {
    //     this.consentService.desactivedConsent();
    // }


}
