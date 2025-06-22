import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/usuario-service/usuario.service';
import { MsalService } from '@azure/msal-angular';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud-service/solicitud.service';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './crear-solicitud.component.html',
  styleUrl: './crear-solicitud.component.css'
})
export class CrearSolicitudComponent {
currentUser: any;

formCiudadano = {
    rut: '',
    nombre: '',
    email: '',
    region: '',
    descripcion: ''
  };

  formGrupo = {
    rut: '',
    nombre: '',
    email: '',
    region: '',
    descripcion: ''
  };

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



enviarSolicitudCiudadano() {
    const rutLimpio = this.formCiudadano.rut.replace(/\./g, '').replace('-', '');
    const rutSolicitante = Number(rutLimpio.slice(0, -1));
    const dvSolicitante = rutLimpio.slice(-1).toUpperCase();

    const solicitud = {
      fechaIngreso: new Date().toISOString().split('T')[0],
      rutSolicitante,
      dvSolicitante,
      nombreSolicitante: this.formCiudadano.nombre,
      emailSolicitante: this.formCiudadano.email,
      region: this.formCiudadano.region,
      descripcion: this.formCiudadano.descripcion
    };

    this.solicitudService.addSolicitud(solicitud).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente (Ciudadano).');
      },
      error: (error) => {
        console.error('Error al enviar solicitud Ciudadano:', error);
        alert('Error al enviar la solicitud del ciudadano.');
      }
    });
  }

  enviarSolicitudGrupo() {
    const rutLimpio = this.formGrupo.rut.replace(/\./g, '').replace('-', '');
    const rutSolicitante = Number(rutLimpio.slice(0, -1));
    const dvSolicitante = rutLimpio.slice(-1).toUpperCase();

    const solicitud = {
      fechaIngreso: new Date().toISOString().split('T')[0],
      rutSolicitante,
      dvSolicitante,
      nombreSolicitante: this.formGrupo.nombre,
      emailSolicitante: this.formGrupo.email,
      region: this.formGrupo.region,
      descripcion: this.formGrupo.descripcion
    };

    this.solicitudService.addSolicitud(solicitud).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente (Grupo).');
      },
      error: (error) => {
        console.error('Error al enviar solicitud Grupo:', error);
        alert('Error al enviar la solicitud del grupo.');
      }
    });
  }



}
