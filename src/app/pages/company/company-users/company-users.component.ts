import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { UserService } from 'src/app/@core/services/user.service';
import { User } from 'src/app/@core/models/user.model';

@Component({
    selector: 'app-company-users',
    templateUrl: './company-users.component.html',
    styleUrls: ['./company-users.component.css']
})

export class CompanyUsersComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;

    userTypeList = [
        { value: 'Corporate-User', name: 'Corporate User' },
        { value: 'Non-Corporate-User', name: 'Non Corporate User' },
        { value: 'Manager', name: 'Manager' },
    ];

    title = 'Users';
    dtOptions: DataTables.Settings = {};
    userList: any[];
    value: any;
    requestDetail: User;
    editForm: FormGroup;
    submitted = false;
    button = false;
    editing = false;
    ''
    hidden = false;

    constructor(
        private apiService: UserService,
        private modalService: NgbModal,
        private modalConfig: NgbModalConfig,
        private formService: FormService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
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
                this.value = localStorage.getItem('companyId');
                const responseData = this.apiService.getUserByCompany(this.value).pipe(first()).subscribe(response => {
                        if (response.code === 200) {
                            this.userList = response.data;
                            callback({
                                recordsTotal: response.data.length,
                                recordsFiltered: response.data.length,
                                data: []
                            });
                        }
                    },
                    error => {
                        this.userList = [];
                        callback({
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                    });
            },
            columns: [
                { data: 'name' },
                { data: 'userType' },
                { data: 'email' },
                { data: 'mobileNo' },
                { data: 'uniqueCode' },
                { data: '_id' }
            ],
            columnDefs: [{
                    searchable: false,
                    orderable: false,
                    targets: [-1]
                },
                {
                    searchable: false,
                    targets: [-2]
                },
                {
                    searchable: false,
                    targets: [-3]
                },
                {
                    targets: [4],
                    visible: false,
                    searchable: false
                },
                {
                    searchable: false,
                    targets: [1]
                }
            ],
            order: [
                [0, 'desc']
            ]
        };
        this.editForm = this.formBuilder.group({
            _id: ['', [Validators.required]],
            firstName: ['', [Validators.required, ]],
            lastName: ['', [Validators.required, ]],
            email: ['', [Validators.required, Validators.email]],
            mobileNo: ['', [Validators.required, ]],
            uniqueCode: ['', [Validators.required, ]],
            userType: [null, [Validators.required]]
        });
    }

    get f(): any {
        return this.editForm.controls;
    }
    setsubmit() {
        this.submitted = false;
    }
    editDetail(editModal, id) {
        this.apiService.getData(id).subscribe(
            response => {
                this.requestDetail = response.data;
                this.editForm.reset();
                this.f._id.setValidators([Validators.required]);
                this.editing = true;
                this.editForm.patchValue({
                    _id: this.requestDetail._id,
                    firstName: this.requestDetail.firstName,
                    lastName: this.requestDetail.lastName,
                    email: this.requestDetail.email,
                    mobileNo: this.requestDetail.mobileNo,
                    uniqueCode: this.requestDetail.uniqueCode,
                    userType: this.requestDetail.userType
                });
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
        this.apiService.deleteData(data).subscribe(
            response => {
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

    updateRequest() {
        this.submitted = true;
        if (this.editForm.invalid) {
            this.formService.clearCustomError(this.editForm);
            this.editForm.markAllAsTouched();
            return false;
        }
        if (this.editForm.valid) {
            this.button = true;
        }

        if (this.editing) {
            this.apiService.updateData(this.editForm.getRawValue()).pipe(first()).subscribe(
                data => {
                    if (data.code === 200) {
                        this.toastr.success('', data.message);
                        this.modalService.dismissAll();
                        this.editForm.reset();
                        this.refreshTable();
                    }
                },
                error => {
                    this.submitted = false;
                    this.button = false;
                    if (error.errors.length > 0) {
                        for (const fieldError of error.errors) {
                            const check = fieldError.param;
                            this.editForm
                                .get(check)
                                .setErrors({ customError: fieldError.msg });
                        }
                    }
                },
                () => {
                    this.submitted = false;
                    this.button = false;
                });
        } else {
            const currentData = this.editForm.getRawValue();
            currentData.companyID = this.value;
            currentData.password = 'ackezy';
            delete currentData._id;
            this.apiService.create(currentData).pipe(first()).subscribe(
                data => {
                    if (data.code === 200) {
                        this.toastr.success('', data.message);
                        this.modalService.dismissAll();
                        this.editForm.reset();
                        this.refreshTable();
                    }
                },
                error => {
                    this.submitted = false;
                    this.button = false;
                    if (error.errors.length > 0) {
                        for (const fieldError of error.errors) {
                            const check = fieldError.param;
                            this.editForm
                                .get(check)
                                .setErrors({ customError: fieldError.msg });
                        }
                    }
                },
                () => {
                    this.submitted = false;
                    this.button = false;
                }
            );
        }
    }

    refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    deleteConfirmation(data) {
        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.data = data;
        modalRef.result.then(
            result => {
                if (result) {
                    this.deleteRequest(result);
                }
            },
            error => {}
        );
    }

    createData(modal) {
        this.f._id.setValidators(null);
        this.hidden = false;
        this.requestDetail = {
            firstName: '',
            lastName: '',
        };
        this.editing = false;
        this.editForm.reset();
        this.modalService.open(modal, {
            size: 'lg'
        });
    }


    ngOnDestroy() {}

}
