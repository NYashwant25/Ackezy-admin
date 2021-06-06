import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CompanyRequestFormComponent } from './company-request-form/company-request-form.component';
import { ProfileComponent } from './profile/profile.component';
import { PackageComponent } from './package/package.component';
import { CountryComponent } from './country/country.component';
import { AccountComponent } from './account/account.component';
import { ComDepartmentComponent } from './com-department/com-department.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { DocumentComponent } from './document/document.component';
import { PromoCodeComponent } from './promo-code/promo-code.component';
import { TypeComponent } from './type/type.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SubscripDetailComponent } from './subscrip-detail/subscrip-detail.component';
import { DateTimePickerModule} from 'ngx-datetime-picker';
import { SendnotificationComponent } from './sendnotification/sendnotification.component';


const COMPONENETS = [PagesComponent,
                    DashboardComponent,
                    NotFoundComponent,
                    LoginComponent,
                    ForgotPasswordComponent,
                    ResetPasswordComponent,
                    CompanyRequestFormComponent,
                    ProfileComponent,
                    PackageComponent,
                    CountryComponent,
                    AccountComponent,
                    ComDepartmentComponent,
                    SubscriptionComponent,
                    DocumentComponent,
                    PromoCodeComponent,
                    TypeComponent,
                   
                ];

@NgModule({
    declarations: [...COMPONENETS, SubscripDetailComponent, SendnotificationComponent, ],
    imports: [
        PagesRoutingModule,
        DateTimePickerModule,
        ThemeModule,
        DpDatePickerModule
    ]
})
export class PagesModule { }
