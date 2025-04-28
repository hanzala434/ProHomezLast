import React, { useState } from 'react';
import styles from '../style/PostCard.module.css';
import avatar from '../assets/images/avatar.png'
interface Comment {
  id: number;
  comment: string;
  created_at: string;
}

interface Post {
  postId: number;
  image: string;
  productDescription: string;
  productName: string;
  store_name: string;
  vendorName: string;
  vendorProfile: string;
  featureImage?: string;
  totalLikes?: number;
  comments?: Comment[];
}

interface Props {
    post: Post;
    comments: Comment[];
    onLike: (postId: number) => void;
    onAddComment: (postId: number, comment: string) => void;
    onShowAllComments: () => void;
  }
  

  const PostCard: React.FC<Props> = ({ post, comments, onLike, onAddComment, onShowAllComments }) => {
    const [commentInput, setCommentInput] = useState('');
  const backendURL = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;
  const [showAllComments, setShowAllComments] = useState(false);



  return (
    <div className={styles.card}>
      <div className={styles.header}>
      <img  src={`${backendURL}/images/${post.image}`} alt="Vendor" className={styles.profile} />
      <div>
          <h4>{post.vendorName}</h4>
          <span className={styles.store}>{post.store_name}</span>
        </div>
      </div>

      <div className={styles.caption}>
        <p>{post.productDescription}</p>
      </div>

      <div className={styles.imageContainer}>
      <img  src={`${backendURL}/images/${post.featureImage}`} alt="Post" />

      </div>

      <div className={styles.actions}>
        <button onClick={() => onLike(post.postId)}>❤️ Like</button>
        <span className={styles.likes}>{post.totalLikes} likes</span>
      </div>

      <div className={styles.comments}>
        {post.comments?.map((c,index) => (
          <p key={c.id ?? index}>
            <strong>Comment:</strong> {c.comment}
          </p>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddComment(post.postId, commentInput);
          setCommentInput('');
        }}
        className={styles.commentForm}
      >
        <input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Post</button>
      </form>
      <div className={styles.comments}>
      <div className={styles.comments}>
  {(showAllComments ? comments : comments.slice(0, 2)).map((c, index) => (
    <div key={c.id || index} className={styles.commentItem}>
      <img src={avatar} alt="Anonymous" className={styles.commentAvatar} />
      <div className={styles.commentContent}>
        <strong className={styles.name}>Anonymous</strong>
        <p>{c.comment}</p>
      </div>
    </div>
  ))}

  {comments.length > 2 && !showAllComments && (
    <button className={styles.showAllBtn} onClick={() => {
      setShowAllComments(true);
      onShowAllComments();
    }}>
      Show All Comments
    </button>
  )}
</div>


</div>


    </div>
  );
};

export default PostCard;
