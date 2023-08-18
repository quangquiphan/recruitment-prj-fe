import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppData from 'src/app/utilities/app-data';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit{
  @Output() isClose: EventEmitter<Boolean> = new EventEmitter();
  signUpForm: FormGroup = new FormGroup({});
  isNext: boolean = true;
  disable: boolean = false;
  majors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PHONE)
      ]],
      major: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.EMAIL)
      ]],
      passwordHash: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PASSWORD)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PASSWORD)
      ]],
      role: [AppConstant.USER_ROLE.USER]
    });
    this.majors = AppData.getMajor(this.translateService);
  }

  ngOnInit(): void {
     
  }

  onSignUp() {
    let params = {
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName,
      email: this.signUpForm.value.email,
      passwordHash: AppUtil.hasMD5(this.signUpForm.value.passwordHash).toString(),
      confirmPassword: AppUtil.hasMD5(this.signUpForm.value.confirmPassword).toString(),
      role: this.signUpForm.value.role,
      major: this.signUpForm.value.major,
      phoneNumber: this.signUpForm.value.phoneNumber
    }

    this.disable = true;
    return this.userService.signUp(AppUtil.toSnakeCaseKey(params)).subscribe(
      res => {
        if (res.status === 200) {
          this.isClose.emit(true);
          this._router.navigate(['/check-your-email']);
          this.signUpForm.reset();
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService, 
            "message.sign_up_successfully");
          this.disable = false;
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService, 
            "message.sign_up_failed");
          this.disable = false;
        }
      }
    )
  }

  nextTep() {
    if (!this.signUpForm.value.email && 
        !this.signUpForm.value.passwordHash && 
        !this.signUpForm.value.confirmPassword) {
      return this.isNext = true;
    }

    return this.isNext = false;
  }
}
