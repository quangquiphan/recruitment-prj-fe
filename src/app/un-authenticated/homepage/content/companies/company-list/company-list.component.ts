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
  totalElements: number = 0;
  totalPages: number = 0;
  paging: any = {
    pageNumber: 1,
    pageSize: 10
  }

  constructor(
    private companyServices: CompanyService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAllCompany();
  }

  getAllCompany() {
    this.companyServices.getAllCompany(this.paging).subscribe(
      res => {
        if (res.status === 200) {
          this.companies = res.data.content;
          this.totalElements = res.data.totalElements;
          this.totalPages = res.data.totalPages;
        }
      }
    )
  }
}
