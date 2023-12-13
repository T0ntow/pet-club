import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  login() {
    console.log("submit form");

    if (this.loginForm.valid) {
      const userData = this.loginForm.value;

      this.loginService.login(userData).subscribe({

        next: (response: any) => {
          console.log('Usuário logado com sucesso:', response);

          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const username = response.username; // Certifique-se de ajustar a propriedade de resposta conforme sua API
            this.authService.setAuthUsername(username);

            this.router.navigate(['/home']);
          }
        },

        error: async (error) => {
          console.error('Erro ao logar usuário:', error);

          if(error.status === 403) {
            // await this.emailNotVerified()
          } else {
            // await this.presentErrorAlert();
          }
        }
      });
    }
  }

}
