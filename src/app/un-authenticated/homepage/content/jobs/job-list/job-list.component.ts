import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AuthUser } from 'src/app/model/auth-user.model';
import { Company } from 'src/app/model/company.model';
import { Job } from 'src/app/model/job.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CompanyService } from 'src/app/services/company.service';
import { JobService } from 'src/app/services/job.service';
import AppData from 'src/app/utilities/app-data';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit{
  @Input() isNavigateFromCompany: boolean = false;
  @Input() companyId: string = '';
  jobs: Job[] = [];
  companies: Company[] = [];
  showJobs: Job[] = [];
  responsiveOptions: any[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  companyName: string = '';
  cities: any[] = [];
  listSalary: any[] = [];
  paging: any = {
    pageNumber: 1,
    pageSize: 10,
    major: '',
    companyId: this.companyId 
  }
  authUser: AuthUser | undefined;
  first: number = 0;
  isSearch: boolean = false;
  keyword: string = '';
  salary: string = '';
  city: string = '';
  isFilter: boolean = false;

  constructor(
    private jobService: JobService,
    private companyService: CompanyService,
    private translateService: TranslateService,
    private authenticateService: AuthenticateService,
  ) {
    this.cities = AppData.getListCity();
    this.listSalary = AppData.getSalary(translateService);
  }

  ngOnInit(): void {
    this.authUser = this.authenticateService.authUser;
    
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '500px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    if (!this.isNavigateFromCompany) {
      if (this.authUser?.id) {
        this.paging.major = this.authenticateService.authUser?.major;
        this.getJobsRecomment(this.paging);  
      } else {
        this.getAllJobs();
      }
    } else {
      this.getJobsByCompanyid();
    }      
    
    this.getListCompany();
  }

  getJobsRecomment(paging: any) {
    return this.jobService.getJobsRecommend(paging).subscribe(
      res => {
        if (res.status == 200) {
          this.showJobs = [];
          this.jobs = res.data;
          this.totalElements = res.data.length;
          this.first = 0;          
          
          for (let index = 0; index < this.jobs.length; index++) {
            if (index >= (this.paging.pageNumber - 1) * this.paging.pageSize 
              && index < this.paging.pageSize * this.paging.pageNumber) {
              this.showJobs.push(this.jobs[index]);
            }
          }
        }
      }
    )
  }

  viewMore() {
    this.paging.pageNumber += 1;
    
    for (let index = 0; index < this.jobs.length; index++) {
      if (index >= (this.paging.pageNumber - 1) * this.paging.pageSize 
          && index < this.paging.pageSize * this.paging.pageNumber) {
        this.showJobs.push(this.jobs[index]);
      }
    }
  }

  getAllJobs() {
    return this.jobService.getAllJob().subscribe(
      res => {
        if (res.status == 200) {
          this.showJobs = [];
          this.jobs = res.data;
          this.totalElements = res.data.length;
          this.first = 0;
          
          for (let index = 0; index < this.jobs.length; index++) {
            if (index >= (this.paging.pageNumber - 1) * this.paging.pageSize 
                && index < this.paging.pageSize * this.paging.pageNumber) {
              this.showJobs.push(this.jobs[index]);
            }
          }
        }
      }
    )
  }

  searchJobs(ev?: any) {
    this.isSearch = true;
    let params = {
      searchKey: this.keyword
    }
    
    if (ev) {
      params.searchKey = ev.value;
    }

    return this.jobService.searchJob({searchKey: params.searchKey}).subscribe(
      res => {
        if (res.status == 200) {
          this.showJobs = [];
          this.jobs = res.data;
          this.totalElements = res.data.length;
          this.first = 0;
          if (this.salary) {
            this.jobs.filter((e: any) => {
              if (e.salary === this.salary) {
                this.showJobs.push(e);
              }
            });
          } else {
            for (let index = 0; index < this.jobs.length; index++) {
              if (index >= (this.paging.pageNumber - 1) * this.paging.pageSize 
                  && index < this.paging.pageSize * this.paging.pageNumber) {
                this.showJobs.push(this.jobs[index]);
              }
            }
          }
        }
      }
    )
  }

  onFilter() {
    this.showJobs = [];
    this.jobs.filter((e: any) => {
      if (e.salary === this.salary) {
        this.showJobs.push(e);
      }
    });

    this.isFilter = false;

    return this.showJobs;
  }

  getJobsByCompanyid() {
    this.paging.companyId = this.companyId;
    return this.jobService.getAllJobBycompanyId(this.paging).subscribe(
      res => {
        if (res.status == 200) {
          this.jobs = res.data;
          this.totalElements = res.data.length;
          this.first = 0;
          
          for (let index = 0; index < this.jobs.length; index++) {
            if (index >= (this.paging.pageNumber - 1) * this.paging.pageSize 
                && index < this.paging.pageSize * this.paging.pageNumber) {
              this.showJobs.push(this.jobs[index]);
            }
          }
        }
      }
    )
  }

  getListCompany() {
    return this.companyService.getAllCompany({pageNumber: 1, pageSize: 1000}).subscribe(
      res => {
        if (res.status === 200) {
          this.companies = res.data.content;
        }
      }
    )
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
}