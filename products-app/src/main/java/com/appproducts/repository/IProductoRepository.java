package com.appproducts.repository;

import com.appproducts.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IProductoRepository extends JpaRepository<Producto, Long> {

   // Buscar por código y estado

    Optional<Producto> findByCodigoAndEstado(String codigo, String estado);

    // Listar todos los productos activos
    Page<Producto> findByEstadoOrderByFechaCreacionDesc(String estado, Pageable pageable);

    // Filtrar por marca (contiene) y estado
    Page<Producto> findByMarcaContainingIgnoreCaseAndEstadoOrderByFechaCreacionDesc(
            String marca,
            String estado,
            Pageable pageable
    );

    // Filtrar por modelo (contiene) y estado
    Page<Producto> findByModeloContainingIgnoreCaseAndEstadoOrderByFechaCreacionDesc(
            String modelo,
            String estado,
            Pageable pageable
    );

    // Filtrar por marca Y modelo (contiene) y estado
    Page<Producto> findByMarcaContainingIgnoreCaseAndModeloContainingIgnoreCaseAndEstadoOrderByFechaCreacionDesc(
            String marca,
            String modelo,
            String estado,
            Pageable pageable
    );

}
