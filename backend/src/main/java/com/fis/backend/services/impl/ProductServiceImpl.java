package com.fis.backend.services.impl;

import com.fis.backend.dto.request.ProductRequest;
import com.fis.backend.dto.response.ProductResponse;
import com.fis.backend.entity.Product;
import com.fis.backend.mapper.ProductMapper;
import com.fis.backend.repository.ProductRepository;
import com.fis.backend.services.GoogleDriveService;
import com.fis.backend.services.ProductService;
import com.fis.backend.utils.GenaratedId;
import com.fis.backend.utils.enums.FolderType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    GenaratedId genaratedId;
    ModelMapper modelMapper;
    ProductMapper productMapper;
    GoogleDriveService googleDriveService;

    @Override
    public ProductResponse addProduct(ProductRequest request, MultipartFile file) {
        Product product = productMapper.toProduct(request);
        Product lastPlant = productRepository.findFirstByOrderByIdDesc();
        if (lastPlant == null) {
            product.setId(genaratedId.createNewID("PD"));
        } else {
            product.setId(genaratedId.createIDFromLastID("PD", 2, lastPlant.getId()));
        }
        product.setImageUrl(genaratedId.getIdImage(
                googleDriveService.uploadImageToDrive(file, FolderType.PRODUCT)));
        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    @Override
    public ProductResponse getProductById(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public ProductResponse updateProduct(String id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(productRequest.getName());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setDescription(productRequest.getDescription());
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    @Override
    public Boolean deleteProduct(String productId) {
        var product = productRepository.findById(productId).orElseThrow(
                ()-> new RuntimeException("Product not found"));
        productRepository.delete(product);
        return true;
    }

    @Override
    public ProductResponse getProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public ProductResponse getProductByName(String productName) {
        return null;
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();
        return products.stream().map(product -> modelMapper.map(product, ProductResponse.class)).toList();
    }
}
