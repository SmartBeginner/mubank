import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Data } from '../data';

interface AdminUser {
  name: string;
  amount: number;
  entryDate: string;
}

interface Transaction {
  payer: string;
  payee: string;
  amount: number;
  description?: string;
  date: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private readonly data = inject(Data);
  private readonly fb = inject(FormBuilder);

  users = signal<AdminUser[]>([]);
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  feedback = signal('');
  feedbackType = signal<'success' | 'error'>('success');
  search = signal('');
  movementFilter = signal<'all' | 'deposit' | 'withdrawal'>('all');

  userForm = this.fb.nonNullable.group({
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER' as 'USER' | 'ADMIN', Validators.required],
  });

  totalVolume = computed(() => this.transactions().reduce((sum, item) => sum + Number(item.amount || 0), 0));
  averageTicket = computed(() => this.transactions().length ? this.totalVolume() / this.transactions().length : 0);
  largestMovement = computed(() => Math.max(0, ...this.transactions().map(item => Number(item.amount || 0))));
  filteredTransactions = computed(() => {
    const term = this.search().trim().toLocaleLowerCase('pt-BR');
    return this.transactions().filter(item => {
      const matchesTerm = !term || [item.payer, item.payee, item.description || '']
        .some(value => value.toLocaleLowerCase('pt-BR').includes(term));
      return matchesTerm;
    });
  });

  constructor() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);
    forkJoin({ users: this.data.getAllUsers(), transactions: this.data.getAllTransactions() }).subscribe({
      next: ({ users, transactions }) => {
        this.users.set(users ?? []);
        this.transactions.set(transactions ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.feedbackType.set('error');
        this.feedback.set('Não foi possível carregar os dados administrativos. Confirme se a API está disponível.');
        this.loading.set(false);
      },
    });
  }

  createUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.feedback.set('');
    this.data.createUser(this.userForm.getRawValue()).subscribe({
      next: () => {
        this.feedbackType.set('success');
        this.feedback.set('Usuário cadastrado com sucesso.');
        this.userForm.reset({ login: '', password: '', role: 'USER' });
        this.loadDashboard();
      },
      error: (error) => {
        this.feedbackType.set('error');
        this.feedback.set(error.status === 409 ? 'Este nome de usuário já está em uso.' : 'Não foi possível cadastrar o usuário.');
      },
    });
  }

  setSearch(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
