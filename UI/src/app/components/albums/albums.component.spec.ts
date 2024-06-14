import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AlbumsComponent } from './albums.component';
import { ApiService } from './../../services/api.service';
import { AlbumService } from './../../services/album.service';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Album } from './../../services/album.model';

describe('AlbumsComponent', () => {
  let component: AlbumsComponent;
  let fixture: ComponentFixture<AlbumsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let albumServiceSpy: jasmine.SpyObj<AlbumService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userStoreServiceSpy: jasmine.SpyObj<UserStoreService>;

  beforeEach(async () => {
    const apiService = jasmine.createSpyObj('ApiService', ['getUsers']);
    const albumService = jasmine.createSpyObj('AlbumService', ['getAlbums', 'deleteAlbum']);
    const authService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getfullNameFromToken', 'getRoleFromToken', 'signOut']);
    const userStoreService = jasmine.createSpyObj('UserStoreService', ['getFullNameFromStore', 'getRoleFromStore']);

    await TestBed.configureTestingModule({
      declarations: [AlbumsComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AlbumService, useValue: albumService },
        { provide: AuthService, useValue: authService },
        { provide: UserStoreService, useValue: userStoreService },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumsComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    albumServiceSpy = TestBed.inject(AlbumService) as jasmine.SpyObj<AlbumService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userStoreServiceSpy = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;

    apiServiceSpy.getUsers.and.returnValue(of([{ id: 1, name: 'User 1' }]));
    albumServiceSpy.getAlbums.and.returnValue(of([{ id: 1, albumName: 'Album 1' }]));
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getfullNameFromToken.and.returnValue('Test User');
    authServiceSpy.getRoleFromToken.and.returnValue('Admin');

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.users).toBeDefined();
    expect(component.albums).toBeDefined();
    expect(component.role).toBe('Admin');
    expect(component.fullName).toBe('Test User');
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(5);
  });

  it('should load users and albums on initialization', () => {
    expect(apiServiceSpy.getUsers).toHaveBeenCalled();
    expect(albumServiceSpy.getAlbums).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.albums.length).toBe(1);
  });

  it('should update currentPage on onPageChange', () => {
    const newPage = 2;
    component.onPageChange(newPage);
    expect(component.currentPage).toBe(newPage);
  });

  it('should delete album on onDelete', () => {
    const albumId = 1;
    spyOn(window, 'confirm').and.returnValue(true);

    component.onDelete(albumId);
    expect(albumServiceSpy.deleteAlbum).toHaveBeenCalledWith(albumId);
  });

  it('should logout on calling logout method', () => {
    component.logout();
    expect(authServiceSpy.signOut).toHaveBeenCalled();
  });
});