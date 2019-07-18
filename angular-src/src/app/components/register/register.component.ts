import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Injectable } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Consent } from 'src/app/models/consent.model';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

@Injectable()
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;
  toggle: boolean = false;

  consents: Consent[] = new Array();



  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private httpClient: HttpClient) {}


  ngOnInit() {
    this.getConsents();
  }
  toggleForm() {
    this.toggle = true;
  }
  getConsents() {
    const consent1: Consent = new Consent();
    consent1.id = '436353041082491625';
    consent1.name = 'Consent for Campaign Raffle';
    consent1.description = 'I give my consent to receive promotionnal information about Products and Services of ACME Corporation';
    this.consents.push(consent1);

    const consent2: Consent = new Consent();
    consent2.id = '682253041084546378';
    consent2.name = 'Consent for Promotions';
    consent2.description = 'I give my consent so that my data may be transferred to receive commercial information from collaborating third parties';
    this.consents.push(consent2);

    const consent: Consent = new Consent();
    consent.id = '697653041086558854';
    consent.name = 'Consent for Data Sharing to Third Parties';
    consent.description = 'I want to participate in the spring 2018 compaign raffle';
    this.consents.push(consent);
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Required Field
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', {
        cssClass: 'alert-danger',
        timeout: 3000
      });
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please provide a valid email', {
        cssClass: 'alert-danger',
        timeout: 3000
      });
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.onSaveGeneralConsent();
        this.flashMessage.show('You are now registered and can log in', {
          cssClass: 'alert-success',
          timeout: 3000
        });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', {
          cssClass: 'alert-danger',
          timeout: 3000
        });
        this.router.navigate(['/register']);

      }
    });
  }

  onSaveGeneralConsent() {
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
              'ConsentOwnerId': this.email,
              'ProcPurpId': '728153040827580997',
              'AgreeInd': '1',
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
        'Authorization': 'Basic bWRtYWRtaW46bWRtYWRtaW4='
      })
    };
    this.httpClient
    .put('http://mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
    .subscribe(data => {
        console.log( 'les donnes de retour de la requete : ' + data);
    }, error => {
      console.log('les erreurs : ' + error);
    });
  }
}
