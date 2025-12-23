package com.appproducts.service.serviceImpl;

import com.appproducts.dto.ProductoDTO;
import com.appproducts.entity.Producto;
import com.appproducts.exception.BadRequestException;
import com.appproducts.exception.ResourceNotFoundException;
import com.appproducts.repository.IProductoRepository;
import com.appproducts.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class ProductoServiceImpl implements IProductoService {

    @Autowired
    private IProductoRepository productoRepository;

    @Override
    public ProductoDTO crear(ProductoDTO dto) {
        validarCodigoUnico(dto.getCodigo(), null);

        Producto producto = convertirAEntidad(dto);
        producto = productoRepository.save(producto);

        return convertirADTO(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoDTO> listar(String marca, String modelo, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> productos;

        boolean tieneMarca = marca != null && !marca.trim().isEmpty();
        boolean tieneModelo = modelo != null && !modelo.trim().isEmpty();

        if (tieneMarca && tieneModelo) {
            productos = productoRepository
                    .findByMarcaContainingIgnoreCaseAndModeloContainingIgnoreCaseAndEstadoOrderByFechaCreacionDesc(
                            marca.trim(),
                            modelo.trim(),
                            "A",
                            pageable
                    );
        } else if (tieneMarca) {
            productos = productoRepository
                    .findByMarcaContainingIgnoreCaseAndEstadoOrderByFechaCreacionDesc(
                            marca.trim(),
                            "A",
                            pageable
                    );
        } else if (tieneModelo) {
            productos = productoRepository
                    .findByModeloContainingIgnoreCaseAndEstadoOrderByFechaCreacionDesc(
                            modelo.trim(),
                            "A",
                            pageable
                    );
        } else {
            productos = productoRepository
                    .findByEstadoOrderByFechaCreacionDesc("A", pageable);
        }

        return productos.map(this::convertirADTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .filter(p -> "A".equals(p.getEstado()))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Producto no encontrado con ID: " + id)
                );

        return convertirADTO(producto);
    }

    @Override
    public ProductoDTO actualizar(Long id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .filter(p -> "A".equals(p.getEstado()))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Producto no encontrado con ID: " + id)
                );

        validarCodigoUnico(dto.getCodigo(), id);

        producto.setCodigo(dto.getCodigo());
        producto.setNombre(dto.getNombre());
        producto.setMarca(dto.getMarca());
        producto.setModelo(dto.getModelo());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setFechaModif(LocalDateTime.now());

        producto = productoRepository.save(producto);

        return convertirADTO(producto);
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .filter(p -> "A".equals(p.getEstado()))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Producto no encontrado con ID: " + id)
                );

        producto.setEstado("I");
        producto.setFechaModif(LocalDateTime.now());

        productoRepository.save(producto);
    }

    private void validarCodigoUnico(String codigo, Long idActual) {
        Optional<Producto> existente = productoRepository.findByCodigoAndEstado(codigo, "A");

        if (existente.isPresent() && !existente.get().getId().equals(idActual)) {
            throw new BadRequestException("Ya existe un producto con el código: " + codigo);
        }
    }

    private ProductoDTO convertirADTO(Producto producto) {
        if (producto == null) {
            return null;
        }

        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setCodigo(producto.getCodigo());
        dto.setNombre(producto.getNombre());
        dto.setMarca(producto.getMarca());
        dto.setModelo(producto.getModelo());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setEstado(producto.getEstado());
        dto.setFechaCreacion(producto.getFechaCreacion());
        dto.setFechaModif(producto.getFechaModif());

        return dto;
    }

    private Producto convertirAEntidad(ProductoDTO dto) {
        if (dto == null) {
            return null;
        }

        Producto producto = new Producto();
        producto.setCodigo(dto.getCodigo());
        producto.setNombre(dto.getNombre());
        producto.setMarca(dto.getMarca());
        producto.setModelo(dto.getModelo());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());

        return producto;
    }
}
