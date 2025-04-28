import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;

// TYPES
export interface Post {
  id: number;
  postId:number;
  store_id: string;
  image: string;
  productDescription: string;
  productName: string;
  productId: string;
  featureImage: string;
  store_name: string;
  created_at: string;
  vendorName: string;
  vendorProfile: string;
  caption?: string;
}

export interface Comment {
  id: number;
  postId: number;
  comment: string;
  created_at: string;
}

interface PostState {
  posts: Post[];
  likes: { [postId: number]: number };
  comments: { [postId: number]: Comment[] };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  likes: {},
  comments: {},
  status: 'idle',
  error: null,
};

// ASYNC THUNKS

// Fetch all posts
export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  'feed/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/getposts`);
      return response.data.posts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

// Fetch likes of a specific post
export const fetchLikes = createAsyncThunk<
  { postId: number; totalLikes: number },
  number,
  { rejectValue: string }
>('feed/fetchLikes', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE}/posts/${postId}/likes`);
    return { postId, totalLikes: response.data.totalLikes };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch likes');
  }
});

// Fetch comments of a specific post
export const fetchComments = createAsyncThunk<
  { postId: number; comments: Comment[] },
  number,
  { rejectValue: string }
>('feed/fetchComments', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE}/posts/${postId}/comments`);
    return { postId, comments: response.data.comments };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
  }
});

// Create new post
export const createPost = createAsyncThunk<
  void,
  {
    image: any;
    productDescription: any;
    productName: any;
    featureImage: any;
    store_name: any;
  },
  { rejectValue: string }
>('feed/createPost', async (postData, { rejectWithValue }) => {
  try {
    console.log(postData);
    await axios.post(`${API_BASE}/createpost`, postData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create post');
  }
});

// Toggle Like
export const toggleLike = createAsyncThunk<number, number, { rejectValue: string }>(
  'feed/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE}/posts/${postId}/addLike`);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

// Add Comment
export const addComment = createAsyncThunk<
  { postId: number; comment: Comment },
  { postId: number; commentText: string },
  { rejectValue: string }
>('feed/addComment', async ({ postId, commentText }, { rejectWithValue }) => {
  try {
    console.log(commentText)
    await axios.post(`${API_BASE}/posts/${postId}/comments`, { comment: commentText });
    return {
      postId,
      comment: {
        id: Date.now(), // Ideally get from backend
        postId,
        comment: commentText,
        created_at: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
  }
});

// SLICE
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch posts';
      })

      // Fetch Likes
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.likes[action.payload.postId] = action.payload.totalLikes;
      })

      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })

      // Create Post
      .addCase(createPost.fulfilled, (state) => {
        state.status = 'succeeded';
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const postId = action.payload;
        if (state.likes[postId]) {
          state.likes[postId] += 1;
        } else {
          state.likes[postId] = 1;
        }
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].unshift(comment);
      });
  },
});

export default postsSlice.reducer;
