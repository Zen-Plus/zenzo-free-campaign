import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) { }

  addPrimaryMember(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + environment.apiver + environment.memberEndpoint, data);
  }

  addFamilyMembers(data: any, primaryMemberId: any): Observable<any> {
    return this.http.post(environment.baseUrl + environment.apiver + environment.memberEndpoint + primaryMemberId + environment.familyEndpoint, data);
  }
}
