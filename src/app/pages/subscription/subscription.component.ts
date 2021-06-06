import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})

export class SubscriptionComponent implements OnInit {
	@ViewChild('form', { static: false }) subForm: NgForm;
	subscripData = { 'name': '', 'description': '', 'userType': '', 'period': '', 'amount': '','totalUser':'','totalTransaction':'', IsActive: true };
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective, { static: false })
	statusData = [{ id: true, name: 'Active' }, { id: false, name: 'Inactive' }];
	UserTypes = [{ id: 'company', name: 'Company' }, { id: 'individual', name: 'Individual' }];
	PeriodsData = [
	{ id: '1-month', name: '1 Month' }, 
	{ id: '2-month', name: '2-month' },
	{ id: '3-month', name: '3-month' },
	{ id: '6-month', name: '6-month' },
	{ id: '9-month', name: '9-month' },
	{ id: '12-month', name: '12-month' }];

	fileName= new Date().getTime()+'.xlsx'; 
	dayslist = [
        { value: 'month', name: 'Month' },
        { value: 'year', name: 'Year' },
    ];
    dayselect: any;
	datatableElement: DataTableDirective;
	subscriptionlist: any;
	requestDetail: any;
	title = 'Subscription';
	editing = false;
	submitted = false;
	startDate: any;
	endDate: any;
	constructor(public router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private commonService: CommonService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private activatedRoute: ActivatedRoute) {
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
				const responseData = this.commonService.getAllData('Subscription').pipe(first())
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
				{ data: 'description' },
				{ data: 'userType' },
				{ data: 'period' },
				{ data: 'amount' },
				{ data: 'totalUser' },
				{ data: 'totalTransaction' },
				{ data: 'active' },
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

	setform(subscripForm) {
		subscripForm.reset();
		this.submitted = false;
	}

	typeChange(event) {
		if (event.id == 'individual') {
			this.subscripData.totalUser = '';
			this.subscripData.totalTransaction = '';
		}
		this.subscripData.userType = event.id;
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
			this.commonService.UpdateData(this.subscripData, 'Subscription').pipe(first()).subscribe(data => {
					subscripForm.reset();
					if (data.code == 200) {
						this.toastr.success('', data.message);
						this.modalService.dismissAll();
						this.refreshTable();
						this.submitted = false;
					}
				},error => {
					subscripForm.reset();
					this.submitted = false;
				});
		} else {
			this.commonService.CreateData(this.subscripData, 'Subscription').pipe(first()).subscribe(data => {
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

	filterDate() {

		let obj={
			fromDate:new Date(this.startDate),
			toDate:new Date(this.endDate)
		}
		this.commonService.searchSubscription(obj).pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.subscriptionlist = response.data;
				}
			});
	}

	setDate() {
      
        if(this.dayselect=='month') {
            this.startDate = moment(new Date()).format("YYYY-MM-DD");
            var nextDay = new Date();
            nextDay.setMonth(new Date(this.startDate).getMonth() + 1);
            this.endDate = moment(nextDay).format("YYYY-MM-DD");
        }
        
        if(this.dayselect=='year') {
            this.startDate = moment(new Date()).format("YYYY-MM-DD");
            var nextDay = new Date();
            nextDay.setFullYear(new Date(this.startDate).getFullYear() + 1);
            this.endDate = moment(nextDay).format("YYYY-MM-DD");
        }
    }

	 exportexcel(): void {

        /* table id is passed over here */   
       let element = document.getElementById('record-table');
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);

    }

	editDetail(editModal, data) {
		this.commonService.getData(data, "Subscription").subscribe(response => {
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
		this.commonService.deleteData(data, "Subscription").subscribe(response => {
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
