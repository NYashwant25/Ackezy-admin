import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CompanyComponent } from './company.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { CompanyGuard } from 'src/app/@core/guards/company.guard';
import { CompanyDepartmentComponent } from './company-department/company-department.component';

const routes: Routes = [{
  path: '',
  component: CompanyComponent,
  children: [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: ListComponent,
    },
    {
      path: 'company-admin',
      component: CompanyAdminComponent,
      canActivate: [CompanyGuard]
    },
    {
      path: 'company-users',
      component: CompanyUsersComponent,
      canActivate: [CompanyGuard]
    },
    {
      path: 'company-department',
      component: CompanyDepartmentComponent,
      canActivate: [CompanyGuard]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule { }
