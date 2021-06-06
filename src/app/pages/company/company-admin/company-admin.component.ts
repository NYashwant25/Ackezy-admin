import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { CompanyService } from 'src/app/@core/services/company.service';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-admin',
  templateUrl: './company-admin.component.html',
  styleUrls: ['./company-admin.component.css']
})

export class CompanyAdminComponent implements OnInit {
	title = 'Company';
	value: any;
	modelData={
		name:'',
		email:'',
		phone:'',
		description:'',
	};

	constructor(
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private formService: FormService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private activeRoute: ActivatedRoute,
		private companyService: CompanyService,
		private router: Router) { 

		// this.activeRoute.params.subscribe(params => {
		this.value = localStorage.getItem('companyId');
		this.GetCompany(this.value);
		// });		
  	}

	ngOnInit() {}

  	GetCompany(id){
	  this.companyService.getData(id).subscribe((res: any) => {
		  this.modelData = res.data;
	  })
  	}

	createUser() {



	}

}
