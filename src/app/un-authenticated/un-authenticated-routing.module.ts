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
import { JobsComponent } from "./homepage/content/jobs/jobs.component";
import { CompaniesComponent } from "./homepage/content/companies/companies.component";
import { CompanyDetailComponent } from "./homepage/content/companies/company-detail/company-detail.component";
import { CompanyListComponent } from "./homepage/content/companies/company-list/company-list.component";
import { JobDetailComponent } from "./homepage/content/jobs/job-detail/job-detail.component";
import { JobListComponent } from "./homepage/content/jobs/job-list/job-list.component";
import { AuthUserComponent } from "./auth-user/auth-user.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HistoryAppliedComponent } from "./history-applied/history-applied.component";

const routes: Routes = [
    {
        path: '',
        component: UnAuthenticatedComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/jobs', pathMatch: 'full' },
            {
                path: '',
                component: HomepageComponent,
                children: [
                    {
                        path: '',
                        redirectTo: '/jobs',
                        pathMatch: 'full'
                    },
                    {
                        path: "jobs",
                        component: JobsComponent,
                        children: [
                            {
                                path: '',
                                component: JobListComponent
                            },
                            {
                                path: ':id',
                                component: JobDetailComponent
                            }
                        ]
                    },
                    {
                        path: "company",
                        component: CompaniesComponent,
                        children: [
                            {
                                path: '',
                                component: CompanyListComponent
                            },                            
                            {
                                path: ':id',
                                component: CompanyDetailComponent,
                                children: [
                                    {
                                        path: 'overview',
                                        component: CompanyDetailComponent
                                    },
                                    {
                                        path: 'jobs',
                                        component: CompanyDetailComponent
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: 'profile',
                        component: AuthUserComponent
                    },
                    {
                        path: 'history',
                        component: HistoryAppliedComponent
                    }
                ]
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            },
            {
                path: 'sign-in',
                component: SignInComponent  
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