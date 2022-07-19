const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { username: 1, name:1 })
	response.json(blogs)
})

const getTokenFrom = request => {  
	const authorization = request.get('authorization')  
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

const getUserFromToken = request => {
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	return decodedToken.id
}


blogsRouter.post('/', async (request, response) => {
	if (request.body.likes === undefined) {
		request.body.likes = 0
	}
	
	const userlogged = await User.findById(getUserFromToken(request))
	
	if (request.body.title === undefined || request.body.url === undefined) {
		response.status(400).end()
	}else{
		const blog = new Blog({
			title: request.body.title,
			author: request.body.author,
			url: request.body.url,
			likes: request.body.likes,
			user: userlogged._id
		})
		const savedBlog = await blog.save()

		userlogged.blogs = userlogged.blogs.concat(savedBlog._id)
		await userlogged.save()
	
		response.status(201).json(savedBlog)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {

	const userlogged = await User.findById(getUserFromToken(request))
	
	const blog_to_delete = await Blog.findById(request.params.id)
	if (blog_to_delete.user.toString() === userlogged._id.toString()) { 
		await Blog.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} else {
		return response.status(401).json({ 
			error: 'This blog post is not yours to delete' 
		})  
	}
})

blogsRouter.put('/', async (request, response, next) => {
	const body = request.body

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	}
	
	await Blog.findOneAndUpdate({title: body.title}, blog)
		.then(updatedBlog => {
		    response.json(updatedBlog)
		})
		.catch(error => next(error))
})

module.exports = blogsRouter