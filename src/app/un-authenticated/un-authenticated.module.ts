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
import { SuccessfullyRequestComponent } from './successfully-request/successfully-request.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './homepage/content/content.component';
import { JobsComponent } from './homepage/content/jobs/jobs.component';
import { CompaniesComponent } from './homepage/content/companies/companies.component';
import { CompanyDetailComponent } from './homepage/content/companies/company-detail/company-detail.component';
import { CompanyListComponent } from './homepage/content/companies/company-list/company-list.component';
import { JobDetailComponent } from './homepage/content/jobs/job-detail/job-detail.component';
import { CompanyInfoComponent } from './homepage/content/companies/company-detail/company-info/company-info.component';
import { JobListComponent } from './homepage/content/jobs/job-list/job-list.component';
import { AuthUserComponent } from "./auth-user/auth-user.component";
import { WorkHistoryComponent } from './auth-user/work-history/work-history.component';
import { ProjectComponent } from './auth-user/project/project.component';
import { HistoryAppliedComponent } from './history-applied/history-applied.component';

@NgModule({
    declarations: [
        UnAuthenticatedComponent,
        SignInComponent,
        SignUpComponent,
        VerifyEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        SuccessfullyRequestComponent,
        HomepageComponent,
        NavbarComponent,
        FooterComponent,
        ContentComponent,
        JobsComponent,
        CompaniesComponent,
        CompanyDetailComponent,
        CompanyListComponent,
        JobDetailComponent,
        CompanyInfoComponent,
        JobListComponent,
        AuthUserComponent,
        WorkHistoryComponent,
        ProjectComponent,
        HistoryAppliedComponent,
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