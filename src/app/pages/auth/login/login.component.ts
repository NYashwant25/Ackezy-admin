import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/@core/validators/must-match.validators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { first } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    submitted = false;
    validator = environment.validators;
    returnUrl = '/dashboard';
    error = false;
    passwordHidden = true;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService) {
        const observable = new Observable(() => {
            console.log('I was called!');
        });
    }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, ValidEmail]],
            password: ['', [Validators.required]],
        }, {
            //validator: MustMatch('password', 'confirmPassword')
        });
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['returnUrl']) {
                this.returnUrl = params['returnUrl'];
            }
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {

        //this.toastr.success('Hello world!', 'Toastr fun!');
        this.error = false
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.authenticationService.login(this.f.username.value, this.f.password.value).pipe(first()).subscribe(data => {
                if (data.code === 200) {
                    if (data.data.user.userType == 'Company-Admin' || data.data.user.userType == 'Manager') {
                        this.router.navigate(['/company/company-admin']);
                    } else {
                        this.router.navigate([this.returnUrl]);
                    }
                } else {
                    this.error = true;
                }
            },
            error => {
                this.error = error;
            });
    }

    togglePassword() {
        this.passwordHidden = !this.passwordHidden
    }

}
