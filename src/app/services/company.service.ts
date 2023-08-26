import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import HttpResponse from '../model/http.response.model';

let _prefix = "/company"

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http: HttpClient
  ) { }

  getAllCompany(params: any): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}`, {params}).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }

  getCompany(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/${id}`).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }
}
