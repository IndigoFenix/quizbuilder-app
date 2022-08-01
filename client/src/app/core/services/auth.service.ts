import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { User } from '@core/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | null = null;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Trace': 'true'
    })
  }

  constructor(private httpClient: HttpClient) { }

  signup(name: string, pass: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(`${APIEndpoint}/auth/register`, JSON.stringify({ 'name': name, 'pass': pass }), this.httpOptions).subscribe({
        next: data => {
          this.user = data as User;
          if (this.user.token) {
            sessionStorage.setItem('USER_ID', this.user.id);
            sessionStorage.setItem('TOKEN', this.user.token);
            sessionStorage.setItem('USER', JSON.stringify(this.user));
          }
          resolve(this.user);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  login(name: string, pass: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(`${APIEndpoint}/auth/login`, JSON.stringify({ 'name': name, 'pass': pass }), this.httpOptions).subscribe({
        next: data => {
          this.user = data as User;
          if (this.user.token) {
            sessionStorage.setItem('USER_ID', this.user.id);
            sessionStorage.setItem('TOKEN', this.user.token);
            sessionStorage.setItem('USER', JSON.stringify(this.user));
            console.log('Set token', this.user.token);
          }
          resolve(this.user);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  public stayLoggedIn() {
    return true;
  }

  logout() {
    this.user = null;
    sessionStorage.removeItem('USER_ID');
    sessionStorage.removeItem('TOKEN');
    sessionStorage.removeItem('USER');
  }

  //This returns the current user data, unless the user should be logged out
  getUser() {
    if (this.stayLoggedIn()) {
      if (this.user) return this.user;
      else {
        const userstring = sessionStorage.getItem('USER');
        if (userstring) {
          this.user = JSON.parse(userstring) as User;
          return this.user;
        } else {
          return null;
        }
      }
    } else if (this.user) {
      this.logout();
    }
    return null;
  }
}