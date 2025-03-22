package com.fis.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_detail")
public class UserDetail extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "user_detail_seq")
    @SequenceGenerator(name = "user_detail_seq",
            sequenceName = "user_detail_sequence",
            allocationSize = 1)
    private Long id;

    @Column(name = "uid", nullable = false, unique = true)
    private Long uid;

    @Column(name = "gender")
    private String gender;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "avatar_url")
    private String avatarUrl;
}
