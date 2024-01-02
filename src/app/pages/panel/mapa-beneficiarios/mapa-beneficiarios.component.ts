import { AfterViewInit, Component } from '@angular/core';
import { BeneficiariosService } from 'src/app/core/services/beneficiarios.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ProgramasSocialesService } from 'src/app/core/services/programas-sociales.service';
import { Beneficiario } from 'src/app/models/beneficiario';
import { ProgramaSocial, ProgramaSocialEstadistica } from 'src/app/models/programa-social';
declare const google: any;
@Component({
  selector: 'app-mapa-beneficiarios',
  templateUrl: './mapa-beneficiarios.component.html',
  styleUrls: ['./mapa-beneficiarios.component.css']
})
export class MapaBeneficiariosComponent implements AfterViewInit {

  programaSocialEstadistica: ProgramaSocialEstadistica[] = [];
  programasSociales: ProgramaSocial[] = [];
  beneficiarios: Beneficiario[] = [];
  beneficiariosFiltrados: Beneficiario[] = [];
  map: any = {};
  infowindow = new google.maps.InfoWindow();
  markers: google.maps.Marker[] = [];


  constructor(
    private beneficiariosService: BeneficiariosService,
    private programasSocialesService: ProgramasSocialesService,
    private dashboardService: DashboardService
  ) {
    this.getTotalBeneficiariosPorProgramaSocial();
    this.getProgramasSociales();
    this.getBeneficiarios();

  }

  getTotalBeneficiariosPorProgramaSocial() {
    this.dashboardService.getTotalBeneficiariosPorProgramaSocial().subscribe({
      next: (dataFromApi) => {
        this.programaSocialEstadistica = dataFromApi;
      }
    });
  }

  getProgramasSociales() {
    this.programasSocialesService.getAll().subscribe({
      next: (dataFromAPI) => {
        this.programasSociales = dataFromAPI;
      }
    });
  }

  getBeneficiarios() {
    this.beneficiariosService.getAll().subscribe({
      next: (dataFromAPI) => {
        this.beneficiarios = dataFromAPI;
        this.beneficiariosFiltrados = this.beneficiarios;
        this.setAllMarkers();
      }
    });
  }


  ngAfterViewInit() {
    const mapElement = document.getElementById("map-canvas") || null;
    const lat = mapElement?.getAttribute("data-lat") || null;
    const lng = mapElement?.getAttribute("data-lng") || null;
    const myLatlng = new google.maps.LatLng(lat, lng);

    const mapOptions = {
      zoom: 10,
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
    this.map = new google.maps.Map(mapElement, mapOptions);
  }



  onSelectProgramaSocial(id: number) {
    if (id) {
      this.clearMarkers();
      this.beneficiarios.filter(b => b.programaSocial.id == id).forEach(beneficiario => {
        this.setInfoWindow(this.getMarker(beneficiario), this.getContentString(beneficiario));
      });
    }
  }

  setAllMarkers() {
    this.clearMarkers();
    this.beneficiarios.forEach(beneficiario => {
      this.setInfoWindow(this.getMarker(beneficiario), this.getContentString(beneficiario));
    });
  }

  getMarker(beneficiario: Beneficiario) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(beneficiario.latitud, beneficiario.longitud),
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: beneficiario.programaSocial.color,
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 10
      },
      title: `${beneficiario.nombreCompleto}`,
    });
    this.markers.push(marker);
    return marker;
  }

  setInfoWindow(marker: any, contentString: string) {
    google.maps.event.addListener(marker, "click", () => {
      if (this.infowindow && this.infowindow.getMap()) {
        this.infowindow.close();
      }
      this.infowindow.setContent(contentString);
      this.infowindow.setPosition(marker.getPosition());
      this.infowindow.open(this.map, marker);
    });
  }

  getContentString(beneficiario: Beneficiario) {
    return `
      <div class="w-64 text-center overflow-hidden shadow-lg">
        <img class="rounded-circle" style="width: 100px; height: 100px; object-fit: cover;"
          src="${beneficiario.sexo === 1 ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"' : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80'}"
          alt="Sunset in the mountains">

        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">${beneficiario.nombreCompleto}</div>
          <p class="text-gray-900 text-base font-bold">
            Programa inscrito:
            <p class="text-gray-700 text-base font-bold">
              ${beneficiario.programaSocial.nombre}
            </p>
          </p>
          <p class="text-gray-900 text-base font-bold">
            Dirección:
            <p class="text-gray-700 text-base font-bold">
              ${beneficiario.domicilio}
            </p>
          </p>
        </div>
      </div>
    `;
  }

  onClear() {
    this.setAllMarkers();
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }



}
