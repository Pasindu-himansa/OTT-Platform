import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card fade-up">
        <a class="auth-back" routerLink="/auth/login">
          <i class="fa-solid fa-arrow-left"></i> Back to Login
        </a>

        @if (!otpSent) {
          <h2>Forgot Password?</h2>
          <p class="subtitle">Enter your email to receive an OTP</p>

          @if (error) {
            <div class="error-msg">
              <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
            </div>
          }

          <form (ngSubmit)="sendOtp()">
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-full btn-lg"
              [disabled]="loading"
            >
              {{ loading ? 'Sending OTP...' : 'Send OTP' }}
            </button>
          </form>
        }

        @if (otpSent && !passwordReset) {
          <h2>Verify OTP</h2>
          <p class="subtitle">Enter the 6-digit OTP sent to {{ email }}</p>

          @if (error) {
            <div class="error-msg">
              <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
            </div>
          }

          <form (ngSubmit)="verifyOtp()">
            <div class="otp-inputs">
              @for (i of [0, 1, 2, 3, 4, 5]; track i) {
                <input
                  type="text"
                  maxlength="1"
                  class="otp-input"
                  [(ngModel)]="otpDigits[i]"
                  [name]="'otp' + i"
                  (input)="onOtpInput($event, i)"
                  (keydown)="onOtpKeydown($event, i)"
                  [id]="'otp' + i"
                />
              }
            </div>

            <div class="form-group" style="margin-top:16px">
              <label>New Password</label>
              <input
                type="password"
                [(ngModel)]="newPassword"
                name="newPassword"
                placeholder="Enter new password"
              />
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-full btn-lg"
              [disabled]="loading"
            >
              {{ loading ? 'Verifying...' : 'Reset Password' }}
            </button>

            <div style="text-align:center;margin-top:16px">
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                (click)="sendOtp()"
              >
                Resend OTP
              </button>
            </div>
          </form>
        }

        @if (passwordReset) {
          <div style="text-align:center;padding:24px 0">
            <i
              class="fa-solid fa-circle-check"
              style="font-size:48px;color:var(--success);margin-bottom:16px;display:block"
            ></i>
            <h2>Password Reset!</h2>
            <p class="subtitle">Your password has been reset successfully.</p>
            <button
              class="btn btn-primary btn-full btn-lg"
              style="margin-top:24px"
              routerLink="/auth/login"
            >
              Back to Login
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg);
        padding: 24px;
      }
      .auth-card {
        width: 100%;
        max-width: 420px;
        padding: 40px;
        h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .subtitle {
          color: var(--text-dim);
          margin-bottom: 32px;
        }
      }
      .auth-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-dim);
        margin-bottom: 32px;
        font-size: 14px;
        transition: 0.2s;
        &:hover {
          color: var(--text);
        }
      }
      .error-msg {
        background: rgba(255, 45, 85, 0.1);
        border: 1px solid rgba(255, 45, 85, 0.3);
        color: #ff6b8a;
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        font-size: 13px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .otp-inputs {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-bottom: 8px;
      }
      .otp-input {
        width: 52px;
        height: 56px;
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        border-radius: var(--radius-sm);
        background: var(--surface);
        border: 2px solid var(--border);
        color: var(--text);
        &:focus {
          border-color: var(--accent);
          outline: none;
        }
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  email = '';
  otpDigits = ['', '', '', '', '', ''];
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  otpSent = false;
  passwordReset = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  get otp(): string {
    return this.otpDigits.join('');
  }

  sendOtp(): void {
    if (!this.email) {
      this.error = 'Please enter your email';
      return;
    }
    this.loading = true;
    this.error = '';
    this.http
      .post(`${environment.apiUrl}/auth/forgot-password`, { email: this.email })
      .subscribe({
        next: () => {
          this.otpSent = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to send OTP';
          this.loading = false;
        },
      });
  }

  verifyOtp(): void {
    if (this.otp.length !== 6) {
      this.error = 'Please enter the complete OTP';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    if (this.newPassword.length < 8) {
      this.error = 'Password must be at least 8 characters';
      return;
    }

    this.loading = true;
    this.error = '';
    this.http
      .post(`${environment.apiUrl}/auth/verify-otp`, {
        email: this.email,
        otp: this.otp,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.passwordReset = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Invalid OTP';
          this.loading = false;
        },
      });
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    if (val && index < 5) {
      document.getElementById('otp' + (index + 1))?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      document.getElementById('otp' + (index - 1))?.focus();
    }
  }
}
