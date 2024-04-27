import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import "../App.css"

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*');
        if (error) {
          throw error;
        }
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    } else {
      return 0;
    }
  });

  const handleSortByDate = () => {
    setSortBy('date');
  };

  const handleSortByUpvotes = () => {
    setSortBy('upvotes');
  };

  return (
    <div>
      <h1>Home Feed</h1>
      <Link to="/create">
        <button>Create Post</button>
      </Link>
      <h3> posts:</h3>
      <input
        type="text"
        placeholder="Search posts by keyword..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button onClick={handleSortByDate}>Sort by Date</button>
      <button onClick={handleSortByUpvotes}>Sort by Upvotes</button>
      {sortedPosts.map(post => (
        <div className="post-container" key={post.id}>
          <Link to={`/post/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <div>
            <p>{post.created_at}</p>
            <p>upvotes: {post.upvotes}</p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default HomeFeed;
