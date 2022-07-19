function groupBy(list, keyGetter) {
	const map = new Map()
	list.forEach((item) => {
		const key = item[keyGetter]
		const collection = map.get(key)
		if (!collection) {
			map.set(key, [item])
		} else {
			collection.push(item)
		}
	})
	return map
}

function removeDuplicates(objArray){
	var dataArr = objArray.map(item => {
		return [item.name,item]
	}) // creates array of array
	var maparr = new Map(dataArr) // create key value pair from array of array
	var result = [...maparr.values()]//converting back to array from mapobject
	return result
}

const dummy = (blogs) => {
	// ...
	return 1
}

const totalLikes = (blogs) => {
	const likes = blogs.map(blog => blog.likes)
	
	const reducer = (sum, item) => {
		return sum + item
	}

	return likes.length === 0
		? 0
		: likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	const likes = blogs.map(blog => blog.likes)
	const max_likes = Math.max(...likes)

	const favorites = blogs.length === 0
		? 0
		: blogs.filter(blog => blog.likes === max_likes)
	
	const favorites_map = favorites.map(blog => b =
		{
			author: blog.author,
			likes: blog.likes,
			title: blog.title
		}
	)

	for (let i = 0; i < favorites_map.length; i++) {
		return favorites_map[i]
	}

}

const favoriteAuthor = (blogs) => {
	const authors = blogs.map(blog => blog.author)
	const blogs_grouped_by_author = groupBy(blogs, 'author')
	
	const author_blogs = authors.map(author => a = {
		author: author,
		blogs: blogs_grouped_by_author.get(author).length
	}
	)
	
	const author_blogs_unique = removeDuplicates(author_blogs)
	
	const author_blog_count = author_blogs_unique.length === 0
		? 0
		: author_blogs_unique.map(count => count.blogs)
	
	const max_author = Math.max(...author_blog_count)

	const most_prod_authors = author_blogs_unique.length === 0
		? 0
		: author_blogs_unique.filter(author => author.blogs === max_author)

	for (let i = 0; i < most_prod_authors.length; i++) {
		return most_prod_authors[i]
	}
}

const mostLikes = (blogs) => {
	const authors = blogs.map(blog => blog.author)
	const author_likes = blogs.map(blog => a = {
		author: blog.author,
		likes: blog.likes
	}
	)
	
	const author_likes_map = new Map()
	
	for (i=0;i<author_likes.length;i++){
		const key = author_likes[i].author
		const likes = author_likes[i].likes
		const collection = author_likes_map.get(key)
		if(!collection){
			author_likes_map.set(key, likes)
		}else{
			author_likes_map.set(key, author_likes_map.get(key) + likes)
		}
	}
	
	const author_likes_array = [...author_likes_map]
	
	const author_likes_set = new Set()
	
	author_likes_array.forEach((item) => {
		const b = {
			author: item[0],
			likes: item[1]
		}
		author_likes_set.add(b)
	})	
	
	const author_likes_list = Array.from(author_likes_set)	
	
	const author_likes_count = author_likes_list.length === 0
		? 0
		: author_likes_list.map(count => count.likes)
	
	const max_likes_author = Math.max(...author_likes_count)

	const most_liked_authors = author_likes_list.length === 0
		? 0
		: author_likes_list.filter(author => author.likes === max_likes_author)

	for (let i = 0; i < most_liked_authors.length; i++) {
		return most_liked_authors[i]
	}
}

module.exports = {
	dummy, totalLikes, favoriteBlog, favoriteAuthor, mostLikes
}