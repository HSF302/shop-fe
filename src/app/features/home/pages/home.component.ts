import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="home-container">
      
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Professional Office Attire</h1>
          <p class="hero-subtitle">
            Discover our curated collection of elegant office dresses designed for the modern professional woman.
          </p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" size="large" (click)="shopNow()">
              <mat-icon>shopping_bag</mat-icon>
              Shop Now
            </button>
            <button mat-stroked-button color="primary" size="large" (click)="learnMore()">
              <mat-icon>info</mat-icon>
              Learn More
            </button>
          </div>
        </div>
        <div class="hero-image">
          <img src="/assets/images/hero-office-dress.jpg" alt="Professional Office Dress" 
               (error)="onImageError($event, '/assets/images/placeholder-hero.jpg')">
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2>Why Choose Our Office Dresses?</h2>
          <p>Quality, style, and professionalism in every piece</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <mat-icon class="feature-icon">workspace_premium</mat-icon>
            <h3>Premium Quality</h3>
            <p>High-quality materials and expert craftsmanship ensure durability and comfort.</p>
          </div>
          
          <div class="feature-card">
            <mat-icon class="feature-icon">style</mat-icon>
            <h3>Professional Style</h3>
            <p>Timeless designs that project confidence and professionalism in any workplace.</p>
          </div>
          
          <div class="feature-card">
            <mat-icon class="feature-icon">local_shipping</mat-icon>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping to get your perfect office attire when you need it.</p>
          </div>
          
          <div class="feature-card">
            <mat-icon class="feature-icon">support_agent</mat-icon>
            <h3>Expert Support</h3>
            <p>Our styling experts are here to help you find the perfect fit and style.</p>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="featured-section">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked selections from our latest collection</p>
        </div>
        
        <div class="featured-products" *ngIf="featuredProducts$ | async as products">
          <div class="product-grid">
            <div *ngFor="let product of products.slice(0, 8)" 
                 class="featured-product" 
                 (click)="viewProduct(product)">
              <div class="product-image">
                <img [src]="product.imageUrl || '/assets/images/placeholder-dress.jpg'" 
                     [alt]="product.name"
                     (error)="onImageError($event, '/assets/images/placeholder-dress.jpg')">
                <div class="product-overlay">
                  <button mat-fab color="primary" class="view-button">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </div>
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p class="brand">{{ product.brand }}</p>
                <p class="price">{{ formatPrice(product.basePrice) }}</p>
              </div>
            </div>
          </div>
          
          <div class="view-all-section">
            <button mat-raised-button color="primary" (click)="viewAllProducts()">
              <mat-icon>arrow_forward</mat-icon>
              View All Products
            </button>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Elevate Your Professional Wardrobe?</h2>
          <p>Join thousands of professional women who trust us for their office attire needs.</p>
          <button mat-raised-button color="accent" size="large" (click)="shopNow()">
            <mat-icon>shopping_cart</mat-icon>
            Start Shopping
          </button>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home-container {
      .hero-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
        padding: 80px 20px;
        max-width: 1200px;
        margin: 0 auto;

        .hero-content {
          .hero-title {
            font-size: 3rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            line-height: 1.2;
          }

          .hero-subtitle {
            font-size: 1.2rem;
            color: #7f8c8d;
            margin-bottom: 30px;
            line-height: 1.6;
          }

          .hero-actions {
            display: flex;
            gap: 15px;

            button {
              height: 48px;
              font-size: 1rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
        }

        .hero-image {
          img {
            width: 100%;
            height: 500px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
        }
      }

      .features-section, .featured-section {
        padding: 80px 20px;
        max-width: 1200px;
        margin: 0 auto;

        .section-header {
          text-align: center;
          margin-bottom: 50px;

          h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 15px;
          }

          p {
            font-size: 1.1rem;
            color: #7f8c8d;
          }
        }
      }

      .features-section {
        background-color: #f8f9fa;

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;

          .feature-card {
            background: white;
            padding: 40px 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-5px);
            }

            .feature-icon {
              font-size: 3rem;
              width: 3rem;
              height: 3rem;
              color: #3498db;
              margin-bottom: 20px;
            }

            h3 {
              font-size: 1.3rem;
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 15px;
            }

            p {
              color: #7f8c8d;
              line-height: 1.6;
            }
          }
        }
      }

      .featured-section {
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 40px;

          .featured-product {
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-5px);

              .product-overlay {
                opacity: 1;
              }
            }

            .product-image {
              position: relative;
              height: 300px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .product-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;

                .view-button {
                  transform: scale(0.8);
                }
              }
            }

            .product-info {
              padding: 20px;
              background: white;

              h4 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 8px;
              }

              .brand {
                color: #3498db;
                font-size: 0.9rem;
                margin-bottom: 8px;
              }

              .price {
                font-size: 1.2rem;
                font-weight: 700;
                color: #27ae60;
                margin: 0;
              }
            }
          }
        }

        .view-all-section {
          text-align: center;

          button {
            height: 48px;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }

      .cta-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;

        .cta-content {
          max-width: 600px;
          margin: 0 auto;

          h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
          }

          button {
            height: 56px;
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 auto;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .home-container {
        .hero-section {
          grid-template-columns: 1fr;
          gap: 40px;
          padding: 60px 15px;

          .hero-content {
            text-align: center;

            .hero-title {
              font-size: 2rem;
            }

            .hero-actions {
              justify-content: center;
              flex-wrap: wrap;
            }
          }

          .hero-image img {
            height: 300px;
          }
        }

        .features-section, .featured-section {
          padding: 60px 15px;
        }

        .cta-section {
          padding: 60px 15px;

          .cta-content h2 {
            font-size: 2rem;
          }
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts$: Observable<Product[]>;

  constructor(
    private router: Router,
    private productsService: ProductsService
  ) {
    this.featuredProducts$ = this.productsService.getFeaturedProducts();
  }

  ngOnInit(): void {}

  shopNow(): void {
    this.router.navigate(['/products']);
  }

  learnMore(): void {
    this.router.navigate(['/about']);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  viewAllProducts(): void {
    this.router.navigate(['/products']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  onImageError(event: any, fallbackSrc: string): void {
    event.target.src = fallbackSrc;
  }
}
