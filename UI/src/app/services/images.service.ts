import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from './images.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private baseUrl: string = 'https://localhost:7058/api/Picture/';
  list: Image[] =[]

  constructor(private http: HttpClient) {}

  getPic() {
    return this.http.get<any>(this.baseUrl);
  }
  addPicture(imgObj: Image) {
    let formData = new FormData();
    formData.append("albumName",imgObj.albumName);
    formData.append("imageUrl",imgObj.imageUrl);
    formData.append("imageFile",imgObj.imageFile??"");
    return this.http.post<any>(`${this.baseUrl}addPicture`, formData)
  }
  
  deletePicture(id: number) {
    return this.http.delete(this.baseUrl + id)
  }
}
