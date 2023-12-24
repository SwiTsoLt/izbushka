import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { CreatePostComponent } from './components/pages/create-post/create-post.component';
import { NavbarComponent } from './components/UI/navbar/navbar.component';
import { FooterComponent } from './components/UI/footer/footer.component';
import { MyButtonComponent } from './components/UI/my-button/my-button.component';
import { MyInputComponent } from './components/UI/my-input/my-input.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SearchButtonComponent } from './components/UI/search-button/search-button.component';
import { ProfileButtonComponent } from './components/UI/profile-button/profile-button.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    CreatePostComponent,
    NavbarComponent,
    FooterComponent,
    MyButtonComponent,
    MyInputComponent,
    HomeComponent,
    SearchButtonComponent,
    ProfileButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
