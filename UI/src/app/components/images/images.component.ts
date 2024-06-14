import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { AlbumService } from './../../services/album.service';
import { LikesService } from './../../services/likes.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Image } from './../../services/images.model';
import { Album } from './../../services/album.model';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';



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
  public likesCounts: any = {};
  imageBaseUrl=environment.baseUrl+'/resources/';
  public userId: number = 0;
  public role!:string;
  public fullName : string = "";
  public albumName: string = "";
  public albumOwnerName: string = "";
  public albumId: number = 0;
  //public picId: number = 0;
  public sub?: Subscription;
  public showComponent: boolean = true;
  imageFile?:File;

  public currentPage = 1;
  public itemsPerPage = 5;

  constructor(private cdr: ChangeDetectorRef, private likesApi: LikesService, private fb : FormBuilder, private api : ApiService, private albumApi : AlbumService, private imgApi : ImagesService,private auth: AuthService, private userStore: UserStoreService, private route: ActivatedRoute) { }

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
    this.pictures.forEach((pic: any) => {
      this.getLikesCount(pic.id);
    });
    });
    this.albumApi.getAlbums()
    .subscribe(res=>{
    this.albums = res;
    console.log(this.albums.find((album:Album) => {
      console.log(this.albumId)
      return album.id === this.albumId
    }).albumName)
    this.albumName = this.albums.find((album:Album) => album.id === this.albumId).albumName
    this.albumOwnerName = this.albums.find((album:Album) => album.id === this.albumId).albumOwnerName
    this.addImageForm.setValue({albumName: this.albumName, 
      imageFile:['']})
    });
    this.addImageForm = this.fb.group({
      albumName:[''],
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
    this.userStore.getIdFromStore()
    .subscribe(val=>{
      if (this.auth.isLoggedIn()){
      const idFromToken = this.auth.getIdFromToken();
      this.userId = val || idFromToken;
      }
    });
  }
  like(picId: number) {
    console.log(picId, this.userId);
    this.likesApi.like(picId, true, Number(this.userId)).subscribe(res => {
      console.log('Liked!');
      this.updateLikesCount(picId);
    });
  }
  dislike(picId: number) {
    this.likesApi.like(picId, false, Number(this.userId)).subscribe(res => {
      console.log('Disliked!');
      this.updateLikesCount(picId);
    });
  }
  updateLikesCount(picId: number) {
    this.getLikesCount(picId);
    this.cdr.detectChanges();
  }
  getLikesCount(picId: number) {
    this.likesApi.getLikesCount(picId).subscribe(counts => {
      this.likesCounts[picId] = counts;
      console.log(this.likesCounts[picId]);
    });
  }
  onDelete(id: number) {
    if (confirm('Are you sure to delete this picture?'))
      this.imgApi.deletePicture(id)
        .subscribe({
          next: res => {
            this.imgApi.list = res as Image[]
            this.cdr.detectChanges();
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
          //alert(res.message);
        }),
        error:(err=>{
          alert(err?.error.message)
        })
      })
      this.cdr.detectChanges();
    }
  }
  onPageChange(page: number) {
    this.currentPage = page;
  }
  ngOnDestroy(){
    this.sub?.unsubscribe();
  }
}