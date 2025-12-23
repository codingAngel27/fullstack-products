import { CommonModule, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageResponse, Producto } from '../../models/producto';
import { ProductoService } from '../../../../core/services/producto.service';
import Swal from 'sweetalert2';
import { ProductoFormComponent } from "../producto-form/producto-form.component";
import { ProductoDetailComponent } from "../producto-detail/producto-detail.component";

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductoFormComponent, ProductoDetailComponent],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent {

  productos: Producto[] = [];

  filterField: 'marca' | 'modelo' = 'marca';
  filterValue = '';

  page = 0;
  size = 10;
  totalPages = 0;
  isModalOpen = false;
  selectedProduct: Producto | null = null;

  showDetailModal: boolean = false;
  detailProduct: Producto | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  /**
   * Carga productos paginados (solo estado A desde backend)
   */
  loadProductos(): void {
    this.productoService.listar(this.page, this.size).subscribe({
      next: (response: PageResponse<Producto>) => {
        this.productos = response.content;
        this.totalPages = response.totalPages;
        this.page = response.number;
      },
      error: (error) => console.error('Error al cargar productos', error)
    });
  }

  /**
   * Cambia de página
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadProductos();
    }
  }

  /**
   * Limpia filtros
   */
  clearFilters(): void {
    this.filterValue = '';
    this.page = 0;
    this.loadProductos();
  }

  /**
   * Filtrar productos por marca o modelo
   */
  filter(): void {
    if (!this.filterValue.trim()) {
      this.loadProductos();
      return;
    }

    const marca = this.filterField === 'marca' ? this.filterValue : undefined;
    const modelo = this.filterField === 'modelo' ? this.filterValue : undefined;

    this.productoService
      .filter(marca, modelo, this.page, this.size)
      .subscribe({
        next: (response) => {
          this.productos = response.content;
          this.totalPages = response.totalPages;
        },
        error: (err) => console.error(err)
      });
  }

  /**
   * Abre el modal de creación de un nuevo producto.
   */
  openCreateModal(): void {
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  /**
   * Abre el modal de edición con el producto seleccionado.
   */
  openEditModal(producto: Producto): void {
    this.selectedProduct = producto;
    this.isModalOpen = true;
  }

  /**
   * Maneja el guardado (creación o edición) de un producto.
   * Actualiza la lista sin necesidad de recargar completamente.
   */
  handleSave(producto: Producto): void {
  this.isModalOpen = false;
  this.loadProductos();
  
}

  /**
   * Eliminación lógica (estado = I) con actualización automática de la lista
   */
  confirmDelete(producto: Producto): void {
    if (!producto.id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto "${producto.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.delete(producto.id!).subscribe({
          next: (apiResponse) => {
            Swal.fire({
              icon: 'success',
              title: apiResponse.mensaje,
              text: `El producto "${producto.nombre}" ha sido eliminado`,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              background: '#f0fff4',
              iconColor: '#2f855a'
            });
      
            this.productos = this.productos.filter(p => p.id !== producto.id);
            if (this.productos.length === 0 && this.page > 0) {
              this.page--;
              this.loadProductos();
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.message || 'Error al eliminar producto',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              background: '#fff5f5',
              iconColor: '#c53030'
            });
          }
        });
      }
    });
  }
  openDetailModal(producto: Producto) {
    this.detailProduct = producto;
    this.showDetailModal = true;
  }
  closeDetailModal() {
    this.showDetailModal = false;
    this.detailProduct = null;
  }
}