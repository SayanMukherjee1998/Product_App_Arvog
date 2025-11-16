import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  constructor(private svc: CategoryService, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }
  load() {
    this.svc.list().subscribe((res: any) => (this.categories = res.categories || res));
  }
  delete(id: string) {
    if (!confirm('Delete?')) return;
    this.svc.delete(id).subscribe(() => {
      this.snack.open('Deleted', 'Close', { duration: 1200 });
      this.load();
    });
  }
}
