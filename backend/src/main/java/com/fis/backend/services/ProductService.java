package com.fis.backend.services;

import com.fis.backend.dto.request.ProductRequest;
import com.fis.backend.dto.response.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponse addProduct(ProductRequest productRequest, MultipartFile file);

    ProductResponse getProductById(String productId);

    ProductResponse updateProduct(String id, ProductRequest productRequest);

    Boolean deleteProduct(String productId);

    ProductResponse getProduct(String productId);

    ProductResponse getProductByName(String productName);

    List<ProductResponse> getAllProducts();

}
