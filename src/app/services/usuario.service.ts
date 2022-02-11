import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    constructor( private http: HttpClient) {}
    
    crearUsuario (formData:RegisterForm){
        return this.http.post(`${base_url}/usuarios`, formData);
    }

    login (formData:loginForm){
        return this.http.post(`${base_url}/login`, formData);
    }
}