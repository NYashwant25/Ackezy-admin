import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { NgbModal, NgbModalConfig, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.css']
})
export class PromoCodeComponent implements OnInit {

	@ViewChild('form', { static: false }) subscriptionForm: NgForm;
	promoData = {
	 	name: '',
	 	description: '',
		code: '',
		codeStart: new Date(),
		discountType:'',
		amount:'',
		codeEnd: new Date(),
		IsActive: true
	};

	dtOptions: DataTables.Settings = {};
	statusData = [{ id: true, name: 'Active' }, { id: false, name: 'Inactive' }];
	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;
	promolist: any;
	requestDetail: any;
	newDate = new Date();
	startDate: any;
	endDate: any;
	title = 'Promo Code';
	editing = false;
	submitted = false;

	constructor(public router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private commonService: CommonService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private config: NgbDatepickerConfig,
		private activatedRoute: ActivatedRoute) {}

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
				const responseData = this.commonService.getAllData('Promo').pipe(first())
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
				{ data: 'description' },
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

	updateRequest(departForm) {

		if (departForm.form.status == 'INVALID') {
			return;
		}

		if(new Date(this.promoData.codeEnd) < new Date(this.promoData.codeStart)) {
			this.toastr.error('End Date Must Less Then Start Date');
			return false;
		}
		
		this.submitted = true;

		if (this.editing == true) {
			this.commonService.UpdateData(this.promoData, 'Promo')
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
						this.toastr.error('', error.message);
						this.submitted = false;
					},
					() => {
						this.submitted = false;
					});
		} else {
			this.commonService.CreateData(this.promoData, 'Promo')
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
						this.toastr.error('', error.message);
						this.submitted = false;
					},
					() => {
						this.submitted = false;
					});
		}
	}

	editDetail(editModal, data) {
		this.commonService.getData(data, "Promo").subscribe(response => {
			this.requestDetail = response.data;
			this.promoData = response.data;
			this.promoData.codeStart = new Date(response.data.codeStart);
			this.promoData.codeEnd = new Date(response.data.codeEnd)
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
		this.commonService.deleteData(data, "Promo").subscribe(response => {
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


}
