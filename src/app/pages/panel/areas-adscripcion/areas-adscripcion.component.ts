import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingStates } from 'src/app/global/global';
import { AreaAdscripcion } from 'src/app/models/area-adscripcion';
import { PaginationInstance } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { AreasAdscripcionService } from 'src/app/core/services/areas-adscripcion.service';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-areas-adscripcion',
  templateUrl: './areas-adscripcion.component.html',
  styleUrls: ['./areas-adscripcion.component.css']
})
export class AreasAdscripcionComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;

  areaAdscripcion!: AreaAdscripcion;
  areaAdscripcionForm!: FormGroup;
  areasAdscripcion: AreaAdscripcion[] = [];
  areasAdscripcionFilter: AreaAdscripcion[] = [];
  isLoading = LoadingStates.neutro;
  isModalAdd: boolean = true;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private spinnerService: NgxSpinnerService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private areasAdscripcionService: AreasAdscripcionService,
    private headerTitleService: HeaderTitleService
  ) {
    this.areasAdscripcionService.refreshListAreasAdscripcion.subscribe(() => this.getAreasAdscripcion());
    this.getAreasAdscripcion();
    this.creteForm();
    this.headerTitleService.updateHeaderTitle('Áreas de Adscripción');
  }

  estatusBtn = true;
  verdadero = "Activo";
  falso = "Inactivo";
  estatusTag = this.verdadero;
 setEstatus() {
    this.estatusTag = this.estatusBtn ? this.verdadero : this.falso;
  }

  creteForm() {
    this.areaAdscripcionForm = this.formBuilder.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estatus: [true],
    });
  }

  getAreasAdscripcion() {
    this.isLoading = LoadingStates.trueLoading;
    this.areasAdscripcionService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.areasAdscripcion = dataFromAPI;
          this.areasAdscripcionFilter = this.areasAdscripcion;
          this.isLoading = LoadingStates.falseLoading;
        },
        error: () => {
          this.isLoading = LoadingStates.errorLoading
        }
      }
    );
  }

  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }

  handleChangeSearch(event: any) {
    const inputValue = event.target.value;
    this.areasAdscripcionFilter = this.areasAdscripcion.filter(i => i.nombre
      .toLowerCase().includes(inputValue.toLowerCase())
    );
    this.configPaginator.currentPage = 1;
  }

  idToUpdate2!: number;
  formData: any;

  setDataModalUpdate(dto: AreaAdscripcion) {
    console.log(dto);
    this.isUpdating = true;
    this.idToUpdate2 = dto.id;
    this.areaAdscripcionForm.patchValue({
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      estatus: dto.estatus,
    });
    this.formData = this.areaAdscripcionForm.value;
    console.log(this.areaAdscripcionForm.value);
  }


  editarArea() {
    const areaFormValue = { ...this.areaAdscripcionForm.value };
    this.areasAdscripcionService.put(this.idToUpdate2,areaFormValue).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Área actualizada con éxito");
        this.resetForm();
        console.log(areaFormValue);
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar Area");
        console.error(error);
        console.log(areaFormValue);
      }
    });
  }


  deleteItem(id: number, nameItem: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar área de adscripción: ${nameItem}?`,
      () => {
        this.areasAdscripcionService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Área de adscripción borrada correctamente');
            this.configPaginator.currentPage = 1;
            this.searchItem.nativeElement.value = '';
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }


  resetForm() {
    this.closebutton.nativeElement.click();
    this.areaAdscripcionForm.reset();
  }

  agregar(){
    this.areaAdscripcion = this.areaAdscripcionForm.value as AreaAdscripcion;
      this.spinnerService.show();
      this.areasAdscripcionService.post(this.areaAdscripcion).subscribe({
        next: () => {
          this.spinnerService.hide();
          this.mensajeService.mensajeExito('Área de adscripción guardada correctamente');
          this.resetForm();
          this.configPaginator.currentPage = 1;
        },
        error: (error) => {
          this.spinnerService.hide();
          this.mensajeService.mensajeError(error);
        }
      });
  }

  isUpdating: boolean = false;

  submit() {
    if (this.isUpdating) {
      this.editarArea();
    } else {
      this.agregar();
    }

  }

  handleChangeAdd() {
    this.areaAdscripcionForm.reset();
    this.isModalAdd = true;
    this.isUpdating = false;
  }


}
