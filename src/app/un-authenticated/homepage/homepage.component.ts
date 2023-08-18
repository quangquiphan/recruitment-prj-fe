import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthUser } from 'src/app/model/auth-user.model';

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
}
