import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@core/services/common.service';

@Component({
  selector: 'app-sendnotification',
  templateUrl: './sendnotification.component.html',
  styleUrls: ['./sendnotification.component.css']
})
export class SendnotificationComponent implements OnInit {

  constructor(
		private toastr: ToastrService,
		private commonService: CommonService,
  	) {}

  ngOnInit() {}

  message:any;

  sendnotification(){
  	let obj={
  		message:this.message
  	}
  	this.commonService.sendNotification(obj).subscribe((res:any) => {
        if(res.code==200){
          this.message='';
        }
    });
  }
}
