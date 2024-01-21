import { Injectable } from '@angular/core';
import { SignInDTO, SignInResponseDTO } from '../../../dtos/auth.dto';
import { Observable } from 'rxjs';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private httpService: HttpService) { }

  signIn(signInDTO: SignInDTO): Observable<SignInResponseDTO | null> {
      return this.httpService.post<SignInResponseDTO | null>('/api/auth/signin/', signInDTO);
  }
}
