import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit{
  @Input() workId: string = '';
  @Input() id: string = '';
  @Output() onReloadData: EventEmitter<any> = new EventEmitter();
  projectForm: FormGroup = new FormGroup({});
  disable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      fromDate: [moment().toDate(), Validators.required],
      toDate: [moment().toDate(), Validators.required],
      teamSize: [1],
      technology: [''],
      description: [''],
    })
  }

  ngOnInit(): void {
    this.getProjectDetail(this.id);
  }

  getProjectDetail(id: string) {
    if (!id) return;
    
    return this.projectService.getProject(id).subscribe(
      res => {
        if (res.status === 200) {
          this.projectForm.patchValue({
            projectName: res.data.projectName,
            fromDate: moment(res.data.fromDate).format(AppConstant.DATE_FORMAT.GET),
            toDate: moment(res.data.toDate).format(AppConstant.DATE_FORMAT.GET),
            teamSize: res.data.teamSize,
            technology: res.data.technology,
            description: res.data.description,
          })
        }
      }
    )
  }

  onSubmit() {
    this.disable = true;
    let params = {
      projectName: this.projectForm.value.projectName,
      fromDate: moment(moment(this.projectForm.value.fromDate, AppConstant.DATE_FORMAT.GET).toDate())
        .format(AppConstant.DATE_FORMAT.POST),
      toDate: moment(moment(this.projectForm.value.toDate, AppConstant.DATE_FORMAT.GET).toDate())
        .format(AppConstant.DATE_FORMAT.POST),
      teamSize: this.projectForm.value.teamSize,
      technology: this.projectForm.value.technology,
      description: this.projectForm.value.description,
      workHistoryId: this.workId,
    }

    if (this.id) {
      return this.projectService.updateProject(this.id, AppUtil.toSnakeCaseKey(params)).subscribe(
        res => {
          if (res.status === 200) {
            AppUtil.getMessageSuccessfully(this.messageService, this.translateService, 
              'message.edit_project_successfully');
            this.onReloadData.emit(res.data);
          } else {
            AppUtil.getMessageFailed(this.messageService, this.translateService, 
              'message.edit_project_failed');
            this.onReloadData.emit('');
          }
        }
      )
    }
    
    return this.projectService.addProject(AppUtil.toSnakeCaseKey(params)).subscribe(
      res => {
        if (res.status === 200) {
          AppUtil.getMessageSuccessfully(this.messageService, this.translateService, 
            'message.add_project_successfully');
          this.onReloadData.emit(res.data);
        } else {
          AppUtil.getMessageFailed(this.messageService, this.translateService, 
            'message.add_project_failed');
          this.onReloadData.emit('');
        }
      }
    )
  }
}
