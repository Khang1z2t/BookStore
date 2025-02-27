package com.fis.backend.mapper;

import com.fis.backend.dto.request.ProductRequest;
import com.fis.backend.dto.response.ProductResponse;
import com.fis.backend.entity.Product;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final ModelMapper modelMapper;

    public ProductResponse toProductResponse(Product product) {
        return modelMapper.map(product, ProductResponse.class);
    }

    public Product toProduct(ProductResponse productResponse) {
        return modelMapper.map(productResponse, Product.class);
    }

    public Product toProduct(ProductRequest productRequest) {
        return modelMapper.map(productRequest, Product.class);
    }


}
