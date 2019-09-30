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
   response: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private consentService: ConsentService,

  ) {}

  ngOnInit() {

    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
      this.showConsentAndDetails();
    });
  }

  showConsentAndDetails() {
    this.consentService.getUserConsents(this.user.email).subscribe((res: Consent[]) => {
      console.log('This is supposed of be an Array ' + JSON.stringify(res));
      this.consents = res;
      this.consents.forEach(consent => {
        this.consentService.getProcPurpDescription(consent.ProcPurpId).subscribe((res: String) => {
          consent.ProcPurpDescription = res;
        });
      });
     });
  }


  switchConsent(consent: any) {
    if (consent.AgreeInd === '0') {
      consent.AgreeInd = '1';
    } else {
      consent.AgreeInd = '0';
    }
    this.consentService.updateConsent(consent).subscribe((res: String) => {
      console.log("Just updated consent with ConsentId " + res);
      if (consent.AgreeInd === '1') {
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
      this.showConsentAndDetails();
    });
  }

}
