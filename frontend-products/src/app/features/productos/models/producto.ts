export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  marca?: string;
  modelo?: string;
  precio: number;
  stock: number;
  estado?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
export interface ApiResponse<T> {
  mensaje: string;
  data: T;
  timestamp: string;
}