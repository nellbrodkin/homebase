// EditPost.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';

const EditPost = () => {
    const { postId } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data: postData, error: postError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (postError) {
                    throw postError;
                }

                setTitle(postData.title);
                setContent(postData.content);
                setLocation(postData.location);
            } catch (error) {
                console.error('Error fetching post:', error.message);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Update post in Supabase
            const { error } = await supabase
                .from('posts')
                .update({
                    title,
                    content,
                    location
                })
                .eq('id', postId);
    
            if (error) {
                throw error;
            }
    
            // Redirect user to the post page after successful update
            window.location.href = `/post/${postId}`;
        } catch (error) {
            console.error('Error updating post:', error.message);
        }
    };

    return (
        <div>
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPost;
