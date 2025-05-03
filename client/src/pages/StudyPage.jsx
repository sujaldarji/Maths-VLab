import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTopicData } from '../api/axiosInstance';
import { FaSpinner, FaBook, FaPlay, FaFlask, FaQuestionCircle } from 'react-icons/fa';
import '../styles/studyPage.css';

// Lazy-loaded components
const VideoPlayer = lazy(() => import('../components/VideoPlayer'));
const TextContent = lazy(() => import('../components/TextContent'));
const QuizComponent = lazy(() => import('../components/QuizComponent'));
const SimulationEmbed = lazy(() => import('../components/Simulation'));

const StudyPage = () => {
  const { topicId } = useParams();
  const [activeTab, setActiveTab] = useState('video');

  const { data, isLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => fetchTopicData(topicId),
    staleTime: 1000 * 60 * 5 // 5 minute cache
  });

  const renderTabContent = () => {
    if (!data) return null;

    return (
      <div className="tab-content">
        {activeTab === 'video' && data.video && (
          <Suspense fallback={<div className="loader">Loading video...</div>}>
            <VideoPlayer url={data.video} title={data.title} />
          </Suspense>
        )}
        
        {activeTab === 'material' && data.text && (
          <Suspense fallback={<div className="loader">Loading material...</div>}>
            <TextContent text={data.text} />
          </Suspense>
        )}
        
        {activeTab === 'simulation' && (
          <Suspense fallback={<div className="loader">Loading simulation...</div>}>
            <SimulationEmbed simulationId={data.simulationId} />
          </Suspense>
        )}
        
        {activeTab === 'quiz' && data.quiz?.length > 0 && (
          <Suspense fallback={<div className="loader">Loading quiz...</div>}>
            <QuizComponent questions={data.quiz} />
          </Suspense>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <FaSpinner className="spinner" />
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="study-container">
      {/* Centered Tabs */}
      <div className="tabs-wrapper">
        <div className="tabs">
          {data?.video && (
            <button
              className={`tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <FaPlay className="tab-icon" /> Video
            </button>
          )}
          
          {data?.text && (
            <button
              className={`tab ${activeTab === 'material' ? 'active' : ''}`}
              onClick={() => setActiveTab('material')}
            >
              <FaBook className="tab-icon" /> Material
            </button>
          )}
          
          <button
            className={`tab ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <FaFlask className="tab-icon" /> Simulation
          </button>
          
          {data?.quiz?.length > 0 && (
            <button
              className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <FaQuestionCircle className="tab-icon" /> Quiz
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="content">
        <header>
          <h1>{data?.title}</h1>
          <p className="description">{data?.description}</p>
        </header>
        
        {renderTabContent()}
      </main>
    </div>
  );
};

export default StudyPage;