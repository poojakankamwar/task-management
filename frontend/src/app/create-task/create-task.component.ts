import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  createTaskForm!: FormGroup;
  fileN: any;

  constructor(private fb: FormBuilder, private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.createTaskForm = this.fb.group({
      taskName: [],
      subTaskA: [],
      subTaskB: [],
      subTaskC: [],
      subTaskD: [],
      subTaskE: [],
      remark: [],
      description: []
    })
  }


  fileChangeEvent(event: any): void {
    this.fileN = event.target.files[0]
    console.log('fileN', this.fileN);

    const file: File = event.target.files[0];
    const fileExt = this.getFileFormat(file);
    const formData = new FormData();
    formData.append('filename', event.target.files[0])
    this.taskService.uploadFile(formData).subscribe((res => {
      console.log(res);

    }))

  }

  getFileFormat(file: any) {
    return file.name.split('.').pop();
  }


  submitForms() {
    console.log(this.createTaskForm.value);
    let body = {
      taskName: this.createTaskForm.value.taskName,
      remark: this.createTaskForm.value.remark,
      description: this.createTaskForm.value.description,
      userId: localStorage.getItem('userId'),
      subtasks: [
        { name: this.createTaskForm.value.subTaskA },
        { name: this.createTaskForm.value.subTaskB },
        { name: this.createTaskForm.value.subTaskC },
        { name: this.createTaskForm.value.subTaskD },
        { name: this.createTaskForm.value.subTaskE }]
    }
    this.taskService.createTask(body).subscribe((res => {
      console.log(res);
      this.router.navigate(['/dashboard'])
    }))
  }

}
