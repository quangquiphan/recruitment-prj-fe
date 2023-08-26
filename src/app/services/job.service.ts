import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import HttpResponse from '../model/http.response.model';

let _prefix = "/job";

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private http: HttpClient
  ) { }

  getAllJobBycompanyId(params: any) : Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}`, {params}).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }
  
  getJobDetail(id: string) : Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/${id}`).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }

  getAllJob() : Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/all`).pipe(
      result => {
        return result;
      }
    )
  }

  searchJob(params: any) : Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/search`, {params}).pipe(
      result => {
        return result;
      }
    )
  }

  getJobsRecommend(params: any) : Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/recommend`, {params}).pipe(
      result => {
        return result;
      }
    )
  }
}
