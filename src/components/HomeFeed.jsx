import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);

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

  return (
    <div>
      <h1>Home Feed</h1>
      <Link to="/create">
        <button>Create Post</button>
      </Link>
      {posts.map(post => (
        <div key={post.id}>
          <Link to={`/post/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.created_at}</p>
          <p>{post.upvotes}</p>
          {/* Additional post details */}
        </div>
      ))}
    </div>
  );
};

export default HomeFeed;
