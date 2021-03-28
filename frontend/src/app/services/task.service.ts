import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpService) { }

  loginUser(data: any) {
    const url = `/users/login`;
    return this.http.post(url, data)
  }

  getToken() {
    return localStorage.getItem("access_token");
  }

  getAllTask(p: number) {
    let userId = localStorage.getItem('userId');
    const url = `/tasks?userId=${userId}&page=${p}`;
    return this.http.get(url)
  }


  uploadFile(data: any) {
    const url = `/tasks/uploadDoc`;
    return this.http.post(url, data)
  }

  createTask(data: any) {
    const url = `/tasks/createTask`;
    return this.http.post(url, data)
  }

  uploadStatus(data: any) {
    const url = `/tasks/updateTaskStatus`;
    return this.http.post(url, data)
  }
}
