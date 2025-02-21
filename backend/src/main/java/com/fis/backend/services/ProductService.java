package com.fis.backend.services;

import com.fis.backend.dto.request.ProductRequest;
import com.fis.backend.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse addProduct(ProductRequest productRequest);

    ProductResponse getProductById(String productId);

    ProductResponse updateProduct(ProductRequest productRequest);

    Boolean deleteProduct(Long productId);

    ProductResponse getProduct(Long productId);

    ProductResponse getProductByName(String productName);

    List<ProductResponse> getAllProducts();

}
