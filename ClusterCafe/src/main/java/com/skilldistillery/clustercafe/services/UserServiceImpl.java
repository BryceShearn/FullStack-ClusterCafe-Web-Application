package com.skilldistillery.clustercafe.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.clustercafe.entities.User;
import com.skilldistillery.clustercafe.repositories.UserRepository;

@Service
@Transactional
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public List<User> index() {
		return userRepo.findAll();
	}
	
	@Override
	public User showLoggedIn(String username) {
		return userRepo.findByUsername(username);
	}

	@Override
	public User show(int id) {
		User user = null;
		if (userRepo.findById(id).isPresent()) {
			user = userRepo.findById(id).get();
		}
		return user;
	}

	@Override
	public User create(User user) {
		if (user.getEnabled() == null) {
			user.setEnabled(true);
		}
		if (user.getRole() == null) {
			user.setRole("standard");
		}
		return userRepo.save(user);
	}

	@Override
	public User update(int id, User user, String username) {
		User managedUser = userRepo.findByIdAndEnabledTrueAndUsername(id, username);
		boolean admin = userRepo.findByUsername(username).getRole().equals("admin");
		if (managedUser != null) {
//			managedUser = userRepo.findById(id).get();
			if (user.getDob() != null) {
				managedUser.setDob(user.getDob());
			}
			if (user.getEmail() != null) {
				managedUser.setEmail(user.getEmail());
			}
			if (user.getFirstName() != null) {
				managedUser.setFirstName(user.getFirstName());
			}
			if (user.getLastName() != null) {
				managedUser.setLastName(user.getLastName());
			}
			if (user.getGender() != null) {
				managedUser.setGender(user.getGender());
			}
			if (user.getImgUrl() != null) {
				managedUser.setImgUrl(user.getImgUrl());
			}
			if (user.getPronouns() != null) {
				managedUser.setPronouns(user.getPronouns());
			}
			if (user.getRole() != null) {
				managedUser.setRole(user.getRole());
			}
			if (user.getStore() != null) {
				managedUser.setStore(user.getStore());
			}
			if (user.getEnabled() != null) {
				managedUser.setEnabled(user.getEnabled());
			}
		} else if (admin && userRepo.findByIdAndEnabledTrue(id) != null) {
			managedUser = userRepo.findByIdAndEnabledTrue(id);
			if (user.getEnabled() != null) {
				managedUser.setEnabled(user.getEnabled());
			}
		}
		return managedUser;
	}

	@Override
	public boolean softDelete(int id, String username) {
		boolean deleted = false;
		User loggedInUser = userRepo.findByUsername(username);
		if (userRepo.findById(id).isPresent() && loggedInUser != null) {
			User user = userRepo.findById(id).get();
			if (loggedInUser.getUsername().equals(user.getUsername()) ||
					loggedInUser.getRole().equals("admin")) {
				user.setEnabled(false);
				deleted = true;
			}
			
		}
		return deleted;
	}

}
