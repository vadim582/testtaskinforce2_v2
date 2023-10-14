import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from './../../services/api.service';
import { AlbumService } from './../../services/album.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Album } from './../../services/album.model'
@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  public addAlbumForm!: FormGroup;
  public users:any = [];
  public albums:any = [];
  public role!:string;
  public fullName : string = "";
  constructor(private api : ApiService, private albumApi : AlbumService, private auth: AuthService, private userStore: UserStoreService, private router: Router) { }

  ngOnInit() {
    this.api.getUsers()
    .subscribe(res=>{
    this.users = res;
    });

    this.albumApi.getAlbums()
    .subscribe(res=>{
    this.albums = res;
    });
    
    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      if (this.auth.isLoggedIn()){
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken
      }
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      if (this.auth.isLoggedIn()){
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      }
    });
  }
  onDelete(id: number) {
    if (confirm('Are you sure to delete this record?'))
      this.albumApi.deleteAlbum(id)
        .subscribe({
          next: res => {
            this.albumApi.list = res as Album[]
          },
          error: err => { console.log(err) }
        })
  }
  logout(){
   this.auth.signOut();
  }
  }
