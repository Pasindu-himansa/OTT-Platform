import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPw = '';
  showPass = false;
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }
    if (this.password !== this.confirmPw) {
      this.error = 'Passwords do not match';
      return;
    }
    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
