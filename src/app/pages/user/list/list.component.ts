import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CompanyRequest } from 'src/app/@core/models/company-request.model';
import { CompanyService } from 'src/app/@core/services/company.service';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { UserService } from 'src/app/@core/services/user.service';
import { UserType } from 'src/app/@core/models/user-type.model';
import { User } from 'src/app/@core/models/user.model';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { NgxCsvParser } from 'ngx-csv-parser';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit, OnDestroy {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;

    userTypeList = [
        { value: 'Corporate-User', name: 'Corporate User' },
        { value: 'Non-Corporate-User', name: 'Non Corporate User' },
        { value: 'Company-Admin', name: 'Company-Admin' },
        { value: 'Manager', name: 'Manager' },
    ];
    fileName = new Date().getTime() + '.xlsx';

    dayslist = [
        { value: 'daily', name: 'Daily' },
        { value: 'month', name: 'Month' },
        { value: 'year', name: 'Year' },
    ];

    userslist = [
        { value: 'Corporate-User', name: 'Corporate User' },
        { value: 'Non-Corporate-User', name: 'Non Corporate User' },
    ];

    banneduser = [
        { value: true, name: 'Yes' },
        { value: false, name: 'No' },
    ];

    dayselect: any;
    typeselect: any;
    isMobileVerified: any;
    title = 'Users';
    dtOptions: DataTables.Settings = {};
    userList: any[];
    companyList: any;
    Departmentlist: any;
    requestDetail: any;
    editForm: FormGroup;
    submitted = false;
    button = false;
    editing = false;
    hidden = false;
    startDate: any;
    endDate: any;

    csvRecords: any[] = [];
    header = false;

    @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

    constructor(
        private commonService: CommonService,
        private apiService: UserService,
        private companyService: CompanyService,
        private modalService: NgbModal,
        private modalConfig: NgbModalConfig,
        private formService: FormService,
        private formBuilder: FormBuilder,
        private ngxCsvParser: NgxCsvParser,
        private toastr: ToastrService
    ) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
        this.getCompany();
        this.getDepartment();
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
                const responseData = this.apiService.getAllUser().pipe(first()).subscribe(response => {
                    if (response.code === 200) {
                        this.userList = response.data;
                        callback({
                            recordsTotal: response.data.length,
                            recordsFiltered: response.data.length,
                            data: []
                        });
                    }
                }, error => {
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
                { data: 'CompanyName' },
                { data: 'email' },
                { data: 'mobileNo' },
                { data: 'companyID' },
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
            firstName: ['', [Validators.required,]],
            lastName: ['', [Validators.required,]],
            email: ['', [Validators.required, Validators.email]],
            mobileNo: ['', [Validators.required,]],
            companyID: [null, [Validators.required,]],
            departmentId: [null, [Validators.required,]],
            userType: [null, [Validators.required]],
            isBanUser: [null, [Validators.required]]
        });
    }

    get f(): any {
        return this.editForm.controls;
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

    // Your applications input change listener for the CSV File
    fileChangeListener($event: any): void {

        // Select the files from the event
        const files = $event.srcElement.files;
        // Parse the file you want to select for the operation along with the configuration
        this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
            .pipe().subscribe((result: Array<any>) => {
                for (var i = 1; i < result.length; i++) {

                    let obj = {
                        firstName: '',
                        lastName: '',
                        email: '',
                        userType: '',
                        mobileNo: '',
                    }

                    obj.firstName = result[i][0];
                    obj.lastName = result[i][1];
                    obj.email = result[i][2];
                    obj.mobileNo = result[i][3];
                    obj.userType = result[i][4];
                    this.csvRecords.push(obj)
                }

                if (this.csvRecords.length > 0) {
                    this.apiService.bulkUpload({ userArray: this.csvRecords }).subscribe((response: any) => {
                        if (response.code == 200) {
                            this.toastr.success('', response.message);
                            this.refreshTable();
                        }
                    }, (err: any) => {
                        this.toastr.error("Error while bulk upload please check your csv format OR Some elail is already in database");
                    });
                }
            }, (error: NgxCSVParserError) => {
                console.log('Error', error);
            });

    }

    setsubmit() {
        this.submitted = false;
    }

    editDetail(editModal, id) {
        this.apiService.getData(id).subscribe(
            response => {
                this.requestDetail = response.data;
                this.editForm.reset();
                console.log("this.requestDetail")
                console.log(this.requestDetail)
                this.f._id.setValidators([Validators.required]);
                this.editing = true;
                this.editForm.patchValue({
                    _id: this.requestDetail._id,
                    firstName: this.requestDetail.firstName,
                    lastName: this.requestDetail.lastName,
                    email: this.requestDetail.email,
                    mobileNo: this.requestDetail.mobileNo,
                    companyID: this.requestDetail.companyID,
                    departmentId: this.requestDetail.departmentId,
                    userType: this.requestDetail.userType,
                    isBanUser: this.requestDetail.isBanUser
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

    filterDate() {

        let obj = {
            fromDate: new Date(this.startDate),
            toDate: new Date(this.endDate),
            companyuser: this.typeselect,
            isMobileVerified: this.isMobileVerified
        }

        if (!this.startDate) {
            delete obj.fromDate
            delete obj.toDate
        }
        this.apiService.filterDocs(obj).pipe(first())
            .subscribe(response => {
                if (response.code === 200) {
                    this.userList = response.data;
                }
            });
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

    getDepartment() {
        this.commonService.getAllData('Department').pipe(first()).subscribe(response => {
            if (response.code === 200) {
                this.Departmentlist = response.data;
            }
        });
    }

    setDate() {

        if (this.dayselect == 'daily') {
            this.startDate = moment(new Date()).format("YYYY-MM-DD");
            var nextDay = new Date();
            nextDay.setDate(new Date(this.startDate).getDate() + 1);
            this.endDate = moment(nextDay).format("YYYY-MM-DD");
        }

        if (this.dayselect == 'month') {
            this.startDate = moment(new Date()).format("YYYY-MM-DD");
            var nextDay = new Date();
            nextDay.setMonth(new Date(this.startDate).getMonth() + 1);
            this.endDate = moment(nextDay).format("YYYY-MM-DD");
        }

        if (this.dayselect == 'year') {
            this.startDate = moment(new Date()).format("YYYY-MM-DD");
            var nextDay = new Date();
            nextDay.setFullYear(new Date(this.startDate).getFullYear() + 1);
            this.endDate = moment(nextDay).format("YYYY-MM-DD");
        }
    }

    getCompany() {
        this.companyService.getList({}).pipe(first()).subscribe(response => {
            if (response.code === 200) {
                this.companyList = response.data;
            }
        });
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
            this.apiService.updateData(this.editForm.getRawValue())
                .pipe(first())
                .subscribe(
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
        } else {
            const currentData = this.editForm.getRawValue();
            currentData.password = 'ackezy';
            delete currentData._id;
            this.apiService.create(currentData).pipe(first())
                .subscribe(
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
            error => { }
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


    ngOnDestroy() { }
}
