package com.codework.beachhotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column( nullable = false)
    @NotBlank(message = "FirstName không được để trống")
    private String firstName;
    @Column( nullable = false)
    @NotBlank(message = "LastName không được để trống")
    private String lastName;

    @Column(nullable = false, unique = true)
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;


    @Column(nullable = false)
    @NotBlank(message = "Password không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
            message = "Password phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt và tối thiểu 8 ký tự"
    )
    private String password;
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST,CascadeType.MERGE, CascadeType.DETACH} )

    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"), inverseJoinColumns =
    @JoinColumn(name = "role_id", referencedColumnName = "id"))



    private Collection<Role> roles = new HashSet<>();




}
