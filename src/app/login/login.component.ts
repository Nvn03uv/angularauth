import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import * as CryptoJS from 'crypto-js';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    // Code goes here
    keySize = 256;
    ivSize = 128;
    iterations = 1000;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        if (this.router.getCurrentNavigation().extras.state) {
            const routeState = this.router.getCurrentNavigation().extras.state;
            if (routeState && routeState.action === 'logout') {
                console.log('logout action ' + routeState.action);
              //  location.reload(true);
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
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.loading = true;

        const username = this.loginForm.controls.username.value;
        let password = this.loginForm.controls.password.value;
        this.loginForm.reset();

        console.log('encrpted ' + CryptoJS.SHA256(password));
        this.loginForm.controls.username.patchValue(username);
        this.loginForm.controls.password.patchValue(CryptoJS.SHA256(password));
        this.loginForm.updateValueAndValidity();

        console.log('encrpted AES ' + this.encrypt(password, username));
        password = this.encrypt(password, username);
        this.authenticationService.signInUser(username, password);

        if (this.authenticationService.isAuthennticated()) {
            console.log('in if authenticated in login page');
            //  this.router.navigate(['/']);
        }
    }



    encrypt(msg, pass) {

        const salt = CryptoJS.lib.WordArray.random(128 / 8);

        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations
        });

        const iv = CryptoJS.lib.WordArray.random(128 / 8);

        const encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });

        // salt, iv will be hex 32 in length
        // append them to the ciphertext for use  in decryption
        const transitmessage = salt.toString() + iv.toString() + encrypted.toString();

        console.log('salt : '+salt+'     iv : '+iv+'      encrypted : '+encrypted.toString());

        console.log('transitmessage : '+transitmessage);
        return transitmessage;
    }
}
