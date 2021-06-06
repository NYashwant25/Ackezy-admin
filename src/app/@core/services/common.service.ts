import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { Package } from '../models/package.model';
import { UserType } from '../models/user-type.model';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    public countryList: BehaviorSubject<Country[]>;
    public userTypeList: BehaviorSubject<UserType[]>;
    public packageList: BehaviorSubject<Package[]>;
    public currencyList: BehaviorSubject<Currency[]>;

  constructor(private http: HttpClient) {
    this.countryList = new BehaviorSubject<Country[]>([]);
    this.packageList = new BehaviorSubject<Package[]>([]);
    this.userTypeList = new BehaviorSubject<UserType[]>([]);
    this.currencyList = new BehaviorSubject<Currency[]>([]);
  }

    getAllData(data) {   
        return this.http.get<any>(`${environment.adminUrl}/common/${data}`, {  })
            .pipe(map(response => {
                return response;
            }));
    }

    CreateData(fields: any,model) {
        return this.http.put<any>(`${environment.apiUrl}/common/${model}`, fields)
        .pipe(map(response => {
            return response;
        }));
    }

    SubscripbCompany(fields: any,model) {
        return this.http.post<any>(`${environment.apiUrl}/company/subscribe`, fields)
        .pipe(map(response => {
            return response;
        }));
    }

    SubscribedCom() {
        return this.http.get<any>(`${environment.apiUrl}/company/already/subscribe`)
        .pipe(map(response => {
            return response;
        }));
    }

    sendNotification(data) {
        console.log("data",data);
        return this.http.post<any>(`${environment.apiUrl}/user/send/notification`,data)
        .pipe(map(response => {
            return response;
        }));
    }


    UpdateData(fields: any, model) {
        return this.http.post<any>(`${environment.apiUrl}/common/${model}`, fields)
            .pipe(map(response => {
                return response;
            }));
    }

    getData(data,model) {
        return this.http.get<any>(`${environment.apiUrl}/common/${model}/${data}`)
        .pipe(map(response => {
            return response;
        }));
    }

    deleteData(data,model) {
        return this.http.delete<any>(`${environment.apiUrl}/common/${model}/${data}`)
        .pipe(map(response => {
            return response;
        }));
    }

    searchSubscription(data) {
        return this.http.post<any>(`${environment.apiUrl}/dashboard/subscription/search`,data)
        .pipe(map(response => {
            return response;
        }));
    }

    getCurrencyData() {
    return this.http.get<any>(`${environment.adminUrl}/currency-data?get=all`, {})
        .pipe(map(response => {

            if (response.status === 'success') {

                this.currencyList.next(response.data);
            }
            return response;
        }));
    }

    getUserTypeData() {

        return this.http.get<any>(`${environment.apiUrl}/user/type?get=all`, {})
            .pipe(map(response => {

                if (response.status === 'success') {

                    this.userTypeList.next(response.data);
                }
                return response;
            }));
    }

    getDashboardData() {

        return this.http.get<any>(`${environment.apiUrl}/dashboard/count`, {})
        .pipe(map(response => {

            return response;
        }));
    }

    getCountryList(): Observable<Country[]> {
        return this.countryList.asObservable();
    }
    getUserTypeList(): Observable<UserType[]> {
        return this.userTypeList.asObservable();
    }
    getPackageList(): Observable<Package[]> {
        return this.packageList.asObservable();
    }
    getCurrencyList(): Observable<Currency[]> {
        return this.currencyList.asObservable();
    }

    submitRequestForm(fields: any) {
        return this.http.post<any>(`${environment.apiUrl}/request-form`, fields)
        .pipe(map(response => {

            return response;
        }));
    }
}
