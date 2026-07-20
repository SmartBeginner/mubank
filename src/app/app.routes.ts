import { Routes } from '@angular/router';
import {Home} from './home/home';
import { Login } from './login/login';
import Profile from './profile/profile';
import { Validate } from './validate/validate';
import { Admin } from './admin/admin';
import { adminGuard } from './admin/admin.guard';
import { RenderMode, ServerRoute } from '@angular/ssr';
export const routes: Routes = [
  { path: '', component: Home, title: 'mubank' },
  { path: 'login', component: Login, title: 'login' },
  { path: 'profile', component: Profile, title: 'perfil'},
  { path: 'validate', component: Validate, title: 'validar' },
  { path: 'admin', component: Admin, canActivate: [adminGuard], title: 'Administração | MUBank' },
];
