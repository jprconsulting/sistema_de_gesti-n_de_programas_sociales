import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BeneficiariosService } from 'src/app/core/services/beneficiarios.service';
import { ProgramasSocialesService } from 'src/app/core/services/programas-sociales.service';
import { Beneficiario } from 'src/app/models/beneficiario';
import { ProgramaSocial } from 'src/app/models/programa-social';
declare const google: any;
@Component({
  selector: 'app-mapa-beneficiarios',
  templateUrl: './mapa-beneficiarios.component.html',
  styleUrls: ['./mapa-beneficiarios.component.css']
})
export class MapaBeneficiariosComponent {
  
  BeneficiarioForm!: FormGroup;
  beneficiarios: Beneficiario[] = [];
  prograsmasocial: ProgramaSocial [] = [];
  beneficiariosFiltrados: Beneficiario[] = [];
  myForm!: FormGroup;
  select ="";

  constructor(
    private formBuilder: FormBuilder,
    private beneficiariosService: BeneficiariosService,
    private programaService: ProgramasSocialesService,
  ) {
    this.myForm = this.formBuilder.group({
      select: ['']
    });
  }

  ngAfterViewInit() {
    this.mapa();
  }
  
  ngOnInit() {
    // Asegúrate de que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
      // Llama a la función que inicializa el mapa aquí
      this.mapa();
    });

  }
  
