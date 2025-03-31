import React, { lazy, Suspense } from "react";
import "../styles/Tabs.css";

const tabs = [
  { key: "text", label: "Theory", component: lazy(() => import("../components/TextContent")) },
  { key: "video", label: "Video", component: lazy(() => import("../components/VideoContent")) },
  { key: "simulation", label: "Simulation", component: lazy(() => import("../components/SimulationEmbed")) },
  { key: "quiz", label: "Quiz", component: lazy(() => import("../components/QuizComponent")) },
  { key: "progress", label: "Progress", component: lazy(() => import("../components/ProgressTracker")) },
  { key: "games", label: "Games", component: lazy(() => import("../components/GameContent")) },
];

const Tabs = ({ activeTab, setActiveTab }) => {

  return (
    <>
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

    
    </>
  );
};

export default Tabs;

