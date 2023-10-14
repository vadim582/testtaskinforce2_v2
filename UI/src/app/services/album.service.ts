import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from './album.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private baseUrl: string = 'https://localhost:7058/api/Album/';
  list: Album[] =[]

  constructor(private http: HttpClient) {
  }

  getAlbums() {
    return this.http.get<any>(this.baseUrl);
  }

  addAlbum(albumObj: any) {
    return this.http.post<any>(`${this.baseUrl}addAlbum`, albumObj)
  }
  
  deleteAlbum(id: number) {
    return this.http.delete(this.baseUrl + id)
  }
}
