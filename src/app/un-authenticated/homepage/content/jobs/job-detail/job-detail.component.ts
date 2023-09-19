import { Component, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AuthUser } from 'src/app/model/auth-user.model';
import { Job } from 'src/app/model/job.model';
import { User } from 'src/app/model/user.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit{
  job: Job | undefined;
  authUser: AuthUser | undefined;
  user: User | undefined;
  jobId: string = '';
  isLogin: boolean = false;
  isMobile: boolean = false;
  isApplied: boolean = false;
  disable: boolean = false;

  constructor(
    private _router: Router,
    private jobService: JobService,
    private _route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticateService: AuthenticateService,
  ) {}

  ngOnInit(): void {
    this.jobId = this._route.snapshot.paramMap.get("id") || '';
    this.authUser = this.authenticateService.authUser;
    this.getJob();
    this.onResize();
    this.getUser();
  }

  getJob() {
    return this.jobService.getJobDetail(this.jobId).subscribe(
      res => {
        if (res.status === 200) {
          this.job = res.data;
        }
      }
    )
  }

  getUser() {
    if (!this.authUser?.id) return;
    return this.userService.getUser(this.authUser?.id).subscribe(
      res => {
        if (res.status === 200) {
          this.user = res.data;
          console.log(this.user);
          
          this.checkApplied(this.jobId);
        }
      }
    )
  }

  onApply(jobId: string) {
    if (!this.authUser) return this.isLogin = true;
    let params = {
      userId: this.user?.id,
      jobId: jobId,
      status: AppConstant.JOB_STATUS.APPLIED
    }
    return this.userService.applyJob(AppUtil.toSnakeCaseKey(params)).subscribe(
      res => {
        if (res.status == 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.apply_successfully');
          this.getUser();
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.apply_failed');
        }
      }
    );
  }

  onBack() {
    return this._router.navigate(['/jobs']).then(r => {});
  }

  onClose(ev: any) {
    if (ev) {
      this.authUser  = ev;
      this.isLogin = false;
      window.location.reload();
    }
  }

  checkApplied(jobId: string) {
    if (!this.user?.id) return this.isApplied;
    
    this.user?.jobsApplied.forEach((e: any) => {
      if (e.jobId === jobId) {
        this.isApplied  = true;
        this.disable = moment(moment(e.createdDate).add(3, 'days')).isAfter(moment());
        console.log
        (moment(moment(e.createdDate).add(3, 'days')).isAfter(moment()))
      }
    })
    return this.isApplied;
  }

  parseDate(expiry: string) {
    let now = new Date();
    let expiryDate = new Date(moment(expiry).add(1, 'day').toDate()); 
    let result = (expiryDate.getTime() - now.getTime())/(1000 * 60);
    
    if (Math.round(result/(60*24)) > 1) {
      result = Math.round(result / (60*24));
      return this.translateService.instant(`label.${result > 1 ? 'num_days' : 'num_day'}`, {number: result});
    }

    if (Math.round(result/(60)) > 1) {
      result = Math.round(result / (60));
      return this.translateService.instant(`label.${result > 1 ? 'num_hours' : 'num_hour'}`, {number: result});
    }

    result = Math.round(result);
    return this.translateService.instant(`label.${result > 1 ? 'num_minutes' : 'num_minute'}`, {number: result});
  }

  parseSalary(salary: string) {
    if (!salary) return;
    return this.translateService.instant(`salary.${salary}`);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobile = window.innerWidth < 525 ? true : false;
  }
}
