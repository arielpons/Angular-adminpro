import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {
  public formSubmitted = false;
  public registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email:['', Validators.required, Validators.email],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [true, Validators.required],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });
  constructor(private fb:FormBuilder,
              private usuarioService: UsuarioService) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);
    if(this.registerForm.invalid){
      return
    } 
    //Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(
        (data) => {
        console.log(data)
      }, (err)=>{
        Swal.fire('Error', err.error.msg, 'error');
      })
    
  }

  campoInvalido(campo:string):boolean{
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    } else{
      return false;
    }
  }
  contrasenasInvalidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;
    if ( (pass1 !== pass2)  && this.formSubmitted) {
      return true;
    } else {
      return false;
    }

  }
  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordsIguales(pass1:string, pass2:string){
    return (formGroup: FormGroup)=>{
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      if (pass1Control === pass2Control){
        pass2Control?.setErrors(null)
      }else{
        pass2Control?.setErrors({ noEsIgual: true})
      }
    }
  }
  
}
