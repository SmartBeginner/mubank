import { Injectable, inject, PLATFORM_ID } from '@angular/core';

import { enviroment } from '../enviroments/enviroment';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Data {
  private apiURL = enviroment.API_BASE_URL;
  private httpClient = inject(HttpClient);
  platformId = inject(PLATFORM_ID);

  getHttpOptions() {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    const token = isBrowser ? localStorage.getItem('token') : '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }
  //login user, password
  login(obj: any): Observable<any> {
    return this.httpClient.post(this.apiURL + 'auth/login', obj);
  }

  getCurrentUserData(): Observable<any> {
    return this.httpClient.get(this.apiURL + 'users/currentUser', this.getHttpOptions());
  }

  getDeposits(): Observable<any> {
    return this.httpClient.get(this.apiURL + 'users/deposits', this.getHttpOptions());
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get(this.apiURL + 'users', this.getHttpOptions());
  }

  getAllTransactions(): Observable<any> {
    return this.httpClient.get(this.apiURL + 'deposits', this.getHttpOptions());
  }

  createUser(obj: { login: string; password: string; role: 'USER' | 'ADMIN' }): Observable<any> {
    return this.httpClient.post(this.apiURL + 'auth/register', obj, this.getHttpOptions());
  }
}
