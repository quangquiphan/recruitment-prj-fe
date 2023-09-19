import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import HttpResponse from '../model/http.response.model';

let _prefix = "/user-job";

@Injectable({
  providedIn: 'root'
})
export class UserJobService {

  constructor(
    private http: HttpClient
  ) { }

  getJobsAlppied() :Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/history`).pipe(
      map(
        result => {
          return result
      })
    )
  }

  deleteJobsAlppied(id: string) :Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${_prefix}/${id}`).pipe(
      map(
        result => {
          return result
      })
    )
  }
}
