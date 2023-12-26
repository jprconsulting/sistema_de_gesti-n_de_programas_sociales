import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { LoadingStates } from 'src/app/global/global';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Visita } from 'src/app/models/visita';
import { Beneficiario } from 'src/app/models/beneficiario';
import { BeneficiariosService } from 'src/app/core/services/beneficiarios.service';
import { VisitasService } from 'src/app/core/services/visitas.service';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;

  visita!: Visita;
  visitaForm!: FormGroup;
  visitas: Visita[] = [];
  visitasFilter: Visita[] = [];
  isLoading = LoadingStates.neutro;

  beneficiarioSelect!: Beneficiario | undefined;
  beneficiarios: Beneficiario[] = [];
  isModalAdd = true;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private spinnerService: NgxSpinnerService,
    private visitasService: VisitasService,
    private beneficiariosService: BeneficiariosService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private headerTitleService: HeaderTitleService
  ) {
    this.visitasService.refreshListVisitas.subscribe(() => this.getVisitas());
    this.getVisitas();
    this.creteForm();
    this.getBeneficiarios();
    this.headerTitleService.updateHeaderTitle('Visitas');
  }

  getBeneficiarios() {
    this.beneficiariosService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.beneficiarios = dataFromAPI;
        },
        error: (error) => {
          this.mensajeService.mensajeError(error);
        }
      }
    );
  }
  creteForm() {
    this.visitaForm = this.formBuilder.group({
      id: [null],
      descripcion: ['', Validators.required],
      beneficiarioId: [null, Validators.required]
    });
  }


  getVisitas() {
    this.isLoading = LoadingStates.trueLoading;
    this.visitasService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.visitas = dataFromAPI;
          this.visitasFilter = this.visitas;
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
    this.visitasFilter = this.visitas.filter(i => i.descripcion
      .toLowerCase().includes(inputValue.toLowerCase())
    );
    this.configPaginator.currentPage = 1;
  }
  setDataModalUpdate(dto: Visita) {
    console.log(dto);
  }

  deleteItem(id: number, nameItem: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar la visita: ${nameItem}?`,
      () => {
        this.visitasService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Visita borrada correctamente');
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
    this.visitaForm.reset();
  }

  submit() {
    this.visita = this.visitaForm.value as Visita;

    const beneficiarioId = this.visitaForm.get('beneficiarioId')?.value;

    this.visita.beneficiario = { id: beneficiarioId } as Beneficiario;

    this.spinnerService.show();
    this.visitasService.post(this.visita).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Visita guardada correctamente');
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
    this.visitaForm.reset();
    this.isModalAdd = true;
    this.beneficiarioSelect = undefined;
  }

  onSelectBeneficiario(id: number) {
    if (id) {
      this.beneficiarioSelect = this.beneficiarios.find(b => b.id === id);
    }
  }


}
