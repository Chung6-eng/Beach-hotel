package com.codework.beachhotel.service;

import com.codework.beachhotel.exception.UserAlreadyExistsException;
import com.codework.beachhotel.model.Role;
import com.codework.beachhotel.model.User;
import com.codework.beachhotel.repository.RoleRepository;
import com.codework.beachhotel.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

//    @Bean
//    CommandLineRunner initRoles(RoleRepository roleRepository) {
//        return args -> {
//            if(!roleRepository.existsByName("ROLE_USER")) {
//                roleRepository.save(new Role("ROLE_USER"));
//            }
//            if(!roleRepository.existsByName("ROLE_ADMIN")) {
//                roleRepository.save(new Role("ROLE_ADMIN"));
//            }
//        };
//    }


    @Override
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(user.getEmail() + " already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println(user.getPassword());
        Role userRole = roleRepository.findByName("ROLE_USER").get();

        user.setRoles(Collections.singletonList(userRole));
        return userRepository.save(user);
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUser(String email) {
        return (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    @Override
    public void deleteUser(String email) {
        User theUser = getUser(email);

        userRepository.deleteByEmail(email);
    }
}
