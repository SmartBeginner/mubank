import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Data } from '../data';
import { Router } from '@angular/router';
import currentUser from '../../entities/currentUser';
import { DepositView } from '../deposit-view/deposit-view';

@Component({
  selector: 'app-profile',
  imports: [DepositView],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
class Profile {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private data: Data = inject(Data);

  //esse mano ai que resolveu a renderização, os tal dos Signal
  signalUserProfile: WritableSignal<currentUser> = signal<currentUser>(new currentUser());

  ngOnInit() {
    this.data.getCurrentUserData().subscribe({
      next: (response: currentUser) => {
        this.signalUserProfile.update(() => response);
      },
      error: (error: any) => this.router.navigate(['/']),
    });
  }

  protected readonly currentUser = currentUser;
}

export default Profile
