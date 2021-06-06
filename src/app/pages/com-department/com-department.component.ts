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

@Component({
  selector: 'app-com-department',
  templateUrl: './com-department.component.html',
  styleUrls: ['./com-department.component.css']
})
export class ComDepartmentComponent implements OnInit {
	@ViewChild('form', { static: false }) departForm: NgForm;
    departData = { 
        name:'',
        companyId: '',
        head: '',
        description: '',
        companyName: '',
        IsActive: true, 
        id: ''
    };
	dtOptions: DataTables.Settings = {};
	statusData = [{ id: true, name: 'Active' }, { id: false, name: 'Inactive' }];
	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;
	departmentist: any;
	requestDetail: any;
	companyList: any;
    usertist: any;
	title = 'Department';
	editing = false;
    submitted = false;

	constructor(public router: Router, 
		private route: ActivatedRoute, 
		private toastr: ToastrService,
		private commonService: CommonService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private activatedRoute: ActivatedRoute) {
		this.getallCompany()
        this.getallUser()
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
				const responseData = this.commonService.getAllData('Department').pipe(first())
					.subscribe(response => {
						if (response.code === 200) {
                            console.log("response.data")
                            console.log(response.data)
							this.departmentist = response.data;
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
				{ data: 'companyId' },
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

	getallUser() {
        this.commonService.getAllData('User').pipe(first()).subscribe(response => {
            if (response.code === 200) {
                this.usertist = response.data;
            }
        });
    }

    getallCompany() {
		this.commonService.getAllData('Company').pipe(first())
			.subscribe(response => {
				if (response.code === 200) {
					this.companyList = response.data;
				}
			});
	}

	updateRequest(departForm) {
	    
        if (departForm.form.status == 'INVALID') {
			return;
		}

        this.submitted = true;
         for (var i = 0; i < this.companyList.length; i++) {

             if (this.companyList[i]._id.localeCompare(this.departData.companyId) == 0) {
                 this.departData.companyName = this.companyList[i].name;
             }
        }

        if (this.editing==true) {
            console.log("in if")
            this.commonService.UpdateData(this.departData, 'Department')
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
            console.log("ELSE")
            this.commonService.CreateData(this.departData, 'Department')
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
        this.commonService.getData(data,"Department").subscribe(response => {
                this.requestDetail = response.data;
                this.departData = response.data;
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
        this.commonService.deleteData(data,"Department" ).subscribe(response => {
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
        this.requestDetail={
        	name:''
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
