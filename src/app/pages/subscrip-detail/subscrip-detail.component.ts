import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { UserService } from 'src/app/@core/services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-subscrip-detail',
  templateUrl: './subscrip-detail.component.html',
  styleUrls: ['./subscrip-detail.component.css']
})

export class SubscripDetailComponent implements OnInit {

	@ViewChild('form', { static: false }) subForm: NgForm;
	
	subscripData = {
		userid:'',
		companyId: '',
		subscriptionId: '',
		subscriptionstartDate: new Date(),
		subscriptionendDate: new Date(),
		Period:'',
		amount: '',
		transactionId: '',
		transactionStatus: '',
		paymentType: '',
		referenceCode: '',
		description: '',
		cardNumber: '',
		cardName: '',
		cardType: '',
		cardexpiredate: ''
	};

	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;
	subscriptionlist: any;
	requestDetail: any;
	companyList: any;
	subscrptionList: any;
	userlist: any;
	title = 'Subscription of Company';
	editing = false;
	submitted = false;
	constructor(public router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private commonService: CommonService,
		private userService: UserService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private activatedRoute: ActivatedRoute) {
		this.getUsers()
		this.getallCompany()
		this.getallSubscription()
	}

	ngOnInit() {
		const that = this;
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
				const responseData = this.commonService.SubscribedCom().pipe(first())
					.subscribe(response => {
						if (response.code === 200) {
							this.subscriptionlist = response.data;
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
				{ data: 'email' },
				{ data: 'subscriptionStart' },
				{ data: 'subscriptionEnd' },
				{ data: 'subscriptionStatus' },
				// { data: '_id' }
				],
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

	getUsers() {
		this.userService.getCompanyAdmin({ companyuser: 'Company-Admin' }).pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.userlist = response.data;
				}
			});
	}

	setform(subscripForm) {
		subscripForm.reset();
		this.submitted = false;
	}

	typeChange(subscriptionId) {
		this.commonService.getData(subscriptionId, "Subscription").subscribe(response => {
			this.subscripData.Period = response.data.period;
			this.subscripData.amount = response.data.amount;
			var letfirst = response.data.period.split('-');
			this.subscripData.subscriptionstartDate = new Date() 
			this.subscripData.subscriptionendDate = new Date(new Date().setMonth(parseInt(letfirst[0])+1));

		},error => {}
		);
	}

	getallCompany() {
		this.commonService.getAllData('Company').pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.companyList = response.data;
				}
			});
	}

	getallSubscription() {
		this.commonService.getAllData('Subscription').pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.subscrptionList = response.data;
				}
			});
	}

	getCompany(userid){
		this.userService.getCompanyAdmin({ companyuser: 'Company-Admin' }).pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.userlist = response.data;
				}
			});
	}

	addEditSubs(subscripForm) {
		if (subscripForm.form.status == 'INVALID') {
			Object.keys(subscripForm.controls).forEach(key => {
				subscripForm.controls[key].markAsDirty();
			});
			return false;
		}

		this.submitted = true;

		if (this.editing == true) {
			this.commonService.SubscripbCompany(this.subscripData, 'SubscriptionDetails').pipe(first()).subscribe(data => {
				subscripForm.reset();
				if (data.code == 200) {
					this.toastr.success('', data.message);
					this.modalService.dismissAll();
					this.refreshTable();
					this.submitted = false;
				}
			}, error => {
				subscripForm.reset();
				this.submitted = false;
			});
		} else {
			this.commonService.SubscripbCompany(this.subscripData, 'SubscriptionDetails').pipe(first()).subscribe(data => {
				subscripForm.reset();
				if (data.code === 200) {
					this.toastr.success('', data.message);
					this.modalService.dismissAll();
					this.refreshTable();
					this.submitted = false;
				}
			},
				error => {
					subscripForm.reset();
					this.submitted = false;
				});
		}
	}

	editDetail(editModal, data) {
		this.commonService.getData(data, "SubscriptionDetails").subscribe(response => {
			this.requestDetail = response.data;
			this.subscripData = response.data;
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
		this.commonService.deleteData(data, "SubscriptionDetails").subscribe(response => {
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


	setsubmit() {
		// this.submitted = false;
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
				console.log(error);
			});
	}

}
