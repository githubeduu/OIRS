import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/usuario-service/usuario.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './crear-solicitud.component.html',
  styleUrl: './crear-solicitud.component.css'
})
export class CrearSolicitudComponent {
currentUser: any;

constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly userService: UserService,
    private readonly msalService: MsalService
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
}
