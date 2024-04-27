// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePostForm from './components/CreatePostForm';
import HomeFeed from './components/HomeFeed';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePostForm />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/edit/:postId" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
