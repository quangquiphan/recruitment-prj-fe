import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { UnAuthenticatedComponent } from "./un-authenticated.component";
import { UnAuthenticatedRoutingModule } from "./un-authenticated-routing.module";
import { SignInComponent } from './sign-in/sign-in.component';
import { TranslateModule } from "@ngx-translate/core";
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from "@angular/forms";
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    declarations: [
        UnAuthenticatedComponent,
        SignInComponent,
        SignUpComponent,
        VerifyEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],

    imports: [
        CommonModule,
        PrimeNgModule,
        TranslateModule,
        ReactiveFormsModule,
        UnAuthenticatedRoutingModule
    ]
})
export class UnAuthenticatedModule {}