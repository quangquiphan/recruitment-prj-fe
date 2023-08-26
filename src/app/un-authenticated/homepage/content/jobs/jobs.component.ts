import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Job } from 'src/app/model/job.model';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit{
  @Input() jobs: Job[] = [];
  @Input() isNavigateFromCompany: boolean = false;
  @Input() totalElements: number = 0;
  @Input() totalPages: number = 0;
  @Input() paging: any = {
    pageNumber: 1,
    pageSize: 10
  }

  constructor(
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.isNavigateFromCompany) {
      this.getAllJobs();
    }
  }

  getAllJobs() {

  }

  parseDate(expiry: string) {
    let now = new Date();
    let expiryDate = new Date(moment(expiry, "DD-MM-YYYY").add(1, 'day').toDate()); 
    let result = (expiryDate.getTime() - now.getTime())/(1000 * 60);
    
    if (Math.round(result/(60*24)) > 1) {
      result = Math.round(result / (60*24));
      return this.translateService.instant(`label.${result > 1 ? 'num_days' : 'num_day'}`, {number: result});
    }

    if (Math.round(result/(60)) > 0) {
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
}
