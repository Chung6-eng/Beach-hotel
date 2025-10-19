package com.codework.beachhotel.service;

import com.codework.beachhotel.model.User;

import java.util.List;

public interface IUserService {
    User registerUser(User user);
    List<User> getUsers();
    User getUser(String email);
    void deleteUser(String email);
}
