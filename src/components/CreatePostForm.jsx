import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Insert new post into Supabase
      const { data, error } = await supabase.from('posts').insert({
        title,
        content,
        location
      });

      if (error) {
        throw error;
      }

      // Reset form fields after successful submission
      setTitle('');
      setContent('');
      setLocation('');

      // Handle success or navigate to another page
      console.log('Post created successfully:', data);
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button type="submit">Create Post</button>
      <Link to="/">
      <button>Go to Homefeed</button>
      </Link>
    </form>
  );
};

export default CreatePostForm;
