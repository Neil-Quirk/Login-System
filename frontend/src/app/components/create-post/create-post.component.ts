import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { first, tap } from 'rxjs';
import { Post } from 'src/app/models/Post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit{
  @ViewChild("formDirective") formDirective!: NgForm;
  @Output() create: EventEmitter<any> = new EventEmitter(); 
  


  form!: FormGroup;

  isOpen = false;

  constructor(
    private authService: AuthService,
    private postService:PostService) {}
  
  ngOnInit(): void {
    this.form = this.createFormGroup();
  }
  
  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [
        Validators.required, 
        Validators.minLength(5)
      ]),
      body: new FormControl("", [
        Validators.required, 
        Validators.minLength(10)]),
    });

}

onSubmit(formData: Pick<Post, "title" | "body">):void {
  this.postService.createPost(formData, this.authService.userId).pipe(

    first()).subscribe(() => { this.create.emit(null)})
  ;
  console.log(this.authService.userId)
  this.form.reset();
  this.formDirective.resetForm();
}
}
