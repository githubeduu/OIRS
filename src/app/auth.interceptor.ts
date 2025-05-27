import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);

  console.log('AuthInterceptor: Interceptando solicitud HTTP.');
  
  // Obtener la cuenta activa de MSAL
  const account = msalService.instance.getActiveAccount();

  if (!account) {
    console.warn('AuthInterceptor: No hay cuenta activa en MSAL.');
    return next(req); // Continuar con la solicitud original si no hay cuenta activa
  }

  console.log('AuthInterceptor: Cuenta activa encontrada:', account);

  // Obtener el token de acceso silenciosamente
  return new Observable((observer) => {
    console.log('AuthInterceptor: Solicitando token de acceso de manera silenciosa.');
    
    msalService.acquireTokenSilent({ 
      account, 
      scopes: ['openid'], // Scope básico para depuración
    }).subscribe({
      next: (tokenResponse) => {
        console.log('tokenResponse', tokenResponse);
        console.log('AuthInterceptor: Token de acceso obtenido exitosamente:', tokenResponse.idToken);

        // Clonar la solicitud HTTP para agregar el encabezado de autorización
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenResponse.idToken}`,
          },
        });

        console.log('AuthInterceptor: Solicitud clonada con el encabezado de autorización:', authReq);

        // Pasar la solicitud clonada al siguiente manejador
        next(authReq).subscribe({
          next: (event) => {
            console.log('AuthInterceptor: Solicitud HTTP procesada exitosamente.', event);
            observer.next(event);
          },
          error: (err) => {
            console.error('AuthInterceptor: Error procesando la solicitud HTTP:', err);
            observer.error(err);
          },
          complete: () => {
            console.log('AuthInterceptor: Solicitud HTTP completada.');
            observer.complete();
          },
        });
      },
      error: (err) => {
        console.error('AuthInterceptor: Error obteniendo token de acceso:', err);
        observer.error(err);
      },
    });
  });
};
