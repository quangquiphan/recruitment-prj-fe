import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'src/app/model/company.model';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit{
  companies: Company[] = [];
  listCompanies: Company[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  first: number = 0;
  paging: any = {
    pageNumber: 1,
    pageSize: 9
  }

  constructor(
    private companyServices: CompanyService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAllCompany();
  }

  onPageChange(ev: any) {
    if (ev) {
      this.paging.pageNumber = ev.first/ev.rows + 1;
    }

    this.getListCompany(this.listCompanies, this.paging);
  }

  getListCompany(list: any, paging: any) {
    this.companies = [];
    for (let i = 0; i < list.length; i++) {
      if (i >= (paging.pageNumber - 1) * paging.pageSize &&
        i < paging.pageNumber * paging.pageSize) {
        this.companies.push(this.listCompanies[i]);
      }
    }

    return this.companies;
  }

  getAllCompany() {
    this.companyServices.getAllCompany(this.paging).subscribe(
      res => {
        if (res.status === 200) {
          this.listCompanies = res.data;
          this.totalElements = res.data.length;
          this.getListCompany(this.listCompanies, this.paging);
        }
      }
    )
  }
}
