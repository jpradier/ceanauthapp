import { AuthService } from './../../services/auth.service';
import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  topUsers: User[];

  constructor( private authService: AuthService) { }

  ngOnInit() {
    this.authService.getTopScore().subscribe((data: any[] ) => {
      this.topUsers = data;
      console.log(this.topUsers);
    });
  }

}
