import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Data } from '../data';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private data = inject(Data);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  loginForm = this.fb.group({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  submitLogin() {
    this.data.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log("Logado com sucesso ", isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '');
        const tokenValue = response.token;
        isPlatformBrowser(this.platformId) ? localStorage.setItem('token', tokenValue) : '';
        isPlatformBrowser(this.platformId) ? localStorage.setItem('name', <string>this.loginForm.value.login) : '';
        this.data.getAllTransactions().subscribe({
          next: () => this.router.navigate(['/admin']),
          error: () => this.router.navigate(['/profile']),
        });

      },
      error: (err) => {
      console.error('Erro ao fazer login:', err);
      alert('Usuário ou senha inválidos!');
      }
  });
  }
}
