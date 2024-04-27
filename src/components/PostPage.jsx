// PostPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import "../App.css"

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

    const handleUpvote = () => {
        // Increment the upvotes count locally
        const updatedPost = { ...post, upvotes: post.upvotes + 1 };
        setPost(updatedPost);

        // Send the upvote request to the server
        supabase
            .from('posts')
            .update({ upvotes: post.upvotes + 1 })
            .eq('id', postId)
            .then(response => {
                if (response.error) {
                    throw response.error;
                }
                // Optionally, you can handle success if needed
            })
            .catch(error => {
                console.error('Error upvoting post:', error.message);
                // Revert the local state back to the original value on error
                setPost(post);
            });
    };


    const handleDeletePost = async () => {
        try {
            await supabase.from('posts').delete().eq('id', postId);
            window.location = "/";
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    return (
        <div>
            <Link to="/">
                <button>Home Feed</button>
            </Link>
            <p>post page</p>
            {post ? (
                <div>
                    <div className='card'>
                        <h1>{post.title}</h1>
                        <p>date created: {post.created_at}</p>
                        <p>upvotes: {post.upvotes}</p>
                        <p>description: {post.content}</p>
                        <p>location: {post.location}</p>
                    </div>

                    <button onClick={handleUpvote}>Upvote</button>
                    <Link to={`/edit/${postId}`}>
                        <button>Edit</button>
                    </Link>
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
                    <div className="comment">
                        <li key={index}>
                            <p>{comment}</p>
                        </li>
                    </div>

                ))}
            </ul>
        </div>
    );
};

export default PostPage;
