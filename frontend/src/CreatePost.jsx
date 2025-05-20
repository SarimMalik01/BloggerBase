import React, { useRef, useState,useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom"


export default function CreatePost() {
  const { id } = useParams();
  const[autosaved,setAutoSaved]=useState("");
  
  const editor = useRef(null);
  const navigate=useNavigate();
  const [content, setContent] = useState('');
  const [post, setPost] = useState({
    title: '',
    summary: '',
    file: null, 
    tags: '',
    content: '',
    isDraft:false
  });
  const [notification,setNotification]=useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const typingTimeoutRef = useRef(null);


  useEffect(()=>{
     

  const fetchPost = async () => {
   if(id==":id")
   {
      try{
      const res = await axios.get(`http://localhost:3000/cache`, {
  withCredentials: true
});

      const data = res.data;

    
      setPost({
        title: data.title || '',
        summary: data.summary || '',
        file: null,          
        tags: data.tagsString || '',
        content: data.content || ''
      });
      setContent(data.content || '');
      setTags(data.tagsString ? data.tagsString.split(",").map(tag => tag.trim()) : []);
      setTagInput('');
      return;
    }
   catch(err){
    console.log("error occured in cahing layer ",err)
   }
   }
   else{
try {
      const formData = new FormData();
       if (id) formData.append("id",id);
       const res = await axios.get(`http://localhost:3000/viewPost/${id}`, {
      withCredentials: true
      });

      const data = res.data;

    
      setPost({
        title: data.title || '',
        summary: data.summary || '',
        file: null,          
        tags: data.tagsString || '',
        content: data.content || ''
      });

     
      setContent(data.content || '');

     
      setTags(data.tagsString ? data.tagsString.split(",").map(tag => tag.trim()) : []);
      
     
      setTagInput('');

    } catch (err) {
      console.error("Failed to fetch post data:");
    }
     };
   }
    
    
    

  fetchPost();
  },[id]);

  useEffect(() => {
  
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setInterval(() => {
       handleAutoSaving();
    }, 45000); 
  }, []);





  const triggerAutosave = () => {
   
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
     
       handleAutoSaving();
    }, 5000); 
  };
  
    
  
  

  function handleAutoSaving(){
     console.log(post);
     const saveData=async()=>{
      try {
       const response = await axios.post ('http://localhost:3000/autoSave', post, {
         withCredentials: true
        });

     

      
      }catch(err){
      console.error("Failed to autosave post:");  
     }

    }
       setAutoSaved(`Autosaved at ${new Date().toLocaleTimeString()}`);
       console.log("Set autosaved time");
    saveData();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name+"  "+value)
    setPost(prev => ({ ...prev, [name]: value }));
    triggerAutosave();
  };
   

  const handleEditorChange = (newContent) => {
    setContent(newContent);
     setPost(prev => ({ ...prev, content: newContent }));
    triggerAutosave();
  };


  const handleFileChange = (e) => {
    setPost(prev => ({ ...prev, file: e.target.files[0] || null }));

  };

  const handleTagInputChange = (e) => {
    console.log(tags)
    setTagInput(e.target.value);
    setPost(prev => ({ ...prev, tags:e.target.value}));
    triggerAutosave();
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTags = tagInput.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !tags.includes(tag));
      
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

 const createNewPost = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  if (id) formData.append("id",id);
  const submitter = e.nativeEvent.submitter;
  const isDraft = submitter?.name === "draftbutton";
  
  formData.append("title", post.title);
  formData.append("summary", post.summary);
  if (post.file) formData.append("file", post.file,post.file.name);
  formData.append("content", content);
  formData.append("tags", JSON.stringify(tags));  
   formData.append("isDraft",isDraft);

  try {
    const res = await axios.post(
  "http://localhost:3000/createPost",
  formData,
  {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  }
);

    setNotification(res.message);
    setTimeout(()=>{
      setNotification(null)
      navigate("/");
    },4000)
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="flex justify-center items-start mt-10">
    {notification && (
     <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-3 rounded-md shadow-sm mb-4">
    <p className="text-sm font-medium">{notification}</p>
     </div>
    )}


      <form
        className="flex flex-col gap-4 w-full max-w-7xl p-6 border rounded-lg shadow-md bg-white"
        onSubmit={createNewPost}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border p-2 rounded"
          value={post.title}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="summary"
          placeholder="Summary"
          className="border p-2 rounded"
          value={post.summary}
          onChange={handleInputChange}
        />

        <input
          type="file"
          name="file"
          className="border p-2 rounded"
          onChange={handleFileChange}
        />

        <input
          type="text"
          placeholder="Tags (press Enter or comma to add)"
          className="border p-2 rounded"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagKeyDown}
        />

        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-200 text-blue-800 px-2 py-1 rounded cursor-pointer"
              onClick={() => removeTag(tag)}
              title="Click to remove tag"
            >
              {tag} &times;
            </span>
          ))}
        </div>

        <div className="border p-2 rounded min-h-[200px]">
          
          <JoditEditor
          
            ref={editor}
            value={content}
            onChange={handleEditorChange}
            
          />
        </div>
         <p className="mt-4 text-green-600">{autosaved}</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            name="publishButton"
          >
            Publish
          </button>
          <button
            type="submit"
            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
            name="draftbutton"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
