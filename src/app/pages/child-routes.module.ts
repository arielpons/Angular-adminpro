import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimiento/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimiento/medicos/medicos.component';
import { MedicoComponent } from './mantenimiento/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const childRoutes: Routes = [
    { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
    { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' }},
    { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Búsqueda' }},
    { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }},
    { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' }},
    { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' }},
    { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' }},
    { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' }},
    
    //Mantenimientos
    { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales' }},
    { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Médicos' }},
    { path: 'medicos/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de Médico' }},
    
    //Guard para role ADMIN
    { path: 'usuarios', canActivate:[AdminGuard] , component: UsuariosComponent, data: { titulo: 'Usuario de Aplicación' }},

]
@NgModule({
    imports: [ RouterModule.forChild(childRoutes) ],
    exports: [ RouterModule ]
})
export class ChildRoutesModule { }
