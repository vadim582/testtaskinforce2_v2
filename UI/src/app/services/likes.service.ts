import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl = 'https://localhost:7058/api/Likes/';

  constructor(private http: HttpClient) { }

  like(picId: number, isLike: boolean, userId: number) {
    const body: any = { picId, isLike, userId };
    return this.http.post<any>(`${this.baseUrl}like`, body);
  }
  getLikesCount(picId: number) {
    return this.http.get<{ LikesCount: number, DislikesCount: number }>(`${this.baseUrl}likes-count/${picId}`);
  }
}