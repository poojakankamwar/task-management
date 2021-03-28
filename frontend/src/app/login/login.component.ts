import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [],
      password: []
    })
  }


  loginFormSubmit() {
    console.log(this.loginForm.value);
    this.taskService.loginUser(this.loginForm.value).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('access_token', res.token);
      localStorage.setItem('userId', res.login._id);
      this.router.navigate(['/dashboard'])
    })
  }

}
