
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";




const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  const navigate = useNavigate();

  // Auth State
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [loadingActiveProject, setLoadingActiveProject] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [generatingProject, setGeneratingProject] = useState(false);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [showCode, setShowCode] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);

  // Auth Actions
  const checkSession = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      const errorMsg =
        error?.response?.data?.error || "Invalid email or password";

      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setUser(data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);

      const errorMsg =
        error?.response?.data?.error || "Registration failed";

      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");

      setUser(null);
      setProjects([]);
      setActiveProject(null);
      setActiveFile(null);
      setChatLoading(false);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  // Projects Actions
  const loadProjects = useCallback(async () => {
    if (!user) {
      setLoadingProjects(false);
      return;
    }

    setLoadingProjects(true);

    try {
      const { data } = await api.get("/api/projects");
      setProjects(data);
    } catch (error) {
      console.error("Failed to list projects", error);
      toast.error("Failed to load projects list");
    } finally {
      setLoadingProjects(false);
    }
  }, [user]);

  const loadProject = useCallback(
    async (id, silent = false) => {
      if (!user) return;

      if (!silent) {
        setLoadingActiveProject(true);
      }

      try {
        const { data } = await api.get(`/api/projects/${id}`);

        setActiveProject(data);

        // Default file selection
        const files = Object.keys(data.files || {});

        if (files.length > 0) {
          setActiveFile((prev) => {
            if (files.includes(prev)) return prev;
            if (files.includes("/App.js")) return "/App.js";
            return files[0];
          });
        }
      } catch (error) {
        console.error("Failed to load project:", error);

        if (!silent) {
          toast.error("Failed to load project details");
          navigate("/");
        }
      } finally {
        if (!silent) {
          setLoadingActiveProject(false);
        }
      }
    },
    [user, navigate]
  );

  // Automatically poll active project status
  // if generating or pending
  useEffect(() => {
    if (!activeProject?._id || !user) {
      setChatLoading(false);
      return;
    }

    const isOngoing = [
      "generating",
      "pending",
      "revising",
    ].includes(activeProject.status);

    if (!isOngoing) {
      setChatLoading(false);
      return;
    }

    setChatLoading(true);

    const interval = setInterval(() => {
      loadProject(activeProject._id, true);
    }, 2000);

    return () => clearInterval(interval);
  }, [
    activeProject?._id,
    activeProject?.status,
    loadProject,
    user,
  ]);

  // Generate Project
  const handleGenerate = useCallback(
    async (prompt) => {
      if (!user) return;

      setGeneratingProject(true);

      try {
        const { data } = await api.post("/api/projects", {
          prompt,
        });

        toast.success("AI Agent is planning structure...");
        navigate(`/builder/${data._id}`);
      } catch (error) {
        console.error("Failed to generate project", error);

        toast.error(
          error?.response?.data?.error ||
            "Failed to generate project"
        );
      } finally {
        setGeneratingProject(false);
      }
    },
    [navigate, user]
  );

  // Delete Project
  const handleDelete = useCallback(
    async (id) => {
      if (!user) return;

      try {
        await api.delete(`/api/projects/${id}`);

        setProjects((prev) =>
          prev.filter((project) => project._id !== id)
        );

        if (activeProject?._id === id) {
          setActiveProject(null);
          setActiveFile(null);
        }

        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Failed to delete project", error);
        toast.error("Failed to delete project");
      }
    },
    [user, activeProject?._id]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loadingUser,
        setLoadingUser,

        login,
        register,
        logout,
        checkSession,

        projects,
        loadProjects,
        loadingProjects,

        loadProject,
        activeProject,
        loadingActiveProject,

        chatLoading,
        generatingProject,
        activeFile,
        setActiveFile,

        showCode,
        setShowCode,

        loadingProject,
        setLoadingProject,

        handleGenerate,
        handleDelete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      "useAppContext must be used within an AppContextProvider"
    );
  }

  return context;
}