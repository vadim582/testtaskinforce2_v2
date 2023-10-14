import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { AlbumService } from './../../services/album.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Album } from './../../services/album.model'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public addAlbumForm!: FormGroup;
  public users:any = [];
  public albums:any = [];
  public role!:string;
  public fullName : string = "";
  constructor(private fb : FormBuilder, private api : ApiService, private albumApi : AlbumService, private auth: AuthService, private userStore: UserStoreService) { }

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
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
    
    this.addAlbumForm = this.fb.group({
      albumName:[''],
      albumOwnerName:this.fullName
    })
  }
  onDelete(id: number) {
    if (confirm('Are you sure to delete this album?'))
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
  onSubmit() {
    if (this.addAlbumForm.valid) {
      console.log(this.addAlbumForm.value);
      let albumObj = {
        ...this.addAlbumForm.value
      }
      this.albumApi.addAlbum(albumObj)
      .subscribe({
        next:(res=>{
          console.log(res.message);
          this.addAlbumForm.reset();
          alert(res.message)
        }),
        error:(err=>{
          alert(err?.error.message)
        })
      })
    }
  }
}
