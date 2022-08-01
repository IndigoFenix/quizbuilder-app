import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Quiz } from '@core/models/quiz';
const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class QuizAdminService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Trace': 'true'
    })
  }

  constructor(private httpClient: HttpClient) { }

  create(data: Quiz): Promise<Quiz> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(`${APIEndpoint}/quiz-admin`, JSON.stringify(data), this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  all(): Promise<Quiz[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${APIEndpoint}/quiz-admin/`, this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz[]);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  get(id: string): Promise<Quiz> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${APIEndpoint}/quiz-admin/${id}`, this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  update(id: string, data: Quiz): Promise<Quiz> {
    return new Promise((resolve, reject) => {
      this.httpClient.patch(`${APIEndpoint}/quiz-admin/${id}`, JSON.stringify(data), this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  publish(id: string): Promise<Quiz> {
    return new Promise((resolve, reject) => {
      this.httpClient.patch(`${APIEndpoint}/quiz-admin/${id}`, JSON.stringify({'published': true}), this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  delete(id: string): Promise<Quiz> {
    return new Promise((resolve, reject) => {
      this.httpClient.delete(`${APIEndpoint}/quiz-admin/${id}`, this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }
}