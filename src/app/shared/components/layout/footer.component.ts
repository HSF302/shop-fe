import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Office Dress Shop</h3>
          <p>Your premier destination for professional office attire.</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/products">Products</a></li>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a routerLink="/help">Help Center</a></li>
            <li><a routerLink="/returns">Returns</a></li>
            <li><a routerLink="/shipping">Shipping Info</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Connect With Us</h4>
          <div class="social-links">
            <button mat-icon-button>
              <mat-icon>facebook</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>twitter</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>instagram</mat-icon>
            </button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 Office Dress Shop. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #2c3e50;
      color: white;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .footer-section {
      h3, h4 {
        margin-bottom: 15px;
        color: #ecf0f1;
      }

      p {
        color: #bdc3c7;
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 8px;

          a {
            color: #bdc3c7;
            text-decoration: none;
            transition: color 0.3s;

            &:hover {
              color: #3498db;
            }
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 10px;

      button {
        color: #bdc3c7;

        &:hover {
          color: #3498db;
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid #34495e;
      padding: 20px;
      text-align: center;
      background-color: #1a252f;

      p {
        margin: 0;
        color: #7f8c8d;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        padding: 30px 15px;
        gap: 25px;
      }
    }
  `]
})
export class FooterComponent {}
