import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ]
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  @Input() filters: any = {};
  @Output() filtersChanged = new EventEmitter<any>();

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  categories = [
    'Business Formal',
    'Business Casual',
    'Cocktail Dress',
    'Shirt Dress',
    'Blazer Dress'
  ];

  brands = [
    'Professional Elegance',
    'Corporate Chic',
    'Executive Style'
  ];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  colors = [
    'Black',
    'Navy Blue',
    'Charcoal Gray',
    'Burgundy',
    'Emerald Green',
    'Royal Blue',
    'Cream',
    'Wine Red'
  ];

  materials = [
    'Wool Blend',
    'Cotton',
    'Polyester',
    'Silk',
    'Linen',
    'Viscose'
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      brand: [''],
      minPrice: [null],
      maxPrice: [null],
      size: [''],
      color: [''],
      material: [''],
      inStock: [false]
    });
  }

  ngOnInit(): void {
    // Initialize form with current filters
    if (this.filters) {
      this.filterForm.patchValue(this.filters);
    }

    // Listen for form changes and emit with debounce
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(filters => {
        // Remove empty values
        const cleanFilters = Object.keys(filters).reduce((acc, key) => {
          if (filters[key] !== null && filters[key] !== '' && filters[key] !== false) {
            acc[key] = filters[key];
          }
          return acc;
        }, {} as any);

        this.filtersChanged.emit(cleanFilters);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filtersChanged.emit({});
  }

  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return Object.keys(values).some(key => 
      values[key] !== null && values[key] !== '' && values[key] !== false
    );
  }
}
