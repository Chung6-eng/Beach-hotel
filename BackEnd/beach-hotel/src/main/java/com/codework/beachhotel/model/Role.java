package com.codework.beachhotel.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.security.Permission;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @ManyToMany(mappedBy = "roles")
    private Collection<User> users = new HashSet<>();


    public void assignRoleToUser(User user) {
        user.getRoles().add(this);
        this.getUsers().add(user);
    }

    public void removeUserFromRole(User user) {
        user.getRoles().remove(this);
        this.getUsers().remove(user);
    }

    public void removeAllUserFromRole() {
        if(this.getUsers() != null) {
            List<User> roleUSers = this.getUsers().stream().toList();
            roleUSers.forEach(this::removeUserFromRole);
        }
    }
    public String getName(){
        return name != null ? name : "";

    }

    public Role(String name) {
        this.name = name;
    }
}
