import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { WorkHistoryService } from 'src/app/services/work-history.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnInit{
  @Input() id: string = '';
  @Input() userId: string = '';
  @Output() onReloadData: EventEmitter<any> = new EventEmitter();
  workHistoryForm: FormGroup = new FormGroup({});
  isCurrent: boolean = false;
  disable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private translateService: TranslateService,
    private workHistoryService: WorkHistoryService,
  ) {
    this.workHistoryForm = this.fb.group({
      companyName: ['', Validators.required],
      fromDate: [moment().toDate(), Validators.required],
      toDate: [moment().toDate(), Validators.required],
      isCurrent: [''],
      description: [''],
      position: [''],
      userId: this.userId,
      projects: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getWorkHistory(this.id);
  }

  onSubmit() {
    this.disable = true;
    for (let i = 0; i < this.projects.value.length; i++) {
      this.projects.at(i).patchValue({
        from_date: moment(this.workHistoryForm.value.fromDate).format(AppConstant.DATE_FORMAT.POST),
        to_date: moment(this.workHistoryForm.value.toDate).format(AppConstant.DATE_FORMAT.POST),
      })
    }
    
    let params = {
      company_name: this.workHistoryForm.value.companyName,
      from_date: moment(moment(this.workHistoryForm.value.fromDate, AppConstant.DATE_FORMAT.GET).toDate())
        .format(AppConstant.DATE_FORMAT.POST),
      to_date: moment(moment(this.workHistoryForm.value.toDate, AppConstant.DATE_FORMAT.GET).toDate())
        .format(AppConstant.DATE_FORMAT.POST),
      is_current: this.workHistoryForm.value.isCurrent,
      position: this.workHistoryForm.value.position,
      description: this.workHistoryForm.value.description,
      user_id: this.userId,
      projects: this.workHistoryForm.value.projects
    }
    if (this.id) {
      delete params.projects;
      
      return this.workHistoryService.updateWorkHistory(this.id, params).subscribe(
        res => {
          if (res.status === 200) {
            AppUtil.getMessageSuccessfully(this.messageService, this.translateService, 
              'message.edit_work_history_successfully');
            this.onReloadData.emit(params);
          } else {
            AppUtil.getMessageFailed(this.messageService, this.translateService,
              'message.edit_work_history_failed');
            this.onReloadData.emit('');
          }
        }
      )
    }

    return this.workHistoryService.addWorkHistory(params).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService, 
            'message.add_work_history_successfully');
          this.onReloadData.emit(params);
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService,
            'message.add_work_history_failed');
          this.onReloadData.emit('');
        }
      }
    )
  }

  onCancel() {
    this.onReloadData.emit('');
  }

  onCurrent(ev: any){
    if (ev) {
      this.isCurrent = ev;
    }
  }

  getWorkHistory(id: string) {
    if (!id) return;
    return this.workHistoryService.getWorkHistory(id).subscribe(
      res => {
        if (res.status === 200) {
          this.workHistoryForm.patchValue({
            companyName: res.data.companyName,
            fromDate: moment(res.data.fromDate).format(AppConstant.DATE_FORMAT.GET),
            toDate: moment(res.data.toDate).format(AppConstant.DATE_FORMAT.GET),
            isCurrent: res.data.current,
            description: res.data.description,
            position: res.data.position,
            userId: res.data.userId
          })
        }
      }
    )
  }

  get projects() : FormArray {
    return this.workHistoryForm.get('projects') as FormArray;
  }

  addProjects(project?: any) {
    return this.projects.push(
      this.fb.group({
        project_name: [project?.projectName || '', Validators.required],
        from_date: [project?.fromDate || moment().toDate(), Validators.required],
        to_date: [project?.toDate || moment().toDate(), Validators.required],
        team_size: [project?.teamSize || 1],
        technology: [project?.technology || ''],
        description: [project?.description || ''],
      })
    );
  }

  removeProject(index: number) {
    return this.projects.removeAt(index);
  }
}
