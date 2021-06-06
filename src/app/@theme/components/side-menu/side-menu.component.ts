import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  appitems = [];
  constructor() {
    var loginUser = JSON.parse(localStorage.getItem('corporateUser'))
    if (loginUser.userType == 'Super-Admin') {
      this.appitems = [
        {
          label: 'Dashboard',
          icon: 'fas fa-home',
          link: '/dashboard'
        },
        {
          label: 'Company',
          icon: 'fas fa-building',
          link: '/company'
        },
        {
          label: 'Users',
          icon: 'fas fa-user',
          link: '/user/list'
        },
        {
          label: 'Departments',
          icon: 'far fa-building',
          link: '/department'
        },{
          label: 'Subscription',
          icon: 'fas fa-sign-language',
          link: '/subscription'
        },{
          label: 'Documents',
          icon: 'far fa-file-word',
          link: '/documents'
        },{
          label: 'Promo Codes',
          icon: 'fa fa-code',
          link: '/promo-code'
        },{
          label: 'Document Type',
          icon: 'far fa-keyboard',
          link: '/type'
        }
        ,{
          label: 'Subscribe Company',
          icon: 'fas fa-check',
          link: '/subscribe-company'
        },{
          label: 'Send Notification',
          icon: 'fa fa-bell',
          link: '/notification'
        }
      ];
    } else {
      this.appitems = [
        {
          label: 'Yours Company',
          icon: 'fas fa-th-list',
          link: '/company/company-admin'
        },
        {
          label: 'Users',
          icon: 'fas fa-user',
          link: '/company/company-users'
        },
        {
          label: 'Department',
          icon: 'far fa-building',
          link: '/company/company-department'
        }
      ]
    }
  }

  ngOnInit() {
  }

}
