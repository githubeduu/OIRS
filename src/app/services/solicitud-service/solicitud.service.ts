import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  private baseUrl = 'https://oirs-backend-162097676670.us-east1.run.app/solicitudes';

  constructor(private http: HttpClient) {}

  getSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  addSolicitud(nuevaSolicitud: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, nuevaSolicitud);
  }

//   updateSolicitud(id: number, paciente: any): Observable<any> {
//     return this.http.put<any>(`${this.baseUrl}/${id}`, paciente);
//   }
  
//   deleteSolicitud(id: number): Observable<any> {
//     return this.http.delete<any>(`${this.baseUrl}/${id}`);
//   }
}