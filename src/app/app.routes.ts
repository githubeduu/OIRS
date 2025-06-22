import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ListadoSolicitudesComponent } from './components/listado-solicitudes/listado-solicitudes.component';
import { CrearSolicitudComponent } from './components/crear-solicitud/crear-solicitud.component';

export const routes: Routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'listado-solicitudes', component: ListadoSolicitudesComponent },
    { path: 'crear-solicitudes', component: CrearSolicitudComponent },
    
];
