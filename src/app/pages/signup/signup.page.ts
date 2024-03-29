import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from 'src/app/services/signup.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  inputValue!: string;
  isInputSelecionado: boolean = false;
  
  inputFocus() {
    console.log('Input selecionado');
    this.isInputSelecionado = true;
  }

  inputBlur() {
    console.log('Input desselecionado');
    this.isInputSelecionado = false;
  }


  ngOnInit(): void {
  }

  async newUser() {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;

      this.signupService.signup(userData).subscribe({
        next: async (response: any) => {
          console.log('Usuário cadastrado com sucesso:', response);
          
          await this.presentToast('Cadastro realizado com sucesso. Efetue o login e comece a utilizar sua conta.');
          this.router.navigate(['/login']);
        },

        error: async (error) => {
          console.error('Erro ao cadastrar usuário:', error);

          if (error.status === 400) {
            console.log("E-mail já em uso");
            await this.presentAlert('E-mail já em uso', 'Verificamos que o seu e-mail já está em uso. Por favor, cadastre-se utilizando um novo endereço de e-mail.');
          }
        }
      });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
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
