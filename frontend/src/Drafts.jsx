import { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Context from "./Context";
function Drafts() {
  const [posts, setPosts] = useState([]);
  const { userId } = useContext(Context);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/posts");
        const postData = res.data;
          console.log(postData)
          const draftsOnly = postData.filter(post => post.isDraft === true && post.author?._id === userId);
          setPosts(draftsOnly);

     
    }catch (err) {
        console.log("Failed to fetch Posts: " + err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {posts.map((post, index) => (
        <Link
          to={`/post/${post._id}`} 
          key={index}
          className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          {post.cover && (
            <img
              src={`http://localhost:3000/`+post.cover}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}

          <div className="p-4">
            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>

           
            <p className="text-sm text-gray-500 mb-2">
              {post.author?.userName ? `By ${post.author.userName} • ` : ""}
              {post.createdAt ? `Posted on ${new Date(post.createdAt).toLocaleString()}` : ""}
            </p>


            <div
              className="text-gray-700 text-sm line-clamp-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tagsString && (
              <div className="mt-2 flex flex-wrap gap-1">
                {post.tagsString.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Drafts;
