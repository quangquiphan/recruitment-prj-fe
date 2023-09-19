import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { UserJobService } from 'src/app/services/user-job.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-history-applied',
  templateUrl: './history-applied.component.html',
  styleUrls: ['./history-applied.component.scss']
})
export class HistoryAppliedComponent implements OnInit{
  historyJob: any[] = [];
  constructor(
    private userJobService: UserJobService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.getJobApplied();
  }

  getJobApplied() {
    return this.userJobService.getJobsAlppied().subscribe(
      res => {
        if (res.status === 200) {
          this.historyJob = res.data;
        }
      }
    )
  }

  parseDate(date: string) {
    return moment(moment(date).add(7 , 'hours')).format(AppConstant.DATE_FORMAT.GET);
  }

  removeUserJob(id: string) {
    return this.userJobService.deleteJobsAlppied(id).subscribe(
      res => {
        if (res.status === 200) {
          this.getJobApplied();
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.delete_successfully')
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.delete_failed')
        }
      }
    )
  }

  parseSalary(salary: string) {
    if (!salary) return;
    return this.translateService.instant(`salary.${salary}`);
  }
}
