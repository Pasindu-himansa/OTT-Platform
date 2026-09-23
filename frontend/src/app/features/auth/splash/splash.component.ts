import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  template: `
    <div class="splash">
      <div class="splash-logo">
        <div class="logo-icon"><i class="fa-solid fa-play"></i></div>
        <h1>StreamVault</h1>
        <p>Premium IPTV Experience</p>
      </div>
      <div class="splash-loader"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .splash {
        min-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: radial-gradient(
          ellipse at 50% 40%,
          #1a0a2e 0%,
          #060610 70%
        );
        position: relative;
        overflow: hidden;
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

      .splash-logo h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 48px;
        font-weight: 800;
        letter-spacing: -2px;
        background: linear-gradient(135deg, #fff, #8888a8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .splash-logo p {
        color: #8888a8;
        font-size: 13px;
        margin-top: 8px;
        letter-spacing: 4px;
        text-transform: uppercase;
      }

      .splash-loader {
        margin-top: 40px;
        width: 200px;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
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
        animation: loader 2.5s ease forwards;
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
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/auth/onboarding']);
    }, 3000);
  }
}
