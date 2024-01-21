import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { SignInComponent } from './components/pages/signin/signin.component';
import { SignUpComponent } from './components/pages/signup/signup.component';
import { PolicyComponent } from './components/pages/policy/policy.component';
import { PasswordRecoveryComponent } from './components/pages/password-recovery/password-recovery.component';
import { MyPostsComponent } from './components/pages/my-posts/my-posts.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'signin', component: SignInComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'my-posts', component: MyPostsComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'password-recovery', component: PasswordRecoveryComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
