import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericType, LoadingStates } from 'src/app/global/global';
import { Beneficiario } from 'src/app/models/beneficiario';
import { Municipio } from 'src/app/models/municipio';
import { ProgramaSocial } from 'src/app/models/programa-social';
import { PaginationInstance } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { BeneficiariosService } from 'src/app/core/services/beneficiarios.service';
import { ProgramasSocialesService } from 'src/app/core/services/programas-sociales.service';
import { MunicipiosService } from 'src/app/core/services/municipios.service';
import { NgxGpAutocompleteDirective } from '@angular-magic/ngx-gp-autocomplete';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';


@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.css']
})
export class BeneficiariosComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;
  @ViewChild('ngxPlaces') placesRef!: NgxGpAutocompleteDirective;
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLElement>;



  canvas!: HTMLElement;
  beneficiario!: Beneficiario;
  beneficiarioForm!: FormGroup;
  beneficiarios: Beneficiario[] = [];
  beneficiariosFilter: Beneficiario[] = [];
  isLoading = LoadingStates.neutro;

  programasSociales: ProgramaSocial[] = [];
  municipios: Municipio[] = [];
  isModalAdd = true;
  rolId = 0;
  generos: GenericType[] = [{ id: 1, name: 'Masculino' }, { id: 2, name: 'Femenino' }];
  estatusBtn = true;
  verdadero = "Activo";
  falso = "Inactivo";
  estatusTag = this.verdadero;

  // MAPS
  latitude: number = 19.316818295403003;
  longitude: number = -98.23837658175323;
  options = {
    types: [],
    componentRestrictions: { country: 'MX' }
  };
  maps!: google.maps.Map;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    @Inject('GENEROS') public objGeneros: any,
    private spinnerService: NgxSpinnerService,
    private beneficiariosService: BeneficiariosService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private programasSocialesService: ProgramasSocialesService,
    private municipiosService: MunicipiosService,
    private headerTitleService: HeaderTitleService
  ) {
    this.beneficiariosService.refreshListBeneficiarios.subscribe(() => this.getBeneficiarios());
    this.getBeneficiarios();
    this.getMunicipios();
    this.getProgramasSociales();
    this.creteForm();
    this.headerTitleService.updateHeaderTitle('Beneficiarios');
  }


  ngOnInit() {
    this.setCurrentLocation();
  }

  selectAddress(place: google.maps.places.PlaceResult) {
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    if (place.formatted_address) {
      this.beneficiarioForm.patchValue({
        domicilio: place.formatted_address
      });
    }
    const selectedLat = place.geometry?.location?.lat() || this.latitude;
    const selectedLng = place.geometry?.location?.lng() || this.longitude;

    this.canvas.setAttribute("data-lat", selectedLat.toString());
    this.canvas.setAttribute("data-lng", selectedLng.toString());

    const newLatLng = new google.maps.LatLng(selectedLat, selectedLng);
    this.maps.setCenter(newLatLng);
    this.maps.setZoom(15);

    const marker = new google.maps.Marker({
      position: newLatLng,
      map: this.maps,
      animation: google.maps.Animation.DROP,
      title: place.name,
    });

    const contentString = `
        <!-- Contenido de la ventana de información (infowindow) -->
        <!-- ... -->
      `;

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    google.maps.event.addListener(marker, "click", () => {
      infowindow.open(this.maps, marker);
    });

    this.beneficiarioForm.patchValue({
      longitud: selectedLng,
      latitud: selectedLat
    });


  }

  ngAfterViewInit() {
    this.canvas = this.mapCanvas.nativeElement;

    if (!this.canvas) {
      console.error("El elemento del mapa no fue encontrado");
      return;
    }

    const myLatlng = new google.maps.LatLng(this.latitude, this.longitude);

    const mapOptions = {
      zoom: 13,
      scrollwheel: false,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#0ba4e2" }, { visibility: "on" }],
        },
      ],
    };

    this.maps = new google.maps.Map(this.canvas, mapOptions);
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((postion) => {
        this.latitude = postion.coords.latitude;
        this.longitude = postion.coords.longitude;
      });
    }
  }




  getMunicipios() {
    this.municipiosService.getAll().subscribe({ next: (dataFromAPI) => this.municipios = dataFromAPI });
  }

  getProgramasSociales() {
    this.programasSocialesService.getAll().subscribe({ next: (dataFromAPI) => this.programasSociales = dataFromAPI });
  }

  creteForm() {
    this.beneficiarioForm = this.formBuilder.group({
      id: [null],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: [null, Validators.required],
      curp: ['', Validators.required],
      estatus: [this.estatusBtn],
      programaSocialId: [null, Validators.required],
      municipioId: [null, Validators.required],
      domicilio: [null, Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
    });
  }

  getBeneficiarios() {
    this.isLoading = LoadingStates.trueLoading;
    this.beneficiariosService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.beneficiarios = dataFromAPI;
          this.beneficiariosFilter = this.beneficiarios;
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
    this.beneficiariosFilter = this.beneficiarios.filter(i => i.nombreCompleto
      .toLowerCase().includes(inputValue.toLowerCase())
    );
    this.configPaginator.currentPage = 1;
  }
  setDataModalUpdate(dto: Beneficiario) {
    console.log(dto);
  }

  deleteItem(id: number, nameItem: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el beneficiario: ${nameItem}?`,
      () => {
        this.beneficiariosService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Beneficiario borrado correctamente');
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
    this.beneficiarioForm.reset();
  }

  submit() {
    this.beneficiario = this.beneficiarioForm.value as Beneficiario;

    const programaSocialId = this.beneficiarioForm.get('programaSocialId')?.value;
    const municipioId = this.beneficiarioForm.get('municipioId')?.value;

    this.beneficiario.programaSocial = { id: programaSocialId } as ProgramaSocial;
    this.beneficiario.municipio = { id: municipioId } as Municipio;

    console.log(this.beneficiario);

    this.spinnerService.show();
    this.beneficiariosService.post(this.beneficiario).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Beneficiario guardado correctamente');
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
    this.beneficiarioForm.reset();
    this.isModalAdd = true;
  }

}
