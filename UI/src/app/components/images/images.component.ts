import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { AlbumService } from './../../services/album.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Image } from './../../services/images.model'
import { Album } from './../../services/album.model'
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  public addImageForm!: FormGroup;
  public users:any = [];
  public albums:any = [];
  public pictures:any = [];
  imageBaseUrl=environment.baseUrl+'/resources/';
  public role!:string;
  public fullName : string = "";
  public albumName: string = "";
  public albumId: number = 0;
  public sub?: Subscription;
  imageFile?:File;
  constructor(private fb : FormBuilder, private api : ApiService, private albumApi : AlbumService, private imgApi : ImagesService,private auth: AuthService, private userStore: UserStoreService, private route: ActivatedRoute) { }

  onChange(event:any){
    this.imageFile=event.target.files[0];
   }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.albumId = parseInt(params['id'])
    })
    this.api.getUsers()
    .subscribe(res=>{
    this.users = res;
    });
    this.imgApi.getPic()
    .subscribe(res=>{
    this.pictures = res;
    });
    this.albumApi.getAlbums()
    .subscribe(res=>{
    this.albums = res;
    console.log(this.albums.find((album:Album) => {
      console.log(this.albumId)
      console.log(this.albumId)
      return album.id === this.albumId
    }).albumName)
    this.albumName = this.albums.find((album:Album) => album.id === this.albumId).albumName
    this.addImageForm.setValue({albumName: this.albumName, 
      imageUrl:[''],
      imageFile:['']})
    });
    this.addImageForm = this.fb.group({
      albumName:[''],
      imageUrl:[''],
      imageFile:['']
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
    if (confirm('Are you sure to delete this picture?'))
      this.imgApi.deletePicture(id)
        .subscribe({
          next: res => {
            this.imgApi.list = res as Image[]
          },
          error: err => { console.log(err) }
        })
  }
  logout(){
   this.auth.signOut();
  } 
  onSubmit() {
    if (this.addImageForm.valid) {
      console.log(this.addImageForm.value);
      console.log(this.imageFile);
      const frmData:Image= Object.assign(this.addImageForm.value);
      frmData.imageFile=this.imageFile;
      this.imgApi.addPicture(frmData)
      .subscribe({
        next:(res=>{
          console.log(res.message);
          this.addImageForm.reset();
          alert(res.message)
        }),
        error:(err=>{
          alert(err?.error.message)
        })
      })
    }
  }
  ngOnDestroy(){
    this.sub?.unsubscribe();
  }
}