import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  submit(f: NgForm) {
    if (f.invalid) return;
    this.loading = true; this.error = null;
    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => { this.loading = false; this.toast.success('Welcome'); this.router.navigate(['/movies']); },
      error: (e) => { this.loading = false; this.error = e?.error?.message || 'Login failed'; this.toast.error(this.error || 'Login failed'); }
    });
  }
}
