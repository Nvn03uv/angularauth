import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Referenceservice {

    constructor(private http: HttpClient) { }

    postSignInUser(username: string, password: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type' : 'application/x-www-form-urlencoded'});
        const param = new HttpParams()
            .set('username', username)
            .set('password', password);
        return this.http.post('http://localhost:8080/authenticate', param, { headers: headers, responseType: 'json' });
    }

    postSignOutUser(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type' : 'application/json'});
        return this.http.post('http://localhost:8080/logout', null, { headers: headers});
    }

}