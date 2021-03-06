import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, Observable, catchError, of, delay } from 'rxjs';
import { RegisterForm } from '../interfaces/register-form.interface';
import { loginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi:any;

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    public auth2:any;
    public usuario!: Usuario;

    constructor( private http: HttpClient,
                    private router:Router,
                    private ngZone:NgZone) {
        this.googleInit();
    }
    
    get token():string{
        return localStorage.getItem('token') || '';
    }
    get role():'ADMIN_ROLE'| 'USER_ROLE'{
        return this.usuario.role!;
    }
    get uid():string{
        return this.usuario.uid || '';
    }
    get headers(){
        return {
            headers:{
                'x-token':this.token
            }
        }
    }
    guardarLocalStorage (token:string, menu:any){
        localStorage.setItem('token', token);
        localStorage.setItem('menu', JSON.stringify(menu));
    }
    googleInit(){
        return new Promise<void>(resolve=>{
            gapi.load('auth2', ()=>{
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                this.auth2 = gapi.auth2.init({
                    client_id: '182206595386-u3j9lvsuup0jpbk89kvnoi2rd74o1rfh.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                });
                resolve();
            });
        }) 
    }
    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('menu');
        this.auth2.signOut().then( ()=> {
            this.ngZone.run(()=>{
                this.router.navigateByUrl('/login');
            })
        });
    }
    validarToken():Observable<boolean>{
        return this.http.get(`${base_url}/login/renew`,{
            headers:{
                'x-token':this.token
            }
        }).pipe(
            map ((resp:any)=>{
                const{ email, google, nombre, role,img = '', uid } = resp.usuario;
                this.usuario = new Usuario(nombre, email,'',img, google, role, uid);
                this.guardarLocalStorage(resp.token, resp.menu);
                return true;
            }),
            catchError( error=> of(false))
        );
    }

    crearUsuario (formData:RegisterForm){
        return this.http.post(`${base_url}/usuarios`, formData)
                    .pipe(
                        tap((resp: any)=>{
                            this.guardarLocalStorage(resp.token, resp.menu);
                        })
                    )
    }

    actualizarPerfil(data:{email:string, nombre:string, role?:string}){
        data = {
            ...data,
            role: this.usuario.role
        }
        return this.http.put(`${base_url}/usuarios/${this.uid}`, data,{
            headers:{
                'x-token':this.token
            }
        })
    }

    login (formData:loginForm){
        return this.http.post(`${base_url}/login`, formData)
                    .pipe(
                        tap((resp: any)=>{
                            this.guardarLocalStorage(resp.token, resp.menu);
                        })
                    )
    }

    loginGoogle (token:any){
        return this.http.post(`${base_url}/login/google`, {token})
                    .pipe(
                        tap((resp: any)=>{
                            localStorage.setItem('token', resp.token );
                            localStorage.setItem('menu', resp.menu);
                        })
                    )
    }
    cargarUsuarios( desde:number = 0){
        return this.http.get<CargarUsuario>(`${base_url}/usuarios?desde=${desde}`, this.headers)
                .pipe(
                    //delay(2000),
                    map(resp=>{
                        const usuarios = resp.usuarios.map(
                            user => new Usuario(user.nombre, user.email,'',user.img, user.google,user.role,user.uid))
                        return {
                            total: resp.total,
                            usuarios
                        }
                    })
                )
    }

    guardarUsuario( usuario: Usuario ) {
        return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );
    }

    eliminarUsuario(usuario:Usuario){
        return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers)
    }
}