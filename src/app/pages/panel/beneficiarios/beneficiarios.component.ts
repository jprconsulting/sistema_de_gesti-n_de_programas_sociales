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
  isModalAdd: boolean = true; 
  programasSociales: ProgramaSocial[] = [];
  municipios: Municipio[] = [];
  rolId = 0;
  generos: GenericType[] = [{ id: 1, name: 'Masculino' }, { id: 2, name: 'Femenino' }];
  estatusBtn = true;
  verdadero = "Activo";
  falso = "Inactivo";
  estatusTag = this.verdadero;
  formData: any;
  id!: number;
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
  setEstatus() {
    this.estatusTag = this.estatusBtn ? this.verdadero : this.falso;
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
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      apellidoMaterno:['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      fechaNacimiento: ['', Validators.required],
      sexo: [null, Validators.required],
      curp:  ['', [Validators.required, Validators.pattern(/^([a-zA-Z]{4})([0-9]{6})([a-zA-Z]{6})([0-9]{2})$/)]],
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
  setDataModalUpdate(beneficiario: Beneficiario) {
    this.isModalAdd = false;
    this.id = beneficiario.id;
    const fechaFormateada = this.formatoFecha(beneficiario.fechaNacimiento);
    console.log('nfjnvf', fechaFormateada);
  
    // Comprobaciones para evitar errores si los objetos son null o undefined
    const municipioId = beneficiario.municipio ? beneficiario.municipio.id : null;
    const programaSocialId = beneficiario.programaSocial ? beneficiario.programaSocial.id : null;
  
    this.beneficiarioForm.patchValue({
      id: beneficiario.id,
      nombres: beneficiario.nombres,
      apellidoPaterno: beneficiario.apellidoPaterno,
      apellidoMaterno: beneficiario.apellidoMaterno,
      fechaNacimiento: fechaFormateada,
      domicilio: beneficiario.domicilio,
      estatus: beneficiario.estatus,
      latitud: beneficiario.latitud,
      longitud: beneficiario.longitud,
      municipioId: beneficiario.municipio.id,
      curp: beneficiario.curp,
      sexo: beneficiario.sexo,
      programaSocialId: beneficiario.programaSocial.id
    });
  
    this.formData = this.beneficiarioForm.value;
    
  
    setTimeout(() => {
      this.mapa2();
    }, 500);
  console.log(beneficiario);
  }
  
  actualizar() {
    const socialFormValue = { ...this.beneficiarioForm.value };
    socialFormValue.programaSocialId = +socialFormValue.programaSocialId;
    socialFormValue.municipioId = +socialFormValue.municipioId;
    console.log('ded',socialFormValue)
    this.beneficiariosService.put(this.id, socialFormValue).subscribe({

      next: () => {
        this.mensajeService.mensajeExito("Beneficiario actualizado con éxito");
        this.resetForm();
        console.log(socialFormValue);
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar el beneficiario");
        console.error(error);
        console.log(socialFormValue);
      }
    });
  }
  formatoFecha(fecha: string): string {
    // Aquí puedes utilizar la lógica para formatear la fecha según tus necesidades
    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
    return fechaFormateada;
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
    if (this.isModalAdd === false) {

      this.actualizar();
    } else {
      this.agregar();

    }
  }
  
  agregar() {
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
    if (this.beneficiarioForm) {
      this.beneficiarioForm.reset();
      const estatusControl = this.beneficiarioForm.get('estatus');
      if (estatusControl) {
        estatusControl.setValue(true);
      }
      this.isModalAdd = true;
    }
  }
  
mapa2(): void {
  this.formData = this.beneficiarioForm.value;
  const latitudControl = this.beneficiarioForm.get('latitud');
  const longitudControl = this.beneficiarioForm.get('longitud');

  if (latitudControl && longitudControl) {
    const latitud = latitudControl.value;
    const longitud = longitudControl.value;

    console.log('Latitud:', latitud);
    console.log('Longitud:', longitud);

    const mapElement = document.getElementById("map-canvas");
    if (!mapElement) {
      console.error("Elemento del mapa no encontrado.");
      return;
    }

    const myLatlng = new google.maps.LatLng(latitud, longitud);
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

    let map = new google.maps.Map(mapElement, mapOptions);

    map.setCenter(new google.maps.LatLng(latitud, longitud));
    map.setZoom(15);

    const input = document.getElementById('searchInput') as HTMLInputElement | null;

if (!input) {
  console.error("Elemento de entrada de búsqueda no encontrado.");
  return;
}
    const autocomplete = new google.maps.places.Autocomplete(input);
    
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      console.log(place);
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } 
    });
    const marker1 = new google.maps.Marker({
      position: new google.maps.LatLng(latitud, longitud),
      map: map,
      animation: google.maps.Animation.DROP,
      title: "Hello World!",
    });
   
    const infoWindowOpenOptions = {
      map: map,
      anchor: marker1,
      shouldFocus: false
    };
  }
}

}
