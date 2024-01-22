import { Injectable } from "@angular/core";
import { SignInDTO, SignInResponseDTO, SignUpDTO, SignUpResponseDTO } from "../dtos/auth.dto";
import { Observable, map } from "rxjs";
import { HttpService } from "./http.service";
import { HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    constructor(private httpService: HttpService) { }

    public signIn(signInDTO: SignInDTO): Observable<SignInResponseDTO | null> {
        return this.httpService.post<SignInResponseDTO | null>('/api/auth/signin/', signInDTO).pipe(
            map((response: HttpResponse<SignInResponseDTO | null>) => response.body)
        );
    }

    public signUp(signUpDTO: SignUpDTO): Observable<SignUpResponseDTO | null> {
        return this.httpService.post<SignUpResponseDTO | null>('/api/auth/signup', signUpDTO).pipe(
            map((response: HttpResponse<SignUpResponseDTO | null>) => response.body)
        );
      }
  }