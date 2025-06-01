import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';

export const routes: Routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'solicitudes', component: SolicitudesComponent },
];
