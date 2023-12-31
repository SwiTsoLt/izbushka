import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';
import { PolicyComponent } from './components/pages/policy/policy.component';
import { PasswordRecoveryComponent } from './components/pages/password-recovery/password-recovery.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'password-recovery', component: PasswordRecoveryComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
