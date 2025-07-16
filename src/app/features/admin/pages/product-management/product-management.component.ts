import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="management-container">
      <h1>Product Management</h1>
      <mat-card>
        <mat-card-content>
          <p>Product management functionality will be implemented here.</p>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add New Product
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .management-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
  `]
})
export class ProductManagementComponent {}
