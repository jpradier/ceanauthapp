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
   procPurposes: any[];
   consents: Consent[];
   response: any;
   agree: Boolean = false;
   // id = Math.floor(Math.random() * 6) + 1;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private consentService: ConsentService,

  ) {}

  ngOnInit() {

    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
      this.getAllProcessingPurposes();
    });
  }

  getAllProcessingPurposes() {
    this.consentService.getAllProcessingPurpose().subscribe((res: any[]) => {
      this.procPurposes = res;
      this.procPurposes.forEach(procPurp => {
        // placeholder --> get consent for each processing purposes
        this.consentService.getUserConsentsByProcPurp(this.user.email, procPurp.ProcPurpId).subscribe((consents: any[]) => {
          procPurp.currentConsent = consents.pop();
          procPurp.historicalConsents = consents;
          console.log(this.procPurposes);
          console.log('this is the current consent' + procPurp.currentConsent);
        });
      });
    });
  }

  addConsent(procPurpId: string) {
    this.consentService.addConsent(this.user.email, procPurpId, true).subscribe((res: String) => {
      console.log('Just added consent with ConsentId' + res);
      this.flashMessage.show('Consentement donné', {
      cssClass: 'alert-success',
      timeout: 3000
      });
      this.getAllProcessingPurposes();
    });
  }

  withdrawConsent(consent: any) {
    consent.AgreeInd = '0';
    this.consentService.updateConsent(consent).subscribe((res: String) => {
      console.log('Just updated consent with ConsentId' + res);
      this.flashMessage.show('Consentement désactivé', {
      cssClass: 'alert-danger',
      timeout: 3000
      });
      this.getAllProcessingPurposes();
    });
  }

}
