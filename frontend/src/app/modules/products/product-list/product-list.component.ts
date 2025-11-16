import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  displayedColumns = ['image','name','price','categoryId','actions'];
  data = [];
  total = 0;
  isLoading = false;

  filterForm = this.fb.group({
    search: [''],
    categoryId: [''],
    minPrice: [''],
    maxPrice: [''],
    sort: ['price:asc']
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    // trigger load after view init
    setTimeout(() => this.initDataStream(), 0);
  }

  initDataStream() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          const params: any = {
            page: this.paginator.pageIndex + 1 || 1,
            limit: this.paginator.pageSize || 10,
            sort: `${this.sort.active || 'price'}:${this.sort.direction || 'asc'}`,
            search: this.filterForm.value.search || '',
            categoryId: this.filterForm.value.categoryId || '',
            minPrice: this.filterForm.value.minPrice || '',
            maxPrice: this.filterForm.value.maxPrice || ''
          };
          return this.productService.getAdvanced(params);
        }),
        map((res: any) => {
          this.isLoading = false;
          this.total = res.total;
          return res.products;
        }),
        catchError(err => {
          this.isLoading = false;
          this.snack.open('Error loading products', 'Close', { duration: 2500 });
          return of([]);
        })
      ).subscribe(data => (this.data = data));
  }

  applyFilters() {
    // reset paginator
    this.paginator.pageIndex = 0;
    // trigger change detection by emitting sortChange
    this.sort.sortChange.emit();
  }

  export(format: 'csv' | 'xlsx') {
    const filters = this.filterForm.value;
    this.productService.export(format, filters).subscribe(blob => {
      saveAs(blob, `products.${format}`);
    });
  }

  onDelete(id: string) {
    if (!confirm('Delete product?')) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.snack.open('Deleted', 'Close', { duration: 1500 });
        this.sort.sortChange.emit();
      }
    });
  }
}
