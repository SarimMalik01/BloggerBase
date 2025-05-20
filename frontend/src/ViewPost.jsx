import { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import  Context  from "./Context";
import { useNavigate } from "react-router-dom";
function ViewPost() {
    const navigate=useNavigate();
  const { userId } = useContext(Context);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("inside useEffect");
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/viewPost/${id}`);
        console.log(res.data);
        
        setPost(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load the post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>No post found.</p>;
   

   const handleEditClick = () => {
    console.log("click occured")
    navigate(`/createPost/${id}`);
  };


  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {post.cover && (
        <img
          src={`http://localhost:3000/${post.cover.replace("\\", "/")}`}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
     <div className="flex justify-between items-center mb-2">
  <h1 className="text-3xl font-bold">{post.title}</h1>
  {userId && post.author?._id === userId && (
    <button
      onClick={handleEditClick}
      className="flex items-center gap-2 px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition"
    >
      <FaPen className="w-3 h-3" />
      Edit Post
    </button>
  )}
</div>


      <p className="text-sm text-gray-500 mb-4">
        {post.author?.userName && `By ${post.author.userName} • `}
        {post.createdAt && `Posted on ${new Date(post.createdAt).toLocaleString()}`}
      </p>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tagsString && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tagsString.split(",").map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

     
    </div>
  );
}

export default ViewPost;
