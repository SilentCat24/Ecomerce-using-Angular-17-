import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../service/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
 private auth = inject(Auth);
  private router = inject(Router);
  name = ''; email = ''; password = ''; loading = false; error = '';

  onSubmit() {
    this.loading = true; this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { this.error = err.error?.message || 'Registration failed'; this.loading = false; }
    });
  }


}
