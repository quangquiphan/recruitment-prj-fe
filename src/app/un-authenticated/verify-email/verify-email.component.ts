import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit{

  status: string = '';

  constructor(
    private router: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.verifyEmail(this.router.snapshot.paramMap.get("active-code"));
  }

  verifyEmail(activeCode: string | any) {
    console.log(activeCode);
    
  }

  navigateSignIn() {
    return this.route.navigate(['/sign-in']).then(r => {});
  }
}
