import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from 'src/services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  newUser() {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;

      this.signupService.signup(userData).subscribe({
        next: (response: any) => {
          console.log('Usuário cadastrado com sucesso:', response);
          const confirmationToken = response.confirmationToken;
          const email = response.email;
        },

        error: async (error) => {
          console.error('Erro ao cadastrar usuario:', error);

          if (error.error.error === "E-mail já em uso") {
            console.log("E-mail já em uso");
          }

        }
      })
    }
  }
}
