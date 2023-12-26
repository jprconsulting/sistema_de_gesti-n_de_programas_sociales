import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { AreasAdscripcionService } from 'src/app/core/services/areas-adscripcion.service';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { RolsService } from 'src/app/core/services/rols.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { LoadingStates } from 'src/app/global/global';
import { AreaAdscripcion } from 'src/app/models/area-adscripcion';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;

  usuario!: Usuario;
  usuarioForm!: FormGroup;
  usuarios: Usuario[] = [];
  usuariosFilter: Usuario[] = [];
  isLoading = LoadingStates.neutro;

  rols: Rol[] = [];
  areasAdscripcion: AreaAdscripcion[] = [];
  isModalAdd = true;
  rolId = 0;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuariosService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private areasAdscripcionService: AreasAdscripcionService,
    private rolsService: RolsService,
    private headerTitleService: HeaderTitleService
  ) {
    this.usuarioService.refreshListUsuarios.subscribe(() => this.getUsuarios());
    this.getUsuarios();
    this.getRols();
    this.getAreasAdscripcion();
    this.creteForm();
    this.subscribeRolId();
    this.headerTitleService.updateHeaderTitle('Usuarios');
  }

  getRols() {
    this.rolsService.getAll().subscribe({ next: (dataFromAPI) => this.rols = dataFromAPI });
  }

  getAreasAdscripcion() {
    this.areasAdscripcionService.getAll().subscribe({ next: (dataFromAPI) => this.areasAdscripcion = dataFromAPI });
  }

  creteForm() {
    this.usuarioForm = this.formBuilder.group({
      id: [null],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      estatus: [true],
      rolId: [null, Validators.required],
      areaAdscripcionId: [null],
    });
  }

  changeValidators(rolId: number) {
    this.rolId = rolId;
    //Si es director
    this.usuarioForm.patchValue({ areaAdscripcionId: null });
    if (rolId === 1) {
      this.usuarioForm.controls["areaAdscripcionId"].enable();
      this.usuarioForm.controls["areaAdscripcionId"].setValidators(Validators.required);
    } else {
      this.usuarioForm.controls["areaAdscripcionId"].disable();
      this.usuarioForm.controls["areaAdscripcionId"].clearValidators();
    }
    this.usuarioForm.get("areaAdscripcionId")?.updateValueAndValidity();
  }


  subscribeRolId() {
    this.usuarioForm.get("rolId")?.valueChanges
      .subscribe(eventRolId => this.changeValidators(eventRolId));
  }

  getUsuarios() {
    this.isLoading = LoadingStates.trueLoading;
    this.usuarioService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.usuarios = dataFromAPI;
          this.usuariosFilter = this.usuarios;
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
    this.usuariosFilter = this.usuarios.filter(i => i.nombreCompleto
      .toLowerCase().includes(inputValue.toLowerCase())
    );
    this.configPaginator.currentPage = 1;
  }
  setDataModalUpdate(dto: Usuario) {
    console.log(dto);
  }

  deleteItem(id: number, nameItem: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el usuario: ${nameItem}?`,
      () => {
        this.usuarioService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Usuario borrado correctamente');
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
    this.usuarioForm.reset();
  }

  submit() {
    this.usuario = this.usuarioForm.value as Usuario;

    const rolId = this.usuarioForm.get('rolId')?.value;
    const areaAdscripcionId = this.usuarioForm.get('areaAdscripcionId')?.value;

    this.usuario.rol = { id: rolId } as Rol;
    this.usuario.areaAdscripcion = { id: areaAdscripcionId } as AreaAdscripcion;

    this.spinnerService.show();
    this.usuarioService.post(this.usuario).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Usuario guardado correctamente');
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
    this.usuarioForm.reset();
    this.isModalAdd = true;
  }



}
