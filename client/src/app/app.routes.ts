import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { SignInComponent } from '@pages/signin/signin.component';
import { SignUpComponent } from '@pages/signup/signup.component';
import { PolicyComponent } from '@pages/policy/policy.component';
import { PasswordRecoveryComponent } from '@pages/password-recovery/password-recovery.component';
import { MyPostsComponent } from '@pages/my-posts/my-posts.component';
import { FavoriteComponent } from '@pages/favorite/favorite.component';
import { ChatsComponent } from '@pages/chats/chats.component';
import { SettingsComponent } from '@pages/settings/settings.component';
import { ProfileComponent } from '@pages/settings/settings-profile/settings-profile.component';
import { SecurityComponent } from '@pages/settings/security/security.component';
import { UserComponent } from '@pages/user/user.component';
import { CreatePostComponent } from '@pages/create-post/create-post.component';
import { PostComponent } from '@pages/post/post.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'create-post', component: CreatePostComponent },
  { path: 'my-posts', component: MyPostsComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'chats', component: ChatsComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'security', component: SecurityComponent },
      { path: '**', redirectTo: '/settings/profile', pathMatch: 'full' },
    ],
  },
  { path: 'policy', component: PolicyComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
