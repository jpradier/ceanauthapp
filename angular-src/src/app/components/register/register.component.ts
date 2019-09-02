import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Injectable } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {User} from '../../models/user.model';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

@Injectable()
export class RegisterComponent implements OnInit {

  //user: User;
  name: string;
  email: string;
  username: string;
  password: string;
  toggle: boolean = false;
  agree: boolean = false;




  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private httpClient: HttpClient
    ) {}


  ngOnInit() {
    console.log('helloooooo');
  }

  toggleForm() {
    this.toggle = true;
  }


  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }
   //this.user = new User();


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
        console.log('helooooo');
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


   // this.agree ? '1' : '0',

  // Add General Consent
  onSaveGeneralConsent() {
    const obj = { 'TCRMService': {
        '@schemaLocation': 'http:\/\/www.ibm.com\/mdm\/schema MDMDomains.xsd',
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
    .put('/api/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful', obj, httpOptions)
    .subscribe(data => {
        console.log( 'les donnes de retour de la requete : ' + data);
    }, error => {
      console.log('les erreurs : ' + error);
    });
  }
}
