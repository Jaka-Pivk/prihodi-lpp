import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Article }  from "./primerjevalnik/article";
import {catchError, retry} from "rxjs/operators";
import {Station} from "./primerjevalnik/station";
import {StationCode} from "./stationCode";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  art = new Article()

  // URL which returns list of JSON items (API end-point URL)
  private readonly URL = 'http://127.0.0.1:8080';

  constructor(private http: HttpClient) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  addPosition(data): Observable<Station> {
    return this.http.post<Station>(this.URL + '/position', data, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getStations(): Observable<any>{
    return this.http.get<any>(this.URL + '/nearbyStations')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  arrivalOnStation(): Observable<any>{
    return this.http.get<any>(this.URL + '/arrivalOnStations', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  arrivalOnSpecificStation(data): Observable<any>{
    return this.http.get<any>(this.URL + '/arrivalOnSpecificStation?code='+data, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
