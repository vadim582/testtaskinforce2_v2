import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ImagesComponent } from './images.component';
import { ImagesService } from 'src/app/services/images.service';
import { LikesService } from 'src/app/services/likes.service';
import { AlbumService } from 'src/app/services/album.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ChangeDetectorRef, DebugElement } from '@angular/core';

describe('ImagesComponent', () => {
  let component: ImagesComponent;
  let fixture: ComponentFixture<ImagesComponent>;
  let imagesServiceSpy: jasmine.SpyObj<ImagesService>;
  let likesServiceSpy: jasmine.SpyObj<LikesService>;
  let albumServiceSpy: jasmine.SpyObj<AlbumService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userStoreServiceSpy: jasmine.SpyObj<UserStoreService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    const imagesService = jasmine.createSpyObj('ImagesService', ['getPic', 'addPicture', 'deletePicture']);
    const likesService = jasmine.createSpyObj('LikesService', ['like', 'getLikesCount']);
    const albumService = jasmine.createSpyObj('AlbumService', ['getAlbums']);
    const apiService = jasmine.createSpyObj('ApiService', ['getUsers']);
    const authService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getfullNameFromToken', 'getRoleFromToken', 'signOut']);
    const userStoreService = jasmine.createSpyObj('UserStoreService', ['getFullNameFromStore', 'getRoleFromStore', 'getIdFromStore']);
    const activatedRoute = jasmine.createSpyObj('ActivatedRoute', [], { params: of({ id: '1' }) });

    await TestBed.configureTestingModule({
      declarations: [ImagesComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ImagesService, useValue: imagesService },
        { provide: LikesService, useValue: likesService },
        { provide: AlbumService, useValue: albumService },
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: UserStoreService, useValue: userStoreService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        FormBuilder,
        ChangeDetectorRef
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesComponent);
    component = fixture.componentInstance;
    imagesServiceSpy = TestBed.inject(ImagesService) as jasmine.SpyObj<ImagesService>;
    likesServiceSpy = TestBed.inject(LikesService) as jasmine.SpyObj<LikesService>;
    albumServiceSpy = TestBed.inject(AlbumService) as jasmine.SpyObj<AlbumService>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userStoreServiceSpy = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    const mockUsers = [{ id: 1, name: 'User 1' }];
    const mockAlbums = [{ id: 1, albumName: 'Album 1', albumOwnerName: 'Owner 1' }];
    const mockPictures = [{ id: 1, imageUrl: 'image1.jpg' }];

    apiServiceSpy.getUsers.and.returnValue(of(mockUsers));
    albumServiceSpy.getAlbums.and.returnValue(of(mockAlbums));
    imagesServiceSpy.getPic.and.returnValue(of(mockPictures));

    component.ngOnInit();

    expect(component.users).toEqual(mockUsers);
    expect(component.albums).toEqual(mockAlbums);
    expect(component.pictures).toEqual(mockPictures);
    expect(component.albumName).toBe('Album 1');
    expect(component.albumOwnerName).toBe('Owner 1');
    expect(component.addImageForm).toBeDefined();
    expect(component.showComponent).toBeTrue();
  });

  it('should handle image file change', () => {
    const event = {
      target: {
        files: [new File(['fake-image'], 'image.jpg', { type: 'image/jpeg' })]
      }
    };

    component.onChange(event);
    expect(component.imageFile).toBeDefined();
    expect(component.imageFile?.name).toBe('image.jpg');
  });

});