import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { RegisterForm } from '../interfaces/register-form.interface';
import { loginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    constructor( private http: HttpClient) {}
    
    crearUsuario (formData:RegisterForm){
        return this.http.post(`${base_url}/usuarios`, formData)
                    .pipe(
                        tap((resp: any)=>{
                            localStorage.setItem('token', resp.token )
                        })
                    )
    }

    login (formData:loginForm){
        return this.http.post(`${base_url}/login`, formData)
                    .pipe(
                        tap((resp: any)=>{
                            localStorage.setItem('token', resp.token )
                        })
                    )
    }
}