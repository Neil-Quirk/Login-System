import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/auth.service';

import { Post } from 'src/app/models/Post';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit{

  posts$!: Observable<Post[]>;
  userId: Pick<User, "id"> | undefined;

  constructor(
    private postService: PostService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.posts$ = this.fetchAll();
    this.userId = this.authService.userId;
    
  }

  fetchAll(): Observable<Post[]> {
    return this.postService.fetchAll();
  }

  createPost(): void {
    this.posts$ = this.fetchAll()
  }

  delete(post: Pick<Post, "id">): void {
    const postId = post.id;
    this.postService
      .deletePost(postId)
      .subscribe({
        next: () => {
          console.log('Successfully deleted post', postId);
          this.posts$ = this.fetchAll();
        },
        error: (err) => {
          console.error('Error deleting post', postId, err);
        }
      });
   }
}
