import { HttpClientModule } from '@angular/common/http';
import { Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User = new User();

  topUsers: User[];

  constructor( private authService: AuthService,
                 ) {}

  ngOnInit() {
    this.authService.getTopScore().subscribe((data: any[] ) => {
      this.topUsers = data;
    });
    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
        });
  }
}
