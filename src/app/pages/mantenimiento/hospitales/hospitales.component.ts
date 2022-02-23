import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html'
})
export class HospitalesComponent implements OnInit,OnDestroy {
  public hospitales:Hospital[] = [];
  public cargando:boolean = true;
  private imgSubs!:Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService:ModalImagenService,
              private busquedaService:BusquedasService) { }
  
  ngOnInit(): void {
  this.cargarHospitales();
  this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarHospitales() );
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  buscar(termino:string):any{
    if(termino.length === 0){
      return this.cargarHospitales;
    }
    this.busquedaService.buscar('hospitales', termino)
        .subscribe(resp => {
          this.hospitales = resp
        });
  }
  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales=>{
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios(hospital:Hospital){
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre)
        .subscribe(resp=>{
          Swal.fire('Actualizado', hospital.nombre, 'success')
        })
  }
  eliminarHospital(hospital:Hospital){
    this.hospitalService.borrarHospital(hospital._id!)
        .subscribe(resp=>{
          Swal.fire('Borrado', hospital.nombre, 'success')
          this.cargarHospitales();
        })
  }

  async abrirSweetAlert(){
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre de hospital',
      showCancelButton:true,
    })
    
    if (value.trim().length >0) {
      this.hospitalService.crearHospital(value)
          .subscribe((resp:any)=>{
            this.hospitales.push(resp.hospital)
          })
    }
  }
  
  abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img );
  }
}
