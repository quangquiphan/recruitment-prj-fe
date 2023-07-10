import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit{
  signUpForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder
  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.pattern(AppConstant.PATTERNS.EMAIL)],
      passwordHash: ['', Validators.pattern(AppConstant.PATTERNS.PASSWORD)],
      confirmPassword: ['', Validators.pattern(AppConstant.PATTERNS.PASSWORD)]
    });
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
      role: "USER"
    }
  }

}
