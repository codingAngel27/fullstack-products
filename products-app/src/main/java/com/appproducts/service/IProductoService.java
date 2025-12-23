package com.appproducts.service;


import com.appproducts.dto.ProductoDTO;
import org.springframework.data.domain.Page;

import javax.transaction.Transactional;

public interface IProductoService {

    ProductoDTO crear(ProductoDTO dto);

    Page<ProductoDTO> listar(String marca, String modelo, int page, int size);

    ProductoDTO obtenerPorId(Long id);

    ProductoDTO actualizar(Long id, ProductoDTO dto);

    void eliminar(Long id);
}

