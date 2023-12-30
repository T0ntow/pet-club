import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';


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
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  inputValue!: string;
  isInputSelecionado: boolean = false;

  ngOnInit() {
  }

  inputFocus() {
    console.log('Input selecionado');
    this.isInputSelecionado = true;
  }

  inputBlur() {
    console.log('Input desselecionado');
    this.isInputSelecionado = false;
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

          if (error.status === 404) {
            return await this.presentAlert('E-mail não encontrado', 'Verifique o e-mail e tente novamente.');
          }

          if (error.status === 401) {
            return await this.presentAlert('Credenciais incorretas', 'Verifique suas credenciais e tente novamente.');
          }

          if (error) {
            return await this.presentAlert('Error', 'encontramos algum erro, por favor tente novamente mais tarde.');
          }
        }
      });
    }
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
