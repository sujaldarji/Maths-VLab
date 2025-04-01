import { useState, lazy, Suspense, useEffect } from "react";
import "../styles/studyPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

// Lazy-load each content component
const Tabs = lazy(() => import("../components/Tabs"));
const TextContent = lazy(() => import("../components/TextContent"));
const VideoContent = lazy(() => import("../components/VideoContent"));
const SimulationEmbed = lazy(() => import("../components/SimulationEmbed"));
const QuizComponent = lazy(() => import("../components/QuizComponent"));
const ProgressTracker = lazy(() => import("../components/ProgressTracker"));

const StudyPage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Minimal fetch: get topic data and store section references
  const [topicRefs, setTopicRefs] = useState(null);
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        // Extract topicId from query params or location.state as needed.
        // For now, using a default topic id.
        // const topicId = "default-topic-id";
        const searchParams = new URLSearchParams(window.location.search);
        const topicId = searchParams.get("id") || location.state?.topicId || "default-topic-id";
    
        console.log("📌 Extracted topicId:", topicId); // Debugging log
        const response = await axiosInstance.get(`/api/topics/${topicId}`);
        // Assume response.data.section is structured as:
        // { text: ObjectId, video: ObjectId, simulation: ObjectId, quiz: ObjectId, game: ObjectId }
        setTopicRefs(response.data.section);
      } catch (error) {
        console.error("Error fetching topic data", error);
      }
    };

    fetchTopicData();
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get("/api/userRoutes/success");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Auth Error:", error.response?.data || error);
        navigate("/signin");
      }
    };

    fetchProtectedData();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("text"); // Default: "text" (Theory)

  // Render content based on active tab, passing the corresponding refId as a prop
  const renderContent = () => {
    switch (activeTab) {
      case "text":
        return <TextContent refId={topicRefs ? topicRefs.text : null} />;
      case "video":
        return <VideoContent refId={topicRefs ? topicRefs.video : null} />;
      case "simulation":
        return <SimulationEmbed refId={topicRefs ? topicRefs.simulation : null} />;
      case "quiz":
        return <QuizComponent refId={topicRefs ? topicRefs.quiz : null} />;
      case "progress":
        return <ProgressTracker refId={topicRefs ? topicRefs.progress : null} />;
      default:
        return <TextContent refId={topicRefs ? topicRefs.text : null} />;
    }
  };

  return (
    <div className="study-page-wrapper">
      <Suspense fallback={<div>Loading Tabs...</div>}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </Suspense>

      <div className="study-page-content">
        <Suspense fallback={<div>Loading Content...</div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};

export default StudyPage;