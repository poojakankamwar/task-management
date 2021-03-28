import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }
  get(requestUrl: string): Observable<any> {
    const url = environment.API_ENDPOINT + requestUrl;
    return this.http.get(url);
  }

  post(requestUrl: string, body: any) {
    const url = environment.API_ENDPOINT + requestUrl;
    return this.http.post(url, body);
  }

  postURL(requestUrl: string, formData: any) {
    const url = environment.API_ENDPOINT + requestUrl;
    return this.http.post(url, formData);
  }

  update(requestUrl: string, body: any): any {
    const url = environment.API_ENDPOINT + requestUrl;
    return this.http.put(url, body);
  }

  remove(requestUrl: string) {
    const url = environment.API_ENDPOINT + requestUrl;
    return this.http.delete(url);
  }

  getFile(requestUrl: string): Observable<any> {
    const url = environment.API_ENDPOINT + requestUrl;
    return this.http.get(url, { responseType: 'text' });
  }
}
