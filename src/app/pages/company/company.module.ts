import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { CompanyDepartmentComponent } from './company-department/company-department.component';

const components = [
    CompanyComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, CompanyRoutingModule ],
  declarations: [...components, CompanyAdminComponent, CompanyUsersComponent, CompanyDepartmentComponent],
})
export class CompanyModule {}
