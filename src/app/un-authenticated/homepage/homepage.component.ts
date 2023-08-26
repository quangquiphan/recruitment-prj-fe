import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{
  constructor(
  ) {}

  ngOnInit(): void {
    
  }

  parseYear() {
    return moment().format("YYYY");
  }
}
