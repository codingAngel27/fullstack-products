import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, PageResponse, Producto } from '../../features/productos/models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

 private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  listar(page: number, size: number): Observable<PageResponse<Producto>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Producto>>(this.apiUrl, { params });
  }

  filter(marca?: string, modelo?: string, page = 0, size = 10) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (marca) params = params.set('marca', marca);
    if (modelo) params = params.set('modelo', modelo);

    return this.http.get<PageResponse<Producto>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }


  crear(producto: Producto): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(this.apiUrl, producto);
  }


  actualizar(id: number, producto: Producto): Observable<ApiResponse<Producto>> {
    return this.http.put<ApiResponse<Producto>>(`${this.apiUrl}/${id}`, producto);
  }


  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
