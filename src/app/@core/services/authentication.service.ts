import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    public currentUserSubject: BehaviorSubject < User > ;
    public currentUserToken: BehaviorSubject < string > ;
    public currentUser: Observable < User > ;

    constructor(private http: HttpClient, private router: Router) {

        this.currentUserSubject = new BehaviorSubject < User > (JSON.parse(localStorage.getItem('corporateUser')));
        this.currentUserToken = new BehaviorSubject < string > (localStorage.getItem('userToken'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get userToken(): string {
        return this.currentUserToken.value;
    }

    public expiryCheck(value) {}

    login(email: string, password: string) {

        return this.http.post < any > (`${environment.apiUrl}/user/login/admin`, { email, password })
            .pipe(map(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if (response.code === 200) {
                    localStorage.setItem('corporateUser', JSON.stringify(response.data.user));
                    localStorage.setItem('userToken', response.data.token);
                    localStorage.setItem('userId', response.data.user._id);
                    if (response.data.user.userType == 'Company-Admin' || response.data.user.userType == 'Manager') {
                        localStorage.setItem('companyId', response.data.user.companyID);
                    }
                    this.currentUserSubject.next(response.data.user);
                    this.currentUserToken.next(response.data.token);
                }
                return response;
            }));
    }

    profileUpdate(profileUpdate) {

        return this.http.post < any > (`${environment.apiUrl}/user/update`, profileUpdate)
            .pipe(map(response => {
                const result = response.data;
                if (response.status === 'success') {
                    localStorage.setItem('corporateUser', JSON.stringify(response.data.user));
                    this.currentUserSubject.next(response.data.user);
                    // setTimeout(() => {
                    //     if (result.oldemail != result.user.email) {
                    //         console.log('Email not same');
                    //         this.logout();
                    //         this.router.navigate(['/login']);
                    //     }
                    // }, 500);
                }

                return response;
            }));
    }

    getSubscriptions(companyId) {
        return this.http.get < any > (`${environment.apiUrl}/packagedetails`)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                }
                return response;
            }));
    }

    changePassword(passwordField) {
        return this.http.post < any > (`${environment.apiUrl}/user/changePassword`, passwordField)
            .pipe(map(response => {
                return response;
            }));
    }

    forgotPasword(email: string) {

        return this.http.post < any > (`${environment.apiUrl}/forgot-password`, { email })
            .pipe(map(response => {
                console.log(response)
                return response;
            }));
    }

    resetPasword(dataValues) {
        return this.http.post < any > (`${environment.apiUrl}/reset-password`, dataValues)
            .pipe(map(response => {
                console.log(response);
                return response;
            }));
    }

    checkResetToken(token: string) {
        return true;
        return this.http.post < any > (`${environment.apiUrl}/check-reset-token`, { token })
            .pipe(map(response => {
                if (response.status === 'success') {
                    return true;
                }
                return false;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('corporateUser');
        localStorage.removeItem('userToken');
        localStorage.removeItem('companyId');
        localStorage.removeItem('userId');
        this.currentUserSubject.next(null);
        this.currentUserToken.next(null);
    }
}
