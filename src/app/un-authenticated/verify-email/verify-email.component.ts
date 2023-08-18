import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit{
  message: string = '';

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.verifyEmail(this.router.snapshot.paramMap.get("active-code"));
  }

  verifyEmail(activeCode: string | any) {
    return this.userService.verifyEmail(activeCode).subscribe(
      res => {
        if (res.status === 200) {
          this.message = 'message.verify_email_successfully';
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.verify_email_successfully');
          this.route.navigate(['/sign-in']);
        } else {
          this.message = 'message.verify_email_failed';
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.verify_email_failed');
        }
      }
    )
  }

  navigateSignIn() {
    return this.route.navigate(['/sign-in']).then(r => {});
  }
}
