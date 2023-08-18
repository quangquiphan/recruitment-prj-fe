import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import HttpResponse from '../model/http.response.model';

let _prefix = "/language";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private http: HttpClient
  ) { }

  getAllLang(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}`).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }
}
