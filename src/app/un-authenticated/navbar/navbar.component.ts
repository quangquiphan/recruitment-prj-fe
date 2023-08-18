import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthUser } from 'src/app/model/auth-user.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  authUser: AuthUser | undefined;
  isMobileAndTablet: boolean = false;
  isMobile: boolean = false;
  isShowMenu: boolean = false;
  isShowSubMenu: boolean = false;
  isLogin: boolean = false;
  item: MenuItem[] = [];
  items: MenuItem[] = [];
  languages: any[] = [];

  constructor(
    private translateService: TranslateService,
    private authenticatService: AuthenticateService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.authUser = this.authenticatService.authUser;
    this.onResize();
    this.init();
  }

  init() {
    this.item = [
      {
        label: this.translateService.instant('label.sign_in'),
        icon: 'pi pi-sign-in',
        command: () => {
          this.isLogin = true;
        }
      },
      {
        label: this.translateService.instant('button.sign_out'),
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];

    this.items = [
      {
        label: this.translateService.instant('label.profile'),
        icon: 'pi pi-user',
        command: () => {}
      },
      {
        label: this.translateService.instant('label.change_password'),
        icon: 'pi pi-eye',
        command: () => {}
      },
      {
        label: this.translateService.instant('label.upload_cv'),
        icon: 'pi pi-upload',
        command: () => {}
      },
      {
        label: this.translateService.instant('button.sign_out'),
        icon: 'pi pi-sign-out',
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

  onShowSubmenu(ev: any) {
    if (ev) {
      this.isShowSubMenu = !this.isShowSubMenu;
    }
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
        }
      }
    )
  }

  onClose(ev: any) {
    if (ev) {
      this.isLogin = false;
      this.authUser  = this.authenticatService.authUser;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobileAndTablet = window.innerWidth < 800 ? true : false;
    this.isMobile = window.innerWidth < 525 ? true : false;
  }
}
