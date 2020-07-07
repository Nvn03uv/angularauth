import { Injectable, RootRenderer } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Referenceservice } from './referance-data.service';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private loggedIn = new BehaviorSubject<boolean>(false);

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    userName: String = null;

    constructor(private router: Router, private refranceservice: Referenceservice,) {
        this.getToken();
    }

    signInUser(userName: string, password: string) {
        this.refranceservice.postSignInUser(userName, password).subscribe((result: any) => {
            console.log('in authentication after login');
            if (result) {
                this.userName = result.userName;
                console.log('this.userName' + this.userName);
                console.log('result.userName' + result.userName);
                localStorage.setItem('userName', result.username);
                this.loggedIn.next(true);
                console.log('reaching to navigate');
                this.router.navigate(['/']);
            } else {
                location.reload(true);
            } 
        },
            (error) => {
                console.log('in errorpart after login');
            })
    }

    logout() {
        this.refranceservice.postSignOutUser().subscribe((result: any) => {

            console.log('in logout method');
            this.loggedIn.next(false);
            this.userName = null;
            localStorage.removeItem('userName');
            this.router.navigate(['/login'])
        },
            (error) => {

            })
    }

    getToken() {
        if (localStorage) {
            if (localStorage.getItem('userName')) {
                if (localStorage.getItem('userName') !== undefined) {
                    this.loggedIn.next(true);
                    this.userName = localStorage.getItem('userName');
                } else {
                    this.loggedIn.next(false);
                    this.userName = null;
                  //  location.reload(true);
                }
            } else {
                this.userName = null;
               // location.reload(true);
            }
        } else {
            this.userName = null;
           // location.reload(true);
        }
        return this.userName;
    }

    isAuthennticated() {
        this.getToken();
        return !_.isEmpty(this.userName);
    }
}