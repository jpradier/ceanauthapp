import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Http ,HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService} from './services/validate.service';
import { AuthService} from './services/auth.service';
import { FlashMessagesModule} from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { ConsentComponent } from './components/consent/consent.component';
import { ConsentGeneralComponent } from './components/consent-general/consent-general.component';
//import { JwtHelperService } from '@auth0/angular-jwt';

const appRoutes: Routes = [
  { path:'', component: HomeComponent},
  { path:'register', component: RegisterComponent},
  { path:'login', component: LoginComponent},
  { path:'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path:'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ConsentComponent,
    ConsentGeneralComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot()
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
