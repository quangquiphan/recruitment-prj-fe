import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import HttpResponse from '../model/http.response.model';

let _prefix = "/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  signUp(params: any): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${_prefix}`, params).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }

  verifyEmail(activeCode: string): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${_prefix}/verify-email/${activeCode}`, {}).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }

  getUser(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${_prefix}/${id}`).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }

  updateUser(id: string, params: any): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${_prefix}/${id}`, params).pipe(
      map(
        result => {
          return result;
        }
      )
    )
  }

  applyJob(params: any) : Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${_prefix}/apply`, params).pipe(
      map(
        result => {
          return result
        }
      )
    )
  }
  
  uploadAvatar(id: string, file: File):Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('PUT', `${_prefix}/upload-avatar/${id}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });    

    return this.http.request(req);
  }
  
  uploadCV(id: string, file: File):Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('PUT', `${_prefix}/upload-cv/${id}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });    

    return this.http.request(req);
  }
}
