import { ConsentService } from './../../services/consent.service';
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

  user: User = new User();
  toggle: Boolean = false;
  agree: Boolean = false;






  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private consentService: ConsentService
    ) {}


  ngOnInit() {

  }
  toggleForm() {
    this.toggle = true;
  }


  onRegisterSubmit() {

    // Required Field
    if (!this.validateService.validateRegister(this.user)) {
      this.flashMessage.show('Please fill in all fields', {
        cssClass: 'alert-danger',
        timeout: 3000
      });
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(this.user.email)) {
      this.flashMessage.show('Please provide a valid email', {
        cssClass: 'alert-danger',
        timeout: 3000
      });
      return false;
    }

    // Assign random score
    this.user.score = Math.floor(Math.random() * 100);

    // Assign random portrait img
    this.user.img = 'https://i.pravatar.cc/300?u=' + this.user.email;

    // Register User
    this.authService.registerUser(this.user).subscribe(data => {
      if (data.success) {
        if (this.agree === true) {
          this.consentService.addGeneralConsent(this.user.email, this.agree).subscribe((res: String) => {
            console.log('consent added' + res);
            this.flashMessage.show('You are now registered and can log in', {
            cssClass: 'alert-success',
            timeout: 3000
            });
            this.router.navigate(['/login']);
          });
            } else {
            this.flashMessage.show('Something went wrong', {
              cssClass: 'alert-danger',
              timeout: 3000
          });
          this.router.navigate(['/register']);
          }
        }
      });
  }
}
