import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'

})
export class RestService {

  constructor(private http: HttpClient) { }
  endpoint = 'http://localhost:8000';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  private extractData(res: Response) {
    let body = res;
    console.log(res)
    return body || {};
  }
  getRooms() {
    return this.http.get(this.endpoint + '/users/roomInfo').pipe(
      map(this.extractData));
  }

  searchSlots(data): Observable<any> {
    return this.http.post(this.endpoint + '/users/search?floor=' + data.floor + '&location=' + data.location + '&Date=' + data.Date + '&startTime=' + data.startTime + '&endTime=' + data.endTime, this.httpOptions).pipe(
      map(this.extractData))
  }

  login(data): Observable<any> {
    return this.http.post(this.endpoint + '/authenticate', JSON.stringify(data), this.httpOptions).pipe(
      map(this.extractData))
  }

  booking(data): Observable<any> {
    return this.http.post(this.endpoint + '/users/roomBooking', JSON.stringify(data), this.httpOptions).pipe(
      map(this.extractData))
  }

  history(data): Observable<any> {
    return this.http.get(this.endpoint + '/users/history?user=' + data).pipe(
      map(this.extractData))
  }

  cancelBookings(data): Observable<any> {
    return this.http.get(this.endpoint + '/users/cancelBooking?id=' + data).pipe(
      map(this.extractData))
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
