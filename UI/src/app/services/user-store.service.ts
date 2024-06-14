import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
private fullName$ = new BehaviorSubject<string>("");
private role$ = new BehaviorSubject<string>("");
private userId$ = new BehaviorSubject<number>(0);

constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }
  public setRoleForStore(role:string){
    this.role$.next(role);
  }
  public getFullNameFromStore(){
    return this.fullName$.asObservable();
  }
  public setFullNameForStore(fullname:string){
    this.fullName$.next(fullname)
  }
  public getIdFromStore(){
    return this.userId$.asObservable();
  }
  public setIdForStore(userId:number){
    this.userId$.next(userId)
  }
}
