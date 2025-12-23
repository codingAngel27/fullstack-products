package com.appproducts.controller;

import com.appproducts.dto.ApiResponse;
import com.appproducts.dto.ProductoDTO;
import com.appproducts.service.serviceImpl.ProductoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoServiceImpl productoService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductoDTO>> crear(@Valid @RequestBody ProductoDTO dto) {

        ProductoDTO creado = productoService.crear(dto);

        ApiResponse<ProductoDTO> response = new ApiResponse<>(
                "Producto creado exitosamente",
                creado
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProductoDTO>> listar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProductoDTO> productos = productoService.listar(marca, modelo, page, size);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerPorId(id);
        return ResponseEntity.ok(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoDTO dto
    ) {
        ProductoDTO actualizado = productoService.actualizar(id, dto);

        ApiResponse<ProductoDTO> response = new ApiResponse<>(
                "Producto actualizado exitosamente",
                actualizado
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);

        ApiResponse<Void> response = new ApiResponse<>(
                "Producto eliminado exitosamente",
                null
        );

        return ResponseEntity.ok(response);
    }
}