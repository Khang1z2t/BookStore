package com.fis.backend.services.impl;

import com.fis.backend.dto.request.ProductRequest;
import com.fis.backend.dto.response.ProductResponse;
import com.fis.backend.entity.Product;
import com.fis.backend.repository.ProductRepository;
import com.fis.backend.services.ProductService;
import com.fis.backend.utils.GenaratedId;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    GenaratedId genaratedId;
    ModelMapper modelMapper;

    @Override
    public ProductResponse addProduct(ProductRequest request) {
        Product product = modelMapper.map(request, Product.class);
        Product lastPlant = productRepository.findFirstByOrderByIdDesc();
        if (lastPlant == null) {
            product.setId(genaratedId.createNewID("PD"));
        } else {
            product.setId(genaratedId.createIDFromLastID("PD", 2, lastPlant.getId()));
        }
        return modelMapper.map(productRepository.save(product), ProductResponse.class);
    }

    @Override
    public ProductResponse getProductById(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public ProductResponse updateProduct(ProductRequest productRequest) {
        return null;
    }

    @Override
    public Boolean deleteProduct(Long productId) {
        return null;
    }

    @Override
    public ProductResponse getProduct(Long productId) {
        return null;
    }

    @Override
    public ProductResponse getProductByName(String productName) {
        return null;
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> modelMapper.map(product, ProductResponse.class)).toList();
    }
}
