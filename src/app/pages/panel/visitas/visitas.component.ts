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
  imagenAmpliada: string | null = null;
  mostrarModal = false;

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
      beneficiarioId: [null, Validators.required],
      imagenBase64: ['',Validators.required]
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

    const imagenBase64 = this.visitaForm.get('imagenBase64')?.value;

    if (imagenBase64) {
      const formData = { ...this.visita, imagenBase64 };

      this.spinnerService.show();
      this.visitasService.post(formData).subscribe({
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
    } else {
      console.error('Error: No se encontró una representación válida en base64 de la imagen.');
    }
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

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        const base64WithoutPrefix = base64String.split(';base64,').pop() || '';

        this.visitaForm.patchValue({
          imagenBase64: base64WithoutPrefix // Contiene solo la representación en base64
        });
      };

      reader.readAsDataURL(file);
    }
  }


  readFileAsDataURL(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error al leer el archivo como URL de datos.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsDataURL(new Blob([filePath]));
    });
  }

  obtenerRutaImagen(nombreArchivo: string): string {
    const rutaBaseAPI = 'https://localhost:7224/';
    if (nombreArchivo) {
      return `${rutaBaseAPI}images/${nombreArchivo}`;
    }
    return ''; // O una URL predeterminada si no hay nombre de archivo
  }

  mostrarImagenAmpliada(rutaImagen: string) {
    this.imagenAmpliada = rutaImagen;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    this.imagenAmpliada = null;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

}
