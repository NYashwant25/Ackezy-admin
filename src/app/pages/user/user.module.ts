import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NgxCsvParserModule } from 'ngx-csv-parser';

const COMPONENTS = [
	UserComponent,
	ListComponent,
];

@NgModule({
	imports: [ThemeModule, UserRoutingModule, NgDatepickerModule, DpDatePickerModule, NgxCsvParserModule],
	declarations: [...COMPONENTS],
})
export class UserModule { }
