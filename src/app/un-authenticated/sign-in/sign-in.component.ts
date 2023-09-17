import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AuthUser } from 'src/app/model/auth-user.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
  @Input() isMobile: boolean = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  signInForm: FormGroup = new FormGroup({});
  disable: boolean = false;
  isLogin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticateService: AuthenticateService
  ) {
    this.signInForm = this.fb.group({
      email: [ '', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.EMAIL)
      ]],
      passwordHash: [ '', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PASSWORD)
      ]],
      keepLogin: [false]
    });
  }

  ngOnInit(): void {
    this.isLogin = this._route.routeConfig?.path?.includes('sign-in') ? true : false;
  }

  onSignIn() {
    let params = {
      email: this.signInForm.value.email,
      passwordHash: AppUtil.hasMD5(this.signInForm.value.passwordHash).toString(),
      keepLogin: Boolean (this.signInForm.value.keepLogin)
    }
    this.disable = true;

    return this.authenticateService.login(AppUtil.toSnakeCaseKey(params)).subscribe(
      res => {
        if (res.status === 200) {
          this.signInForm.reset();
          this.authenticateService.setToken(res.data.accessToken);
          this.authenticateService.getAuthInfo().subscribe(
            res => {
              if (res.status === 200) {
                const authUser: AuthUser = res.data;
                this.authenticateService.setAuthUser(authUser);
                this.onClose.emit(authUser);
                if (this.isLogin) {
                  this._router.navigate(['/jobs']).then(r => {});
                }
              } else {
                AppUtil.getMessageFailed(this.messageService, this.translateService,
                  'message.sign_in_failed');
                this.signInForm.reset();
              }
            }
          );
        }

        this.disable = false;
      }
      )
    }

}
