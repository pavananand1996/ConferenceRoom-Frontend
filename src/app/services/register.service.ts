import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  [x: string]: any;
  constructor(private http: HttpClient) { }

  addcandidate(candidate) {
    console.log(candidate)
    return this.http.post('', candidate);
  }
}
