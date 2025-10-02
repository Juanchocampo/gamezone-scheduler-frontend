import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  styles: [
    `
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }

      input::placeholder{
        opacity: .5;
      }
    `,
  ],
  templateUrl: './register-page.component.html',
})
export default class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  hasError = signal<boolean>(false);

  registerForm = this.fb.group(
    {
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z]{5,}@unibarranquilla.edu.co$'),
        ],
      ],
      fullName: ['', [Validators.required, Validators.minLength(10)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      document: ['', [Validators.required]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    },
    {
      validators: [this.isFieldOneEqualsFieldTwo('password', 'password2')],
    }
  );

  noNegative(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === '-' || event.key === 'E') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email, fullName, username, document, password } = this.registerForm.value;
    if (!email || !fullName || !username || !document || !password) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000)
      return;
    }

    this.authService.register({ email, fullName, username, document, password }).subscribe(
      (isAuthenticated: boolean) => {
        if (isAuthenticated){
          this.router.navigateByUrl('/')
        }
      }
    );
  }

  isFieldOneEqualsFieldTwo(field1: string, field2: string): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const field1Name = formGroup.get(field1);
      const field2Name = formGroup.get(field2);

      if (field1Name?.value !== field2Name?.value) {
        return { notMatch: true };
      }

      return null;
    };
  }
}
