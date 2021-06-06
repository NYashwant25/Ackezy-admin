import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { CompanyRequestService } from 'src/app/@core/services/company-request.service';
import { DataTableDirective } from 'angular-datatables';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { NgbModal, NgbModalConfig, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from 'src/app/@core/services/company.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})

export class TypeComponent implements OnInit {

	@ViewChild('form', { static: false }) typeForm: NgForm;
	promoData = {
		name: '',
		companyId: '',
		userId: ''
	};

	dtOptions: DataTables.Settings = {};
	statusData = [{ id: true, name: 'Active' }, { id: false, name: 'Inactive' }];
	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;
	promolist: any;
	requestDetail: any;
	startDate: any;
	companyList: any;
	userList: any;
	endDate: any;
	title = 'Document Type';
	editing = false;
	submitted = false;

	constructor(public router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private commonService: CommonService,
		private companyrequestService: CompanyRequestService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private companyService: CompanyService,
		private config: NgbDatepickerConfig,
		private activatedRoute: ActivatedRoute) {
		this.getCompany();
		this.getUser();
	}

	ngOnInit() {
		this.dtOptions = {
			dom: `<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
            "<'row'<'col-sm-12'tr>>"
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
			pagingType: 'simple_numbers',
			renderer: 'bootstrap',
			pageLength: 10,
			serverSide: true,
			processing: true,
			ajax: (dataTablesParameters: object, callback) => {
				const responseData = this.companyrequestService.getType().pipe(first())
					.subscribe(response => {
						if (response.code === 200) {
							this.promolist = response.data;
							callback({
								recordsTotal: response.data.length,
								recordsFiltered: response.data.length,
								data: []
							});
						}
					});
			},
			columns: [
				{ data: 'name' },
				{ data: 'companyId' },
				{ data: 'userId' },
				{ data: '_id' }],
			columnDefs: [
				{
					searchable: false,
					orderable: false,
					targets: [-1]
				},
				{
					searchable: false,
					targets: [-2]
				}
			]
		};
	}

	getCompany() {
		this.companyService.getList({}).pipe(first()).subscribe(response => {
			if (response.code === 200) {
				this.companyList = response.data;
			}
		});
	}

	getUser() {
		this.commonService.getAllData('User').pipe(first()).subscribe(response => {
			if (response.code === 200) {
				this.userList = response.data;
			}
		});
	}

	updateRequest(departForm) {

		if (departForm.form.status == 'INVALID') {
			return;
		}

		this.submitted = true;

		if (this.editing == true) {
			this.commonService.UpdateData(this.promoData, 'Type')
				.pipe(first())
				.subscribe(
					data => {
							departForm.reset();
						if (data.code === 200) {
							this.toastr.success('', data.message);
							this.modalService.dismissAll();
							this.refreshTable();
							this.submitted = false;
						}

					},
					error => {
						this.submitted = false;
					},
					() => {
						this.submitted = false;
					});
		} else {
			this.commonService.CreateData(this.promoData, 'Type')
				.pipe(first())
				.subscribe(
					data => {
							departForm.reset();
						if (data.code === 200) {
							this.toastr.success('', data.message);
							this.modalService.dismissAll();
							this.refreshTable();
							this.submitted = false;
						}

					},
					error => {
						this.submitted = false;
					},
					() => {
						this.submitted = false;
					});
		}
	}

	editDetail(editModal, data) {
		this.commonService.getData(data, "Type").subscribe(response => {
			this.requestDetail = response.data;
			this.promoData = response.data;
			this.editing = true;
			this.modalService.open(editModal, {
				size: 'lg'
			});
		},
			error => {
				// this.noti
			}
		);
	}

	deleteRequest(data) {
		this.commonService.deleteData(data, "Type").subscribe(response => {
			this.modalService.dismissAll();
			this.toastr.success('', response.message);
			this.refreshTable();
		},
			error => {
				this.modalService.dismissAll();
				// this.noti
			}
		);
	}

	refreshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	createData(modal) {
		this.requestDetail = {
			name: ''
		}
		this.editing = false;
		this.modalService.open(modal, {
			size: 'lg'
		});
	}

	deleteConfirmation(data) {
		const modalRef = this.modalService.open(DeleteModalComponent);
		modalRef.componentInstance.data = data;
		modalRef.result.then((result) => {
			if (result) {
				this.deleteRequest(result);
			}
		},
			(error) => {

			});
	}


	// name
	// companyId
	// userId

  // ngOnInit() {
  // }

}
