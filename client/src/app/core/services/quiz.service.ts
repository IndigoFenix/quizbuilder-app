import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Quiz } from '@core/models/quiz';
import { Question } from '@core/models/question';
const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Trace': 'true'
    })
  }

  constructor(private httpClient: HttpClient) { }

  get(id: string): Promise<Quiz> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${APIEndpoint}/quiz/${id}`, this.httpOptions).subscribe({
        next: data => {
          resolve(data as Quiz);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }

  getAnswers(id: string): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${APIEndpoint}/quiz/${id}/answers`, this.httpOptions).subscribe({
        next: data => {
          resolve(data as Question[]);
        },
        error: data => {
          reject(data.error.message);
        }
      });
    });
  }
}