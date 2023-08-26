import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { toArray } from 'lodash';
import { Company } from 'src/app/model/company.model';
import { Job } from 'src/app/model/job.model';
import { CompanyService } from 'src/app/services/company.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit{
  tabViews: any[] = [];
  jobs: Job[] = [];
  selectedTab: number = 0;
  company: Company | undefined;
  totalPages: number = 0;
  totalElements: number = 0;
  paging: any = {
    companyId: '',
    pageNumber: 1,
    pageSize: 10
  }

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private jobService: JobService,
    private companyService: CompanyService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.paging.companyId = this.route.snapshot.paramMap.get('id') || '';

    this.getCompanyDetail(this.paging.companyId);
    this.getJobsByCompanyId();

    this.tabViews = [
      {
        index: 0,
        label: this.translateService.instant('label.overview')
      },
      {
        index: 1,
        label: this.translateService.instant('label.jobs')
      }
    ];

    this.selectedTabViewUrl();
  }

  getCompanyDetail(id: string) {
    return this.companyService.getCompany(id).subscribe(
      res => {
        if (res.status === 200) {
          this.company = res.data;
        }
      }
    )
  }

  getJobsByCompanyId() {
    return this.jobService.getAllJobBycompanyId(this.paging).subscribe(
      res => {
        if (res.status === 200) {
          this.jobs = res.data.content;
          this.totalElements = res.data.totalElements;
          this.totalPages = res.data.totalPages;
        }
      }
    )
  }

  selectedTabViewUrl() {
    let arr = toArray(this._router.routerState.snapshot.url.split("/"))
    const map = new Map();
    
    if (arr.length === 3) {
      arr.push();
    }

    map.set('tab', arr[3]);

    if (map.get('tab') === 'overview' || !map.get('tab')) {
      this.selectedTab = 0;
    } else if (map.get('tab') === 'jobs') {
      this.selectedTab = 1;
    }

    this.activatedTabView(this.selectedTab);
  }

  onChangeTabView(event: any) {
    this.selectedTab = event.index;
    this.activatedTabView(this.selectedTab);
  }

  activatedTabView(selectedTab: number) {
    let tab = '';

    if (selectedTab === 0) {
      tab = "overview";  
    } 
    
    if (selectedTab === 1) {
      tab = "jobs";
    }

    return this._router.navigate([`/company/${this.paging.companyId}/${tab}`]).then(r => {});
  }

  getAllJobs() {
    
  }
}