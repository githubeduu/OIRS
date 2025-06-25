import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/usuario-service/usuario.service';
import { MsalService } from '@azure/msal-angular';
import { SolicitudService } from '../../services/solicitud-service/solicitud.service';

@Component({
  selector: 'app-listado-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './listado-solicitudes.component.html',
  styleUrl: './listado-solicitudes.component.css'
})
export class ListadoSolicitudesComponent {
currentUser: any;
solicitudes: any[] = [];
solicitudSeleccionada: any = null;


constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly userService: UserService,
    private readonly msalService: MsalService,
    private readonly solicitudService: SolicitudService
  ) {}

    ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then((res) => {  
      if (res && res.account) {
        // Configurar la cuenta activa después del login
        this.msalService.instance.setActiveAccount(res.account);
        this.currentUser = this.msalService.instance.getActiveAccount();
        this.getUserProfile(); // Cargar datos adicionales del usuario
      } else if (this.msalService.instance.getActiveAccount()) {
        // Usar la cuenta activa si ya existe
        this.currentUser = this.msalService.instance.getActiveAccount();
        this.getUserProfile(); // Cargar datos adicionales del usuario
      } else {
        // Fallback a UserService si es necesario
        this.currentUser = this.userService.getCurrentUser();
      }

      this.cargarSolicitudes();
    }).catch((error) => {
      console.error('Error during MSAL redirect handling:', error);
    });
  }
  

  login() {
    this.msalService.loginPopup({ scopes: ['User.Read'] }).subscribe({
      next: (res) => {
        // Configurar la cuenta activa después del login
        this.msalService.instance.setActiveAccount(res.account);
        this.currentUser = this.msalService.instance.getActiveAccount();
        this.getUserProfile(); // Obtener información adicional del usuario
        window.location.reload();
      },
      error: (error) => {
        console.error('Error during login:', error);
      },
    });
  }

  logout() {
    this.msalService.logoutPopup({
        mainWindowRedirectUri: "/"
    });
 }

 getUserProfile() {
  const accessTokenRequest = {
    scopes: ['User.Read'] // Scope necesario para acceder al perfil del usuario
  };

  this.msalService.acquireTokenSilent(accessTokenRequest).subscribe({
    next: (response) => {
      const headers = { Authorization: `Bearer ${response.accessToken}` };

      fetch('https://graph.microsoft.com/v1.0/me', { headers })
        .then((res) => res.json())
        .then((profile) => {
          this.currentUser = profile; // Actualiza el perfil del usuario
          console.log('User profile:', profile); // Muestra los datos en la consola
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    },
    error: (error) => {
      console.error('Error acquiring token:', error);
    },
  });
}

  cargarSolicitudes() {
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data.map((s, index) => ({
          id: index + 1,
          rut: `${s.rutSolicitante}-${s.dvSolicitante}`,
          nombre: s.nombreSolicitante || '—',
          apellidos: s.apellidos || '—',
          tipoRequerimiento: s.tipoRequerimiento || '—',
          tipoConsulta: s.tipoConsulta || '—',
          region: s.region || '—',
          comuna: s.comuna || '—',
          genero: s.genero || '—',
          telefono: s.telefono || '—',
          direccion: s.direccion || '—',
          email: s.emailSolicitante || '—',
          descripcion: s.descripcion || '—',
          fecha: s.fechaIngreso || '—',
          estado: s.estado || 'Pendiente'
        }));
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        alert('No se pudieron cargar las solicitudes');
      }
    });
  }



 abrirModalActualizar(solicitud: any) {
  this.solicitudSeleccionada = solicitud;
}

abrirModalEliminar(solicitud: any) {
  this.solicitudSeleccionada = solicitud;
}

actualizarSolicitud() {
  // Aquí puedes integrar un servicio para actualizar en el backend
  alert(`Solicitud ${this.solicitudSeleccionada?.id} actualizada (ficticio)`);
}

eliminarSolicitud() {
  // Aquí puedes integrar un servicio para eliminar en el backend
  alert(`Solicitud ${this.solicitudSeleccionada?.id} eliminada (ficticio)`);

  // Opcional: remueve del array para reflejarlo en la tabla
  this.solicitudes = this.solicitudes.filter(s => s.id !== this.solicitudSeleccionada?.id);
}
 

}
