import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Data } from '../data';
import currentUser from '../../entities/currentUser';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private data: Data = inject(Data);
  signalUserProfile: WritableSignal<String> = signal<String>('');

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.signalUserProfile.set('login');
      return;
    }

    this.data.getCurrentUserData().subscribe({
      next: (response: any) => {
        this.signalUserProfile.update(() => response.name)
      },
      error: (error: any) => this.signalUserProfile.update(() => "login")
    });
  }

  manageButton():string{
    if(this.signalUserProfile() != "login" ){
      return '/profile';
    }
      return '/login';
  }
}
