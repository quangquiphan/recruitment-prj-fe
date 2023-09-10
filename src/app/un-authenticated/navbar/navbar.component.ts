import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthUser } from 'src/app/model/auth-user.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';
import { JobDetailComponent } from '../homepage/content/jobs/job-detail/job-detail.component';
import { UserService } from 'src/app/services/user.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  changePasswordForm: FormGroup = new FormGroup({});
  authUser: AuthUser | undefined;
  isMobileAndTablet: boolean = false;
  isMobile: boolean = false;
  isShowMenu: boolean = false;
  isShowSubMenu: boolean = false;
  isLogin: boolean = false;
  isChangePassword: boolean = false;
  isVisible: boolean = false;
  item: MenuItem[] = [];
  items: MenuItem[] = [];
  languages: any[] = [];
  isUploadCV: boolean = false;
  langSelected: any = this.languages[0];

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticatService: AuthenticateService,
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PASSWORD)
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PASSWORD)
      ]],
      confirmNewPassword: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PASSWORD)
      ]]
    })
  }

  ngOnInit(): void { 
    this.authUser = this.authenticatService.authUser;
    this.init();
    this.onResize();
    
  }

  init() {
    this.languages = [
      {
        id: 'en',
        icon: '../../../assets/images/icons/united-kingdom.svg'
      },
      {
        id: 'vn',
        icon: '../../../assets/images/icons/vietnam.svg'
      }
    ];

    this.onShowLang();

    this.items = [
      {
        label: this.parseLable('button.sign_in'),
        icon: 'pi pi-sign-in',
        visible: !this.checkVisible(this.authUser),
        command: () => {
          this.isLogin = true;
        }
      },
      {
        label: this.parseLable('button.sign_up'),
        icon: 'pi pi-sign-in',
        visible: !this.checkVisible(this.authUser),
        command: () => {
          this._router.navigate(['/sign-up']).then(r => {});
        }
      },
      {
        label: this.parseLable('label.profile'),
        icon: 'pi pi-user',
        routerLink: '/profile',
        visible: this.checkVisible(this.authUser),
        command: () => {}
      },
      {
        label: this.parseLable('label.change_password'),
        icon: 'pi pi-eye',
        visible: this.checkVisible(this.authUser),
        command: () => {
          this.isChangePassword = true;
        }
      },
      {
        label: this.parseLable('label.upload_cv'),
        icon: 'pi pi-upload',
        visible: this.checkVisible(this.authUser),
        command: () => {
          this.isUploadCV = true;
        }
      },
      {
        label: this.parseLable('button.sign_out'),
        icon: 'pi pi-sign-out',
        visible: this.checkVisible(this.authUser),
        command: () => {
          this.logout();
        }
      },
    ];
  }

  selectedCV(ev: any) {
    if (ev) {
      let file = ev.target.files[0];
      return this.uploadCV(file);
    }
    return;
  }

  uploadCV(file: any) {
    return this.userService.uploadCV(this.authUser?.id || '', file).subscribe({
      next: (event : any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.isUploadCV = false;
          window.location.reload();
        }
      }
    })
  }

  onShowLang() {
    this.languages.filter((e) => {
      if (e.id === this.translateService.getDefaultLang()) {
        return this.langSelected = e;
      }
    })
  }

  onCancel() {
    this.isChangePassword = false;
    this.changePasswordForm.reset();
  }

  onLoadLang(ev: any) {
    if (ev) {
      this.translateService.setDefaultLang(ev.value.id);
      this.langSelected = ev.value;
    }
  }

  onChangePassword() {
    let params = {
      oldPassword: AppUtil.hasMD5(this.changePasswordForm.value.oldPassword),
      newPassword: AppUtil.hasMD5(this.changePasswordForm.value.newPassword),
      confirmNewPassword: AppUtil.hasMD5(this.changePasswordForm.value.confirmNewPassword),
    }
    
    return this.authenticatService.changePassword(AppUtil.toSnakeCaseKey(params)).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.change_password_successfully');
          this.isChangePassword = false;
          this.changePasswordForm.reset();
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.change_password_failed');
        }
      }
    )
    
  }

  onShowSubmenu(ev: any) {
    if (ev) {
      this.isShowSubMenu = !this.isShowSubMenu;
    }
  }

  checkVisible(authUser: AuthUser | undefined) {
    if (authUser?.id) {
      return true;
    }

    return false;
  }

  logout() {
    this._router.navigate(['/jobs']).then(r => {});
    return this.authenticatService.logout().subscribe(
      res => {
        if (res.status === 200) {
          this.authenticatService.deleteToken();
          this.authenticatService.clearSession();
          this.authenticatService.doResetAuthUser();
          this.authenticatService.setAuthUser(undefined)
          this.authUser = undefined;
          this.isVisible = true;
          this.isShowMenu = false;
          window.location.reload();
        }
      }
    )
  }

  onClose(ev: any) {
    if (ev) {
      this.isShowMenu = false;
      this.isVisible = false;
      this.authUser  = ev;
      this.isLogin = false;
      window.location.reload();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobileAndTablet = window.innerWidth < 800 ? true : false;
    this.isMobile = window.innerWidth < 525 ? true : false;
  }

  parseLable(label: string) {    
    return this.translateService.instant(label);
  }
}
