import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private usuarioSvc: UsuarioService,
                private router:Router){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      return this.usuarioSvc.validarToken()
      .pipe(
        tap(estaAutenticado =>{
          if (!estaAutenticado){
            this.router.navigateByUrl('/login');
          }
        })
      )
  }
  
}