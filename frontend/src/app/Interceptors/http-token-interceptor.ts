import { Injectable, Injector } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders,
    HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { TaskListComponent } from "../task-list/task-list.component";
import { TaskService } from "../services/task.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private router: Router, private taskService: TaskService) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        var authReq = request.clone({
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.taskService.getToken()} `,
            })
        });

        return next.handle(authReq).pipe(tap(() => { },
            (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error && error.status === 401) {
                        this.router.navigate(['/login']);
                        return;
                    }

                }
            }));
    }
}
