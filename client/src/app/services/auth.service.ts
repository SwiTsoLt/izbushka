import { Injectable } from '@angular/core';
import {
  SignInDTO,
  SignInResponseDTO,
  SignUpDTO,
  SignUpResponseDTO,
} from '../dtos/auth.dto';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService) { }

  public signIn(signInDTO: SignInDTO): Observable<SignInResponseDTO> {
    return this.httpService.post('/api/auth/signin/', signInDTO);
  }

  public signUp(signUpDTO: SignUpDTO): Observable<SignUpResponseDTO> {
    return this.httpService.post('/api/auth/signup', signUpDTO);
  }
}
