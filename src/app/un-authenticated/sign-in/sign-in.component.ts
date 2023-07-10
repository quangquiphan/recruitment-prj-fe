import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
  signInForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder
  ) {
    this.signInForm = this.fb.group({
      email: [ '', Validators.pattern(AppConstant.PATTERNS.EMAIL)],
      passwordHash: [ '', Validators.pattern(AppConstant.PATTERNS.PASSWORD)],
      keepLogin: [false]
    });
  }

  ngOnInit(): void {
    
  }

  onSignIn() {
    let params = {
      email: this.signInForm.value.email,
      passwordHash: AppUtil.hasMD5(this.signInForm.value.passwordHash).toString(),
      keepLogin: Boolean (this.signInForm.value.keepLogin)
    }

    console.log(AppUtil.toSnakeCaseKey(params));
    
  }

}
