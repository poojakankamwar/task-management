import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  currentTime: any;
  listOfTask: any;
  p = 1;
  pageSize = 5;
  total!: number;
  constructor(private taskService: TaskService) { }
  itemsPerPage = [{ status: 'pending' }, { status: 'completed' }, { status: 'in-completed' }, { status: 'in-process' }];


  ngOnInit() {
    this.getAllTask()
  }
  getAllTask() {
    this.taskService.getAllTask(this.p).subscribe((res => {
      console.log(res);
      this.listOfTask = res.tasks;
      this.p = res.current_page;
      this.pageSize = res.per_page;
      this.total = res.total;

    }))
  }

  changePage(p: number) {
    console.log(p);
    this.taskService.getAllTask(p).subscribe((res => {
      console.log(res);
      this.listOfTask = res.tasks;
      this.p = res.current_page;
      this.pageSize = res.per_page;
      this.total = res.total;
    }))
  }


  selectPageSize(event: any, Id: any) {
    let body = {
      status: event.target.value,
      taskId: Id
    }

    this.taskService.uploadStatus(body).subscribe((res => {
      console.log(res);
      this.getAllTask();
    }))
  }
}
