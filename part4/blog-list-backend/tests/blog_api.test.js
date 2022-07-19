const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.initialBlogs)
	await User.deleteMany({})
	await User.insertMany(helper.initialUsers)
})

let token = ''
beforeAll(async () => {
	const tester_login = await {
		username: 'testador',
		password: '12345678'
	}
	console.log(tester_login)

	const response = await api
		.post('/api/login')
		.send(tester_login)
	token = 'bearer ' + response.body.token
	console.log(token)
})

test('blogs are returned as JSON', async () =>
	await api
		.get('/api/blogs')
		.set('Authorization', token)
		.expect(200)
		.expect('Content-Type', /application\/json/)
)

test('unique identifier is id, not _id', async() => {
	const response = await api.get('/api/blogs').set('Authorization', token)
	console.log(response.body)
	response.body.forEach(r => expect(r.hasOwnProperty('id')).toBeDefined())	
})

test('new blog post is created', async() => {
	const newBlog = {
		title: 'I will never be a memory',
		author: 'Sephiroth',
		url: 'http://cloud.aerithlives.com/zack-does-not.html',
		likes: 7
	}

	await api
		.post('/api/blogs')
		.set('Authorization', token)
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	
	const new_blog = blogsAtEnd.filter(b => b.title === 'I will never be a memory')[0]
	expect(new_blog.title).toContain(newBlog.title)
	expect(new_blog.author).toContain(newBlog.author)
	expect(new_blog.url).toContain(newBlog.url)
	expect(new_blog.likes).toEqual(newBlog.likes)

})

test('if likes is missing, it defaults to 0', async () => {
	const newBlog = {
		title: 'I will never be a memory',
		author: 'Sephiroth',
		url: 'http://cloud.aerithlives.com/zack-does-not.html',
	}

	await api
		.post('/api/blogs')
		.set('Authorization', token)
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	
	const new_blog = blogsAtEnd.filter(b => b.title === 'I will never be a memory')[0]
	expect(new_blog.title).toContain(newBlog.title)
	expect(new_blog.author).toContain(newBlog.author)
	expect(new_blog.url).toContain(newBlog.url)
	expect(new_blog.likes).toEqual(0)
})

test('if title and url properties are missing, return 400 bad request', async () => {
	const newBlog = {
		author: 'Sephiroth',
		likes: 3
	}

	await api
		.post('/api/blogs')
		.set('Authorization', token)
		.send(newBlog)
		.expect(400)

})

test('succeeds with status code 204 if id is valid', async () => {
	const blogsAtStart = await helper.blogsInDb()
	const blogToDelete = blogsAtStart[0]

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', token)
		.expect(204)
	const blogsAtEnd = await helper.blogsInDb()

	expect(blogsAtEnd).toHaveLength(
		helper.initialBlogs.length - 1
	)

	const titles = blogsAtEnd.map(r => r.title)

	expect(titles).not.toContain(blogToDelete.title)
})

test('update is working fine', async () => {
	const newBlog = {
		title: 'I will never be a memory',
		author: 'Sephiroth',
		url: 'http://cloud.aerithlives.com/zack-does-not.html',
		likes: 7,
	}

	await api
		.post('/api/blogs')
		.set('Authorization', token)
		.send(newBlog)	
	
	const blogsAfterPost = await helper.blogsInDb()
	expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)
	
	const updatedBlog = {
		title: 'I will never be a memory',
		author: 'Sephiroth',
		url: 'http://cloud.aerithlives.com/zack-does-not.html',
		likes: 9,
	}
	
	await api
		.put('/api/blogs')
		.set('Authorization', token)
		.send(updatedBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	
	console.log(blogsAtEnd)
	
	const new_blog = blogsAtEnd.filter(b => b.title === 'I will never be a memory')[0]
	expect(new_blog.title).toContain(newBlog.title)
	expect(new_blog.author).toContain(newBlog.author)
	expect(new_blog.url).toContain(newBlog.url)
	expect(new_blog.likes).toEqual(9)
})

test('code 401 if a token is not provided', async () => {
	const newBlog = {
		title: 'I will never be a memory',
		author: 'Sephiroth',
		url: 'http://cloud.aerithlives.com/zack-does-not.html',
		likes: 7
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(401)
		.expect('Content-Type', /application\/json/)
})

afterAll(() => {
	mongoose.connection.close()
})