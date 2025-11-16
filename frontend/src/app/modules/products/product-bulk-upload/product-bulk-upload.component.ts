import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-bulk-upload',
  templateUrl: './product-bulk-upload.component.html',
  styleUrls: ['./product-bulk-upload.component.scss']
})
export class ProductBulkUploadComponent {
  loading = false;

  constructor(private productService: ProductService, private snack: MatSnackBar) {}

  onFileSelected(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    this.loading = true;

    this.productService.bulkUpload(file).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snack.open(`Processed: ${res.processed}/${res.total}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.loading = false;
        this.snack.open(err?.error?.message || 'Upload failed', 'Close', { duration: 4000 });
      }
    });
  }
}
