package com.skilldistillery.clustercafe.controllers;

import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skilldistillery.clustercafe.entities.PostComment;
import com.skilldistillery.clustercafe.services.PostCommentService;

@CrossOrigin({"*", "http://localhost:4290"})
@RequestMapping("api/posts")
@RestController
public class PostCommentController {
	
	@Autowired
	private PostCommentService pcSvc;
	
	@GetMapping("{id}/comments")
	public List<PostComment> allCommentsForPost(@PathVariable int id,
			HttpServletRequest req, 
			HttpServletResponse res) {
		List<PostComment> comments = pcSvc.indexByPost(id);
		if (comments == null) {
			res.setStatus(404);
		}
		return comments;
	}
	
	@GetMapping("{postId}/comments/{commentId}")
	public PostComment show(@PathVariable int postId, 
			@PathVariable int commentId,
			HttpServletRequest req, 
			HttpServletResponse res) {
		PostComment comment = pcSvc.show(commentId, postId);
		if (comment == null) {
			res.setStatus(404);
		}
		return comment;		
	}
	
	@PostMapping("{postId}/comments")
	public PostComment create(@PathVariable int postId,
			@RequestBody PostComment postComment,
			HttpServletRequest req, 
			HttpServletResponse res,
			Principal principal) {
		try {
			postComment = pcSvc.create(postId, principal.getName(), postComment);
			if (postComment != null) {
				res.setStatus(201);
				StringBuffer url = req.getRequestURL();			
				url.append("/").append(postComment.getId());
				res.setHeader("location", url.toString());
			}
		} catch (Exception e) {
			System.err.println(e);
			res.setStatus(400);
			postComment = null;
		}
		return postComment;
	}

}




