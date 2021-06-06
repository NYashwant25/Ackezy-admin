import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { CompanyRequestService } from 'src/app/@core/services/company-request.service';
import { CompanyService } from 'src/app/@core/services/company.service';
import { DataTableDirective } from 'angular-datatables';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

	@ViewChild('form', { static: false }) docForm: NgForm;
	documentData = {
		name: '',
		status: '',
		fromUser: '',
		toUser: '',
		typeId:'',
		number: '',
		companyId: '',
		categoryId: '',
		categoryName: '',
		IsActive: true,
		id: ''
	};
	fileName= new Date().getTime()+'.xlsx'; 
	dayslist = [
        { value: 'daily', name: 'Daily' },
        { value: 'month', name: 'Month' },
        { value: 'year', name: 'Year' },
    ];
	dayselect: any;
	dtOptions: DataTables.Settings = {};
	statusData = [{ id: true, name: 'Active' }, { id: false, name: 'Inactive' }];
	DocstatusData = [
		{ id: 'cancel', name: 'Cancel' },
		{ id: 'received', name: 'Received' },
		{ id: 'on-the-way', name: 'On The Way' },
		{ id: 'initiated', name: 'Initiated' }
	];
	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;
	categoryList: any;
	catselect: any;
	requestDetail: any;
	documentList: any;
	typelist: any;
	companyList: any;
	title = 'Document';
	editing = false;
	submitted = false;
	delivererVar = false;
	tagVar = false;
	delegateVar = false;
	userList: any;
	deliverer: any;
	tag: any;
	delegate: any;
	startDate: any;
	endDate: any;

	constructor(public router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private commonService: CommonService,
		private companyrequestService: CompanyRequestService,
		private companyService: CompanyService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private activatedRoute: ActivatedRoute) {

		this.getallCategory()
		this.getUser();
		this.getCompany();
		this.getType();
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
				const responseData = this.companyrequestService.getDocument().pipe(first())
					.subscribe(response => {
						if (response.code === 200) {
							this.documentList = response.data;
							callback({
								recordsTotal: response.data.length,
								recordsFiltered: response.data.length,
								data: []
							});
						}
					}
					);
			},
			columns: [
				{ data: 'name' },
				{ data: 'type' },
				{ data: 'status' },
				{ data: 'number' },
				{ data: 'category' },
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

	filterDate() {

		let obj={
			fromDate:new Date(this.startDate),
			toDate:new Date(this.endDate),
			category:this.catselect
		}
		if(!this.startDate) {
			delete obj.fromDate;
			delete obj.toDate;
		}
		this.companyrequestService.filterDocs(obj).pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.documentList = response.data;
				}
			});
	}

	setDate() {
        
        if(this.dayselect=='daily') {
            this.startDate = moment(new Date()).format("YYYY-MM-DD");
            var nextDay = new Date();
            nextDay.setDate(new Date(this.startDate).getDate() + 1);
            this.endDate = moment(nextDay).format("YYYY-MM-DD");
        }

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

	getType() {
		this.companyrequestService.getType().pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.typelist = response.data;
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

	getCompany() {
		this.companyService.getList({}).pipe(first()).subscribe(response => {
			if (response.code === 200) {
				this.companyList = response.data;
			}
		});
	}

	getallCategory() {
		this.commonService.getAllData('Category').pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.categoryList = response.data;
				}
			});
	}

	updateRequest(docForm) {

		if (docForm.form.status == 'INVALID') {
			Object.keys(docForm.controls).forEach(key => {
				docForm.controls[key].markAsDirty();
			});
			return;
		}
		this.submitted = true;
		for (var i = 0; i < this.categoryList.length; i++) {

			if (this.categoryList[i]._id.localeCompare(this.documentData.categoryId) == 0) {
				this.documentData.categoryName = this.categoryList[i].name;
			}
		}

		if (this.editing == true) {
			this.commonService.UpdateData(this.documentData, 'Document')
				.pipe(first())
				.subscribe(
					data => {
							docForm.reset();
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
			this.commonService.CreateData(this.documentData, 'Document')
				.pipe(first())
				.subscribe(
					data => {
							docForm.reset();
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
		this.commonService.getData(data, "Document").subscribe(response => {
			this.requestDetail = response.data;
			this.documentData = response.data;
			this.editing = true;
			this.modalService.open(editModal, {
				size: 'lg'
			});
		},error => {}
		);
	}

	openDelivererModel(delivererModal, data, Var) { 
		this.commonService.getData(data, "Document").subscribe(response => {
			this.requestDetail = response.data;
			
			if (Var == 'delivererVar') {
				this.delivererVar = true;
			} else {
				this.delivererVar = false;
			}
			
			if (Var == 'tagVar') {
				this.tagVar = true;
			} else {
				this.tagVar = false;
			}

			if (Var == 'delegateVar') {
				this.delegateVar = true;
			} else {
				this.delegateVar = false;
			}

			this.modalService.open(delivererModal, {
				size: 'lg'
			});
		}, error => { }
		);
	}

	addDeliverer() {
		let obj: any;
		if (this.delivererVar) {
			obj = {
				fromUser: this.requestDetail.fromUser,
				toUser: this.requestDetail.toUser,
				companyId: this.requestDetail.companyId,
				documentId: this.requestDetail._id,
				deliverer: this.deliverer
			}
			this.deliverer = '';
		}
		if (this.tagVar) {
			 obj = {
				fromUser: this.requestDetail.fromUser,
				toUser: this.requestDetail.toUser,
				companyId: this.requestDetail.companyId,
				 documentId: this.requestDetail._id,
				tag: this.tag
			}
			this.tag=''
		}
		if (this.delegateVar) {
			obj = {
				fromUser: this.requestDetail.fromUser,
				toUser: this.requestDetail.toUser,
				companyId: this.requestDetail.companyId,
				documentId: this.requestDetail._id,
				delegate: this.delegate
			}
			this.delegate = '';
		}
		
		this.companyService.addDeliverer(obj).pipe(first()).subscribe(data => {
				if (data.code === 200) {
					this.toastr.success('', data.message);
					this.modalService.dismissAll();
					// docForm.reset();
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
		// companyService



	}

	deleteRequest(data) {
		this.commonService.deleteData(data, "Document").subscribe(response => {
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
				console.log(error);
			});
	}

}
