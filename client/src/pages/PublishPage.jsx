import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

const PublishPage = () => {
  const {id} = useParams();
  const [projectId, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if(!id) return;

    const fetchPublicProject =async () => {
     try {
      const {data} = await api.get(`/api/projects/public/${id}`)
      setProject(data);
     } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project. Please try again later.");
     }finally {
      setLoading(false);
     }
    }
  },[id])
  return (
    <div>
      PublishPage
    </div>
  )
}

export default PublishPage
