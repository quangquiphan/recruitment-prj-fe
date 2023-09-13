import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let _prefix = "/candidate"

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    private http: HttpClient
  ) { }

  downloadPDF(id: string): Observable<Blob> {
    return this.http.get<Blob>(`${_prefix}/download/${id}`, {responseType: 'blob' as 'json'});
  }
}
