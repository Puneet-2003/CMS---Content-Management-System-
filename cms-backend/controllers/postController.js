const { Post, User } = require('../models');
const slugify = require('slugify');

const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'en'
  }) + '-' + Date.now();
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const slug = generateSlug(title);

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      userId: req.user.id
    });

    const newPost = await Post.findByPk(post.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    let slug = post.slug;
    if (title && title !== post.title) {
      slug = generateSlug(title);
    }

    await post.update({
      title: title || post.title,
      content: content || post.content,
      excerpt: excerpt || post.excerpt,
      slug
    });

    const updatedPost = await Post.findByPk(post.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

const togglePublish = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const published = !post.published;
    await post.update({
      published,
      publishedAt: published ? new Date() : null
    });

    res.json({ published });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle publish status' });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  togglePublish
};