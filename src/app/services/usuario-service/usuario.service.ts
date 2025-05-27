// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @description
 * Servicio para la gestión de usuarios.
 * Permite agregar, obtener, actualizar y eliminar usuarios.
 */


/**
 * @usageNotes
 * Este servicio utiliza el almacenamiento local para almacenar la lista de usuarios y el usuario actualmente autenticado.
 * Los métodos proporcionados permiten realizar operaciones básicas de gestión de usuarios, como agregar, obtener, actualizar y eliminar usuarios.
 */


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8082/usuario';
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  addUser(user: any): Observable<any> {
    return this.http.post(this.baseUrl, user);
  }

  authenticate(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${this.baseUrl}/signin`, loginData, { observe: 'response' });
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user)); // Almacena el usuario en localStorage
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser); // Recupera el usuario de localStorage si no está en memoria
        } catch (error) {
          console.error('Error parsing JSON from localStorage:', error);
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
    }
    return this.currentUser;
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${user.id}`, user);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser'); // Elimina el usuario de localStorage al cerrar sesión
  }
}