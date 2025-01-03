package com.fis.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "books_id_gen")
    @SequenceGenerator(name = "books_id_gen", sequenceName = "rename", allocationSize = 1)
    @Column(name = "book_id", nullable = false)
    private Integer id;

    @Column(name = "title", length = Integer.MAX_VALUE)
    private String title;

    @Column(name = "author", length = Integer.MAX_VALUE)
    private String author;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "price")
    private Double price;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "image_url", length = Integer.MAX_VALUE)
    private String imageUrl;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(name = "create_at")
    private Instant createAt;

    @Column(name = "update_at")
    private Instant updateAt;

}