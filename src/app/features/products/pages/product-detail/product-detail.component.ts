import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Product } from '../../../../core/models/product.model';
import { ProductsState } from '../../../../store/products/products.state';
import * as ProductsActions from '../../../../store/products/products.actions';
import * as ProductsSelectors from '../../../../store/products/products.selectors';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product$: Observable<Product | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  addToCartForm: FormGroup;
  selectedImageIndex = 0;
  quantity = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{ products: ProductsState }>,
    private fb: FormBuilder
  ) {
    this.product$ = this.store.select(ProductsSelectors.selectSelectedProduct);
    this.loading$ = this.store.select(ProductsSelectors.selectLoading);
    this.error$ = this.store.select(ProductsSelectors.selectError);

    this.addToCartForm = this.fb.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      material: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.store.dispatch(ProductsActions.loadProduct({ id: productId }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImageSelect(index: number): void {
    this.selectedImageIndex = index;
  }

  onAddToCart(): void {
    if (this.addToCartForm.valid) {
      const formValue = this.addToCartForm.value;
      // Dispatch add to cart action
      console.log('Add to cart:', formValue);
    }
  }

  onBuyNow(): void {
    if (this.addToCartForm.valid) {
      this.onAddToCart();
      this.router.navigate(['/checkout']);
    }
  }

  getFormattedPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  calculateTotalPrice(product: Product): number {
    if (!product || !this.addToCartForm.valid) {
      return product?.basePrice || 0;
    }

    const formValue = this.addToCartForm.value;
    let total = product.basePrice;

    // Add size price
    const selectedSize = product.sizes?.find(s => s.id === formValue.size);
    if (selectedSize) {
      total += selectedSize.additionalPrice;
    }

    // Add color price
    const selectedColor = product.colors?.find(c => c.id === formValue.color);
    if (selectedColor) {
      total += selectedColor.additionalPrice;
    }

    // Add material price
    const selectedMaterial = product.materials?.find(m => m.id === formValue.material);
    if (selectedMaterial) {
      total += selectedMaterial.additionalPrice;
    }

    return total * formValue.quantity;
  }

  isInStock(product: Product): boolean {
    return product?.quantity > 0;
  }

  getStockStatus(product: Product): string {
    if (!product) return '';
    
    if (product.quantity === 0) {
      return 'Out of Stock';
    } else if (product.quantity < 5) {
      return `Only ${product.quantity} left in stock`;
    }
    return 'In Stock';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/placeholder-dress.jpg';
  }
}
