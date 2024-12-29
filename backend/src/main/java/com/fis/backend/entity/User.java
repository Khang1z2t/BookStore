package com.fis.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "userid", nullable = false)
    private UUID userId;

    @Column(name = "profileid", length = Integer.MAX_VALUE)
    private String profileId;

    @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "firstname", length = Integer.MAX_VALUE)
    private String firstName;

    @Column(name = "lastname", length = Integer.MAX_VALUE)
    private String lastName;

    @Size(max = 10)
    @Column(name = "phone", length = 10)
    private String phone;

    @Column(name = "address", length = Integer.MAX_VALUE)
    private String address;

    @Column(name = "birthday")
    private LocalDate birthday;

}