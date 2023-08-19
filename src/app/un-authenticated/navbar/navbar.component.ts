import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthUser } from 'src/app/model/auth-user.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

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
  lang: string = 'en';

  constructor(
    private fb: FormBuilder,
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
    this.init();
    this.authUser = this.authenticatService.authUser;
    this.onResize();
  }

  init() {
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
        label: this.parseLable('label.profile'),
        icon: 'pi pi-user',
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
        command: () => {}
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

    this.languages = [
      {
        id: 'en',
        label: this.translateService.instant('label.english')
      },
      {
        id: 'vn',
        label: this.translateService.instant('label.vietnamese')
      }
    ]
  }

  onCancel() {
    this.isChangePassword = false;
    this.changePasswordForm.reset();
  }

  onLoadLang(ev: any) {
    if (ev) {
      this.translateService.setDefaultLang(ev.value);
      this.init();
      console.log(this.translateService.instant('label.english'));
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
    return this.authenticatService.logout().subscribe(
      res => {
        if (res.status === 200) {
          this.authenticatService.deleteToken();
          this.authenticatService.clearSession();
          this.authenticatService.doResetAuthUser();
          this.authenticatService.setAuthUser(undefined)
          this.authUser = undefined;
          this.isVisible = true;         
        }
      }
    )
  }

  onClose(ev: any) {
    if (ev) {
      this.isLogin = false;
      this.authUser  = this.authenticatService.authUser;
      this.isVisible = false;
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
