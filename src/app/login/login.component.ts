import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        if (this.router.getCurrentNavigation().extras.state) {
            let routeState = this.router.getCurrentNavigation().extras.state;
            if (routeState && routeState['action'] === 'logout') {
                console.log('logout action ' + routeState['action']);
                location.reload(true);
              //  this.router.navigated = false;
              //  this.router.navigate([this.router.url]);
            }
        }
        console.log('in login constructer');
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.loading = true;
        let username = this.loginForm.controls.username.value;
        let password = this.loginForm.controls.password.value;
        this.loginForm.controls.username.reset;
        this.loginForm.controls.password.reset;
        this.authenticationService.signInUser(username, password);
        username = '0';
        password = '0';
        if(this.authenticationService.isAuthennticated()){
            console.log('in if authenticated in login page');
          //  this.router.navigate(['/']);
        }
    }
}
