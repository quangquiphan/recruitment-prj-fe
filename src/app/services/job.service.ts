import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

let _prefix = "/job";

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private http: HttpClient
  ) { }

  
}
