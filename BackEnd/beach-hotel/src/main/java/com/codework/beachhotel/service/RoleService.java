package com.codework.beachhotel.service;

import com.codework.beachhotel.exception.RoleAlreadyistEception;
import com.codework.beachhotel.model.Role;
import com.codework.beachhotel.model.User;
import com.codework.beachhotel.repository.RoleRepository;
import com.codework.beachhotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {

    private final IUserService userService;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role theRole) {
        String roleName = "ROLE_" + theRole.getName().toUpperCase();
        Role role = new Role(roleName);
        if(roleRepository.existsByName(role.getName())) {
            throw new RoleAlreadyistEception(theRole.getName() + "Role already exists");
        }
        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long roleId) {
        this.removeAllUsersFromRole(roleId);
        roleRepository.deleteById(roleId);

    }

    @Override
    public Role findByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new UsernameNotFoundException("Role not found with name: " + name));

    }

    @Override
    public User removeUserFromRole(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role> role = roleRepository.findById(roleId);
        if(role.isPresent() && role.get().getUsers().contains(user.get())) {
            role.get().removeUserFromRole(user.get());
            roleRepository.save(role.get());
            return user.get();
        }
        throw new UsernameNotFoundException("User not found");
    }

    @Override
    public User assignRoleToUser(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role> role = roleRepository.findById(roleId);
        if(user.isPresent() && user.get().getRoles().contains(role.get())) {
            throw new RoleAlreadyistEception(user.get().getFirstName()+"is already assigned to the"+role.get().getName()+"role");
        }
        if(role.isPresent() && role.get().getUsers().contains(user.get())) {
            role.get().assignRoleToUser(user.get());
            roleRepository.save(role.get());
        }
        return  user.get();
    }

    @Override
    public Role removeAllUsersFromRole(Long roleId) {
        Optional<Role> role = roleRepository.findById(roleId);
        role.get().removeAllUserFromRole();


        return roleRepository.save(role.get());
    }
}
