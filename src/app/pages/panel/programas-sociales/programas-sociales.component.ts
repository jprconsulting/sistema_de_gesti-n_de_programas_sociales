import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingStates } from 'src/app/global/global';
import { AreaAdscripcion } from 'src/app/models/area-adscripcion';
import { ProgramaSocial } from 'src/app/models/programa-social';
import { PaginationInstance } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProgramasSocialesService } from 'src/app/core/services/programas-sociales.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { AreasAdscripcionService } from 'src/app/core/services/areas-adscripcion.service';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-programas-sociales',
  templateUrl: './programas-sociales.component.html',
  styleUrls: ['./programas-sociales.component.css']
})
export class ProgramasSocialesComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;

  programaSocial!: ProgramaSocial;
  programaSocialForm!: FormGroup;
  programasSociales: ProgramaSocial[] = [];
  programasSocialesFilter: ProgramaSocial[] = [];
  isLoading = LoadingStates.neutro;

  areasAdscripcion: AreaAdscripcion[] = [];
  isModalAdd = true;
  rolId = 0;
  defaultColor = '#206bc4';

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private spinnerService: NgxSpinnerService,
    private programasSocialesService: ProgramasSocialesService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private areasAdscripcionService: AreasAdscripcionService,
    private headerTitleService: HeaderTitleService
  ) {
    this.programasSocialesService.refreshListProgramasSociales.subscribe(() => this.getProgramasSociales());
    this.getProgramasSociales();
    this.getAreasAdscripcion();
    this.creteForm();
    this.headerTitleService.updateHeaderTitle('Programas Sociales');
  }

  getAreasAdscripcion() {
    this.areasAdscripcionService.getAll().subscribe({ next: (dataFromAPI) => this.areasAdscripcion = dataFromAPI });
  }

  creteForm() {
    this.programaSocialForm = this.formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      descripcion: ['', Validators.required],
      color: ['', Validators.required],
      estatus: [false],
      acronimo: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z ]+$')]],
      areaAdscripcionId: [null, Validators.required],
    });
  }

  getProgramasSociales() {
    this.isLoading = LoadingStates.trueLoading;
    this.programasSocialesService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.programasSociales = dataFromAPI;
          this.programasSocialesFilter = this.programasSociales;
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
    this.programasSocialesFilter = this.programasSociales.filter(i => i.nombre
      .toLowerCase().includes(inputValue.toLowerCase())
    );
    this.configPaginator.currentPage = 1;
  }
  setDataModalUpdate(dto: ProgramaSocial) {
    console.log(dto);
  }

  deleteItem(id: number, nameItem: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el programa social: ${nameItem}?`,
      () => {
        this.programasSocialesService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Programa social borrado correctamente');
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
    this.programaSocialForm.reset();
  }

  submit() {
    this.programaSocial = this.programaSocialForm.value as ProgramaSocial;

    const areaAdscripcionId = this.programaSocialForm.get('areaAdscripcionId')?.value;
    this.programaSocial.areaAdscripcion = { id: areaAdscripcionId } as AreaAdscripcion;
    console.log(this.programaSocial);

    this.spinnerService.show();
    this.programasSocialesService.post(this.programaSocial).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Programa social guardado correctamente');
        this.resetForm();
        this.configPaginator.currentPage = 1;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.mensajeService.mensajeError(error);
      }
    });
  }

  handleChangeAdd() {
    this.programaSocialForm.reset();
    this.isModalAdd = true;
  }


}
