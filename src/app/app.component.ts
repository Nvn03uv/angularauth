import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { Observable } from 'rxjs';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
   isLoggedIn$ : Observable<boolean>;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    ngOnInit(){
        this.isLoggedIn$ = this.authenticationService.isLoggedIn;
        if(window.addEventListener){
            window.addEventListener('storage', (e)=>{
                console.log(`${e.key} : ${e.oldValue} => ${e.oldValue}`);
                this.authenticationService.isAuthennticated();
                this.isLoggedIn$ = this.authenticationService.isLoggedIn;
                if(e.key === 'userName'){
                    if(e.newValue){
                        this.router.navigate(['/']);
                    }else{
                        this.router.navigate(['/logout']);
                    }
                }
            })
        }
    }

    logout() {
        this.authenticationService.logout();
       // location.reload(true);
       this.router.navigate(['/login'], { state: { action: 'logout' } });
       // this.router.navigate(['/login?logout']);
    }
} 