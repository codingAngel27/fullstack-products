import { Routes } from '@angular/router';
import { ProductoListComponent } from './features/productos/pages/producto-list/producto-list.component';

export const routes: Routes = [

    {
    path: 'productos', 
    component: ProductoListComponent,
    title: 'Gestión de Productos'
  },
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'productos'
  }
];
