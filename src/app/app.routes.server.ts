import { RenderMode, ServerRoute } from '@angular/ssr';
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import Profile from './profile/profile';
import { Validate } from './validate/validate';

export const serverRoutes: ServerRoute[] = [
  { path: 'profile',
    renderMode: RenderMode.Client
  },
  { path: 'admin',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
];
