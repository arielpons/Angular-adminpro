import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor( private usuarioSvc: UsuarioService,
                private router:Router){}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuarioSvc.validarToken()
      .pipe(
        tap(estaAutenticado =>{
          if (!estaAutenticado){
            this.router.navigateByUrl('/login');
          }
        })
      )
  }
  
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
