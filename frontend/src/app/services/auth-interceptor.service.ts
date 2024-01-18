import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'; 

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    if (token) {
      const clonedRequest = req.clone({
        //edited this code to ensure the token section is a template literal which allows for sting interpolation, the token is a placeholder for the actual token logged in the local storage
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
      return next.handle(clonedRequest);

    } else {
      return next.handle(req);
    }
  }
}
