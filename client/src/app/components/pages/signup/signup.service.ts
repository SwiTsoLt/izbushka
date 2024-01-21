import { Injectable } from '@angular/core';
import { SignUpDTO, SignUpResponseDTO } from '../../../dtos/auth.dto';
import { Observable } from 'rxjs';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {

  constructor(private httpService: HttpService) { }

    public signUp(signUpDTO: SignUpDTO): Observable<SignUpResponseDTO | null> {
      return this.httpService.post<SignUpResponseDTO | null>('/api/auth/signup', signUpDTO)
    }

}
