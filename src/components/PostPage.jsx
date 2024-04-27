// PostPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';

const PostPage = () => {
    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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

                const comments = postData.comments || [];
                postData.comments = comments;

                setPost(postData);
                setComments(comments);
            } catch (error) {
                console.error('Error fetching post:', error.message);
            }
        };

        fetchPost();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            // Fetch existing comments for the post
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('comments')
                .eq('id', postId)
                .single();

            if (postError) {
                throw postError;
            }

            const existingComments = postData.comments || [];

            // Append the new comment to the existing comments array
            const updatedComments = [...existingComments, newComment];

            // Update the post in the database with the updated comments array
            const { error: updateError } = await supabase
                .from('posts')
                .update({ comments: updatedComments })
                .eq('id', postId);

            if (updateError) {
                throw updateError;
            }

            // Update the local state with the updated comments array
            setComments(updatedComments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error.message);
        }
    };




    const handleUpvote = async () => {
        try {
            const { data: updatedPostData, error: upvoteError } = await supabase
                .from('posts')
                .update({ upvotes: post.upvotes + 1 })
                .eq('id', postId)
                .single();

            if (upvoteError) {
                throw upvoteError;
            }

            // Update the local state with the updated post data
            setPost(updatedPostData);
        } catch (error) {
            console.error('Error upvoting post:', error.message);
        }
    };

    const handleDeletePost = async () => {
        try {
            await supabase.from('posts').delete().eq('id', postId);
            window.location.reload(); // Refresh the page after deletion
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    const handleEditPost = async () => {
        // implement logic
    };

    return (
        <div>
            <p>post page</p>
            {post ? (
                <div>
                    <h1>{post.title}</h1>
                    <p>date created: {post.created_at}</p>
                    <p>upvotes: {post.upvotes}</p>
                    <p>description: {post.content}</p>
                    {/* {post.content && <p>{post.content}</p>}
          {post.image_url && <img src={post.image_url} alt="Post" />} */}
                    <button onClick={handleUpvote}>Upvote</button>
                    <button onClick={handleEditPost}>Edit</button>
                    <button onClick={handleDeletePost}>Delete</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit}>
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <button type="submit">Add Comment</button>
            </form>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                        <p>{comment}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostPage;
