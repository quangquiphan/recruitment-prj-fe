import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SuccessfullyRequestComponent } from "./successfully-request/successfully-request.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { UnAuthenticatedComponent } from "./un-authenticated.component";
import { AuthGuard } from "../interceptors/auth-guard.service";

const routes: Routes = [
    {
        path: '',
        component: UnAuthenticatedComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            {
                path: "home",
                component: HomepageComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            },
            {
                path: 'sign-in',
                component: SignUpComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password/:reset-code',
                component: ResetPasswordComponent
            },
            {
                path: 'verify-email/:active-code',
                component: VerifyEmailComponent
            },
            {
                path: 'check-your-email',
                component: SuccessfullyRequestComponent
            },
            {
                path: 'successfully',
                component: SuccessfullyRequestComponent
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class UnAuthenticatedRoutingModule {}