dato(){
  this.select ="";
}
    filtrarPorPrograma(event: any) {
      console.log('Valor seleccionado:', event.target.value);
      
      const programaSocialId = event.target.value;
      
      const beneficiariosFiltrados = this.beneficiarios.filter(beneficiario => {
       
    
        return beneficiario.id == programaSocialId;
      });
      
      this.select = beneficiariosFiltrados.length > 0
      ? this.prograsmasocial.find(p => p.id === beneficiariosFiltrados[0].id)?.nombre || ''
      : '';
    

      
      
      const mapElement = document.getElementById("map-canvas") || null;
      const lat = mapElement?.getAttribute("data-lat") || null;
      const lng = mapElement?.getAttribute("data-lng") || null;
      const myLatlng = new google.maps.LatLng(lat, lng);
    
      

  console.log('Valor de this.select:', this.select);
    
     
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
    const input = document.getElementById('searchInput');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
  
    autocomplete.addListener("place_changed", function () {
      // Lógica de autocompletado...
    });
  
    const infowindow = new google.maps.InfoWindow();
  
    this.programaService.getAll().subscribe(
      (programasocial: ProgramaSocial[]) => {
        this.prograsmasocial = programasocial;
  
        const coloresPorPrograma: { [id: number]: string } = {};
        this.prograsmasocial.forEach(programaSocial => {
          coloresPorPrograma[programaSocial.id] = programaSocial.color;
        });
        
        beneficiariosFiltrados.forEach(beneficiario => {
          const programaSocial = this.prograsmasocial.find(p => p.id === beneficiario.id);
          if (programaSocial) {
            beneficiario.id = programaSocial.id;
            console.log('Valores del programa social:', programaSocial);
            const colorRGB = coloresPorPrograma[beneficiario.id] || 'rgb(255, 0, 0)';
  
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(beneficiario.latitud, beneficiario.longitud),
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: colorRGB,
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 10
              },
              title: `${beneficiario.nombres} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno}`,
            });
  
            const contentString = `
          <div style="max-width: 200px; max-height:280px; text-align: center;" class="custom-infowindow max-w-sm rounded overflow-hidden shadow-lg">
          <img class="w-24 h-24 mb-3 rounded-full shadow-lg mx-auto" 
         src="${beneficiario.sexo === 1 ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"' : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80'}" 
         alt="Sunset in the mountains">

            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">${beneficiario.nombres} ${beneficiario.apellidoPaterno}</div>
              <p class="text-gray-900 text-base">
                Programa inscrito:
                <p class="text-gray-700 text-base">
                ${programaSocial.nombre}
                </p>
              </p>
              <p class="text-gray-900 text-base">
                Dirección:
                <p class="text-gray-700 text-base">
                  ${beneficiario.domicilio}
                </p>
              </p>
            </div>
          </div>
        `;
        
  
            google.maps.event.addListener(marker, "click", () => {
              if (infowindow && infowindow.getMap()) {
                infowindow.close();
              }
  
              infowindow.setContent(contentString);
              infowindow.setPosition(marker.getPosition());
              infowindow.open(map, marker);
            });
          }
        });
        return beneficiariosFiltrados;},
      (error: any) => {
        console.error('Error al obtener programas sociales:', error);
      }
    );
  }
  obtenerProgramas() {
    this.programaService.getAll().subscribe(
      (prograsmasocial: ProgramaSocial[]) => {
        console.log('Datos:', prograsmasocial);
        this.prograsmasocial = prograsmasocial;
      }
    );
  }

  mapa() {
    const mapElement = document.getElementById("map-canvas") || null;
    const lat = mapElement?.getAttribute("data-lat") || null;
    const lng = mapElement?.getAttribute("data-lng") || null;
    const myLatlng = new google.maps.LatLng(lat, lng);
    
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
    const input = document.getElementById('searchInput');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
  
    autocomplete.addListener("place_changed", function () {
      // Lógica de autocompletado...
    });
  
    // Declara infowindow una vez fuera del bucle
    const infowindow = new google.maps.InfoWindow();
    this.beneficiariosService.getAll().subscribe(
      (beneficiarios: Beneficiario[]) => {
        console.log('Datos de beneficiarios recibidos:', beneficiarios);
        this.beneficiarios = beneficiarios;
    
        this.programaService.getAll().subscribe(
          (programasocial: ProgramaSocial[]) => {
            console.log('vnfj',programasocial)
            this.prograsmasocial = programasocial;
    
            const coloresPorPrograma: { [id: number]: string } = {};
            this.prograsmasocial.forEach(programaSocial => {
              coloresPorPrograma[programaSocial.id] = programaSocial.color;
            });
    
            this.beneficiarios.forEach(beneficiario => {
              const programaSocial = this.prograsmasocial.find(p => p.id === beneficiario.id);
              if (programaSocial) {
                beneficiario.id = programaSocial.id;
                console.log('Valores del programa social:', programaSocial);
    
                const colorRGB = coloresPorPrograma[beneficiario.id] || 'rgb(255, 0, 0)';
    
                const marker = new google.maps.Marker({
                  position: new google.maps.LatLng(beneficiario.latitud, beneficiario.longitud),
                  map: map,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: colorRGB,
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 10
                  },
                  title: `${beneficiario.nombres} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno}`,
                });
    
                const contentString = `
          <div style="max-width: 200px; max-height:280px; text-align: center;" class="custom-infowindow max-w-sm rounded overflow-hidden shadow-lg">
          <img class="w-24 h-24 mb-3 rounded-full shadow-lg mx-auto" 
         src="${beneficiario.sexo === 1 ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"' : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80'}" 
         alt="Sunset in the mountains">

            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">${beneficiario.nombres} ${beneficiario.apellidoPaterno}</div>
              <p class="text-gray-900 text-base">
                Programa inscrito:
                <p class="text-gray-700 text-base">
                ${programaSocial.nombre}
                </p>
              </p>
              <p class="text-gray-900 text-base">
                Dirección:
                <p class="text-gray-700 text-base">
                  ${beneficiario.domicilio}
                </p>
              </p>
            </div>
          </div>
        `;
  
                google.maps.event.addListener(marker, "click", () => {
                  if (infowindow && infowindow.getMap()) {
                    infowindow.close();
                  }
  
                  infowindow.setContent(contentString);
                  infowindow.setPosition(marker.getPosition());
                  infowindow.open(map, marker);
                });
              }
            });
          }
        );
      },
      (error: any) => {
        console.error('Error al obtener beneficiarios:', error);
      }
    );
  }
  

}
