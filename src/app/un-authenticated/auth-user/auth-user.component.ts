import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Language } from 'src/app/model/language.model';
import { Skill } from 'src/app/model/skill.model';
import { User } from 'src/app/model/user.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { EducationService } from 'src/app/services/education.service';
import { LanguageService } from 'src/app/services/language.service';
import { ProjectService } from 'src/app/services/project.service';
import { SkillService } from 'src/app/services/skill.service';
import { UserService } from 'src/app/services/user.service';
import { WorkHistoryService } from 'src/app/services/work-history.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppData from 'src/app/utilities/app-data';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.scss']
})
export class AuthUserComponent implements OnInit{
  eduForm: FormGroup = new FormGroup({});
  infoForm: FormGroup = new FormGroup({});
  user: User | undefined;
  majors: any[] = [];
  genders: any[] = [];
  listSkills: Skill[] = [];
  listLang: Language[] = [];
  yearExperiences: any[] = [];
  isShowProject: boolean = false;
  isAddEducation: boolean = false;
  isEditInformation: boolean = false;
  isShowWorkHistory: boolean = false;
  isShowConfirmDelete: boolean = false;
  userId: string = '';
  workId: string = '';
  eduId: string = '';
  proId: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private skillService: SkillService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private educationService: EducationService,
    private workHistoryService: WorkHistoryService,
    private authenticateService: AuthenticateService,
  ) {
    this.infoForm = this.fb.group({
      email: [''],
      position: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      gender: [''],
      phone_number: ['', [
        Validators.required,
        Validators.pattern(AppConstant.PATTERNS.PHONE)
      ]],
      major: ['', Validators.required],
      summary: [''],
      link: [''],
      address: ['', Validators.required],
      year_experience: [''],
      date_of_birth: [moment().toDate()],
      skills: this.fb.array([]),
      languages: this.fb.array([]),
    });

    this.eduForm = this.fb.group({
      schoolName: ['', Validators.required],
      course: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      isCurrent: ['', Validators.required],
      description: [''],
      userId: this.userId
    })
  }

  ngOnInit(): void {  
    this.userId  =this.authenticateService.authUser?.id || ''
    this.getSkills();
    this.getLanguages();
    this.getUserInfo(this.userId);
  }

  onOpen() {
    this.isEditInformation = true;
    this.genders = AppData.getGender(this.translateService);
    this.majors = AppData.getMajor(this.translateService);
    this.yearExperiences = AppData.getYearExperience(this.translateService);
  }

  onSubmitUpdateProfile() {
    let params = {
      email: this.infoForm.value.email,
      position: this.infoForm.value.position,
      first_name: this.infoForm.value.first_name,
      last_name: this.infoForm.value.last_name,
      gender: this.infoForm.value.gender,
      phone_number: this.infoForm.value.phone_number,
      major: this.infoForm.value.major,
      summary: this.infoForm.value.summary,
      link: this.infoForm.value.link,
      address: this.infoForm.value.address,
      year_experience: this.infoForm.value.year_experience,
      date_of_birth: this.infoForm.value.date_of_birth ? 
        moment(this.infoForm.value.date_of_birth).format(AppConstant.DATE_FORMAT.POST) : '',
      skills: this.infoForm.value.skills,
      languages: this.infoForm.value.languages,
    }

    return this.userService.updateUser(this.userId, params).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.update_profile_successfully');
          this.getUserInfo(this.userId);
          this.isEditInformation = false;
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.update_profile_failed');
          this.isEditInformation = false;
        }
      }
    )
  }

  onReloadData(ev: any) {
    this.isShowWorkHistory = false;
    this.isShowProject = false;
    if (ev) {
      return [this.getUserInfo(this.userId), this.workId = '', this.proId = '']
    }
    
    return [this.workId = '', this.proId = ''];
  }

  getEducation(id: string) {
    this.isAddEducation = true;
    this.eduId = id;
    return this.educationService.getEducation(id).subscribe(
      res => {
        if (res.status === 200) {
          this.eduForm.patchValue({
            schoolName: res.data.schoolName || '',
            course: res.data.major || '',
            fromDate: moment(moment(res.data.fromDate).toDate()).format(AppConstant.DATE_FORMAT.GET) || '',
            toDate: res.data.toDate ? moment((res.data.toDate).toDate()).format(AppConstant.DATE_FORMAT.GET) : '',
            isCurrent: res.data.current || false,
            description: res.data.description || '',
            userId: this.userId
          });
        }
      }
    )
  }

  onCancelUpdateInfo() {
    this.isEditInformation = false;
    this.infoForm.reset();
  }

  onSubmitEdu() {
    let params = {
      schoolName: this.eduForm.value.schoolName,
      course: this.eduForm.value.course,
      fromDate: moment(this.eduForm.value.fromDate).format(AppConstant.DATE_FORMAT.POST),
      toDate: this.eduForm.value.toDate ? moment(this.eduForm.value.toDate).format(AppConstant.DATE_FORMAT.POST) : '',
      current: this.eduForm.value.isCurrent,
      description: this.eduForm.value.description,
      userId: this.userId
    }

    if (this.eduId) {
      return this.educationService.updateEducation(this.eduId, AppUtil.toSnakeCaseKey(params)).subscribe(
        res => {
          if (res.status === 200) {
            AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
              'message.up_education_successfully');
            this.getUserInfo(this.userId);
            this.isAddEducation = false;
            this.eduForm.reset();
            this.eduId = '';
          } else {
            AppUtil.getMessageFailed(this.messageService, this.translateService,
              'message.up_education_failed');
          }
        }
      );
    }

    return this.educationService.addEducation(AppUtil.toSnakeCaseKey(params)).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.add_education_successfully');
          this.getUserInfo(this.userId);
          this.isAddEducation = false;
          this.eduForm.reset();
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.add_education_failed');
        }
      }
    );
  }

  onCancelAddEdu() {
    this.isAddEducation = false;
    this.eduForm.reset();
    this.eduId = '';
  }

  onCancel() {
    this.eduId = '';
    this.workId = '';
    this.proId = '';
    this.isShowConfirmDelete = false
  }

  onDeleteEdu() { 
    return this.educationService.deleteEducation(this.eduId).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.delete_education_successfully');
          this.isAddEducation = false;
          this.eduForm.reset();
          this.onCancel();
          this.getUserInfo(this.userId);
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService, 
            'message.delete_education_successfully');
          this.isAddEducation = false;
          this.eduForm.reset();
          this.onCancel();
        }
      }
    )
  }

  onDeleteWorkHistory() {
    if (!this.workId) return;

    return this.workHistoryService.deleteWorkHistory(this.workId).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.delete_work_history_successfully');
          this.getUserInfo(this.userId);
          this.isShowWorkHistory = false;
          this.onCancel();
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.delete_work_history_failed');
            this.isShowWorkHistory = false;
            this.onCancel();
        }
      }
    )
  }

  onDeleteProject() {
    if (!this.proId) return;

    return this.projectService.deleteProject(this.proId).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService,
            'message.delete_project_successfully');
          this.getUserInfo(this.userId);
          this.onCancel();
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.delete_project_failed');
          this.onCancel();
        }
      }
    )
  }

  patchValueForm(data: any) {
    let s = data.skills;
    let l = data.languages;

    for (let index = 0; index < s.length; index++) {
      this.addSkill(s[index])            
    }

    for (let index = 0; index < l.length; index++) {
      this.addLang(l[index]);
    }

    return this.infoForm.patchValue({
      email: data.email || '',
      position: data.position || '',
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      gender: data.gender || '',
      phone_number: data.phoneNumber || '',
      major: data.major || '',
      summary: data.summary || '',
      link: data.link || '',
      address: data.address || '',
      year_experience: data.yearExperience || this.yearExperiences[0].id,
      date_of_birth: moment(moment(data.expiryDate, AppConstant.DATE_FORMAT.GET).toDate()).format(AppConstant.DATE_FORMAT.GET) 
    })
  }

  getLanguages() {
    return this.languageService.getAllLang().subscribe(
      res => {
        if (res.status === 200) {
          this.listLang = res.data;
        }
      }
    )
  }

  getSkills() {
    return this.skillService.getSkills().subscribe(
      res => {
        if (res.status === 200) {
          this.listSkills = res.data;
        }
      }
    )
  }

  get skills() : FormArray {
    return this.infoForm.get('skills') as FormArray;
  }

  get languages() : FormArray {
    return this.infoForm.get('languages') as FormArray;
  }

  addSkill(skill?: any) {
    if (this.listSkills.length === 0) return;
    
    return this.skills.push(
      this.fb.group({
        id: [skill ? skill.id : ''],
        skill_id: [skill ? skill.skillId : this.listSkills[0].id],
        status: [skill ? skill.status : AppConstant.STATUS.ACTIVE]
      })
    );
  }

  removeSkill(index: number) {
    if (this.skills.at(index).value.id) {
      return this.skills.controls[index].patchValue({
        status: AppConstant.STATUS.IN_ACTIVE
      })
    }

    return this.skills.removeAt(index);
  }

  checkSkill(index: number) {
    if (this.skills.at(index).value.status === AppConstant.STATUS.IN_ACTIVE) {
      return false;
    }
    return true;
  }

  addLang(lang?: any) {
    return this.languages.push(
      this.fb.group({
        id: [lang ? lang.id : ''],
        lang_id: [lang ? lang.langId : this.listLang[0].id],
        status: [lang ? lang.status : AppConstant.STATUS.ACTIVE]
      })
    );
  }

  removeLang(index: number) {
    if (this.languages.at(index).value.id) {
      return this.languages.controls[index].patchValue({
        status: AppConstant.STATUS.IN_ACTIVE
      })
    }
    
    return this.languages.removeAt(index);
  }

  checkLang(index: number) {
    if (this.languages.at(index).value.status === AppConstant.STATUS.IN_ACTIVE) {
      return false;
    }
    return true;
  }

  selectedAvatar(ev: any) {
    if (ev) {
      let file = ev.target.files[0];
      return this.uploadAvatar(file);
    }
    return;
  }

  uploadAvatar(file: any) {
    return this.userService.uploadAvatar(this.userId || '', file).subscribe({
      next: (event : any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.getUserInfo(this.userId);
          window.location.reload();
        }
      }
    })
  }

  getUserInfo(id: string) {
    this.userService.getUser(id).subscribe(
      res => {
        if (res.status === 200) {
          this.user = res.data;
          this.patchValueForm(this.user);
        }
      }
    )
  }

  getFullName(firstName: any, lastName: any) {
    return firstName + " " + lastName;
  }

  parseLabel(label: string) {
    return this.translateService.instant(label);
  }

  parseFromAndToDate(fromDate: string, toDate: string, isCurrent: boolean) {
    if (isCurrent) {
      return moment(moment(fromDate).toDate()).format(AppConstant.DATE_FORMAT.SHORT_DATE) + ' - ' +
        this.translateService.instant('label.now');
    }

    return moment(moment(fromDate).toDate()).format(AppConstant.DATE_FORMAT.SHORT_DATE) + ' - ' +
      moment(moment(toDate).toDate()).format(AppConstant.DATE_FORMAT.SHORT_DATE)
  }

  parseYearExperience(yearExperience: string) {
    if (!yearExperience) yearExperience = 'NON_EXPERIENCE';
    return this.translateService.instant(`YEAR_EXPERIENCE.${yearExperience}`);
  }

  parseGender(gender: string) {
    if (!gender) return '';

    return this.translateService.instant(`gender.${gender}`)
  }
}