import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['']
  });
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.svc.get(this.id).subscribe((res: any) => this.form.patchValue(res.category || res));
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    const op = this.id ? this.svc.update(this.id, payload) : this.svc.create(payload);
    op.subscribe(() => {
      this.snack.open('Saved', 'Close', { duration: 1500 });
      this.router.navigateByUrl('/categories');
    });
  }
}
