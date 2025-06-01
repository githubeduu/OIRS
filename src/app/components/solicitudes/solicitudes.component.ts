import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../../services/usuario-service/usuario.service';
declare var bootstrap: any;

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './solicitudes.component.html',
 styleUrls: ['./solicitudes.component.css']
})

export class SolicitudesComponent {
  currentUser: any;

   constructor(
      private renderer: Renderer2,
      private el: ElementRef,
      @Inject(PLATFORM_ID) private platformId: Object,
      private readonly msalService: MsalService,
      private readonly userService: UserService,
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


  solicitudes = [
    { id: 1, titulo: 'Solicitud 1', descripcion: 'Descripción de la solicitud 1', fecha: '2025-06-01' },
    { id: 2, titulo: 'Solicitud 2', descripcion: 'Descripción de la solicitud 2', fecha: '2025-06-02' },
    { id: 3, titulo: 'Solicitud 3', descripcion: 'Descripción de la solicitud 3', fecha: '2025-06-03' }
  ];

  solicitudSeleccionada: any = null;

  abrirModal(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    const modal = new bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();
  }

  eliminarSolicitud(id: number) {
    // lógica de eliminación
  }

}