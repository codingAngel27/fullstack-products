import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from '../../models/producto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../../core/services/producto.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {

  /*
  * Producto seleccionado para editar. Si es null, se asume que es para crear uno nuevo.
  */
  @Input() selectedProduct?: Producto | null = null;
  @Output() onSave = new EventEmitter<Producto>();
  @Output() onClose = new EventEmitter<void>();

  productForm!: FormGroup;
  isSubmitting = false;
  title = 'Agregar producto';

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) { }

  /*
  * Inicialización del formulario.
  */
  ngOnInit(): void {
    this.productForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      marca: [''],
      modelo: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: ['ACTIVO', Validators.required]
    });

    // Si hay producto seleccionado → modo edición
    if (this.selectedProduct) {
      this.title = 'Editar producto';
      this.productForm.patchValue(this.selectedProduct);
    }
  }

  /*
  * Guarda el producto (nuevo o editado).
  */
  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const productData = this.productForm.value as Producto;

    // Si hay producto seleccionado → EDITAR PRODUCTO
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productoService.actualizar(this.selectedProduct.id, productData).subscribe({
        next: (apiResponse) => {
          this.isSubmitting = false;
          const productoActualizado = apiResponse.data;

          Swal.fire({
            icon: 'success',
            title: apiResponse.mensaje,
            text: `El producto ${productoActualizado.nombre} ha sido actualizado.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
            background: '#f0fff4',
            iconColor: '#2f855a'
          });
          this.onSave.emit(productoActualizado);
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || 'Ocurrió un error inesperado.';
          
          if (err.status === 400 && msg.includes('Ya existe')) {
             Swal.fire({
              icon: 'warning',
              title: 'Producto duplicado',
              text: msg,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fffbea',
              iconColor: '#b7791f'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              text: msg,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fff5f5',
              iconColor: '#c53030'
            });
          }
        }
      });

    } else {
      this.productoService.crear(productData).subscribe({
        next: (apiResponse) => {
          this.isSubmitting = false;

          const nuevoProducto = apiResponse.data;

          Swal.fire({
            icon: 'success',
            title: apiResponse.mensaje,
            text: `Se ha creado el producto ${nuevoProducto.nombre}.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
            background: '#f0fff4',
            iconColor: '#2f855a'
          });
          this.onSave.emit(nuevoProducto);
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || 'Ocurrió un error inesperado.';

          if (err.status === 400 && msg.includes('Ya existe')) {
            Swal.fire({
             icon: 'warning',
             title: 'Producto duplicado',
             text: msg,
             toast: true,
             position: 'top-end',
             showConfirmButton: false,
             timer: 2500,
             background: '#fffbea',
             iconColor: '#b7791f'
           });
         } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear',
              text: msg,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fff5f5',
              iconColor: '#c53030'
            });
         }
        }
      });
    }
  }

  /*
  * Cierra el modal.
  */
  close(): void {
    this.onClose.emit();
  }

}