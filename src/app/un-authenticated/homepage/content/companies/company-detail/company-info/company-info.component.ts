import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'src/app/model/company.model';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit{
  @Input() company: Company | undefined;

  constructor(
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    
  }

  parseSize(size: string) {
    if (!size) return;
    return this.translateService.instant(`SIZE.${size}`); 
  }
}
