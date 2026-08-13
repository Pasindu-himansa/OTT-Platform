import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  template: `
    <div class="splash">
      <div class="splash-logo">
        <div class="logo-icon"><i class="fa-solid fa-play"></i></div>
        <h1>OTT TV</h1>
        <p>Entertainment Unlimited</p>
      </div>
      <div class="splash-loader"></div>
    </div>
  `,
  styles: [
    `
      .splash {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
          ellipse at 50% 40%,
          #1a0a2e 0%,
          #060610 70%
        );
        position: relative;
        overflow: hidden;
        gap: 40px;
      }
      .splash::before {
        content: '';
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(255, 45, 85, 0.15),
          transparent 70%
        );
        animation: splashPulse 3s ease-in-out infinite;
      }
      .splash-logo {
        position: relative;
        z-index: 2;
        text-align: center;
        animation: splashFadeIn 1.5s ease;
      }
      .logo-icon {
        font-size: 80px;
        background: linear-gradient(135deg, #ff2d55, #5856d6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 16px;
      }
      h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 48px;
        font-weight: 800;
        letter-spacing: -2px;
        background: linear-gradient(135deg, #fff, #8888a8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p {
        color: #8888a8;
        font-size: 16px;
        margin-top: 8px;
        letter-spacing: 4px;
        text-transform: uppercase;
      }
      .splash-loader {
        width: 200px;
        height: 3px;
        background: #111125;
        border-radius: 2px;
        overflow: hidden;
        position: relative;
        z-index: 2;
      }
      .splash-loader::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #ff2d55, #5856d6);
        border-radius: 2px;
        animation: loader 2.8s ease forwards;
      }
      @keyframes splashPulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.4;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.7;
        }
      }
      @keyframes loader {
        to {
          width: 100%;
        }
      }
      @keyframes splashFadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class SplashComponent implements OnInit {
  constructor(
    private router: Router,
    private token: TokenService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.token.isLoggedIn()) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/auth/onboarding']);
      }
    }, 3000);
  }
}
