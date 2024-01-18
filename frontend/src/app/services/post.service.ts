import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

import { User } from '../models/User';
import { Post } from '../models/Post';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = "http://localhost:3000/post";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json"}),
  };

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,) { }

    fetchAll(): Observable<Post[]> {
      return this.http
        .get<Post[]>(this.url, { responseType: "json" })
        .pipe(
          tap({
            error: (e) => console.log(e)
          }),
          catchError(this.errorHandlerService.handleError<Post[]>("fetchAll", []))
        );
    }; 
    

    createPost(formData: Partial<Post>, userId: Pick<User, "id">): Observable<Post> {
      //corected an error in the UserId, this was retuing an Object whereas it should have been retuning the interiger value within the object
      return this.http
      .post<Post>(this.url, { title: formData.title, body: formData.body, user: userId.id }, this.httpOptions)
      .pipe(
        tap({
          error: (e) => console.log("This error comes from create post method",e)
        }),
        catchError(this.errorHandlerService.handleError<Post>("createPost"))
      )
    }

    deletePost(postId:number): Observable<{}> {
      return this.http.delete<Post>(`${this.url}/${postId}`, this.httpOptions).pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>("deletePost"))
      )
    }
}
