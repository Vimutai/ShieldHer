import React, { useState, useEffect } from 'react';

function AutoMonitor({ showSwahili }) {
  const [detectedComments, setDetectedComments] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    checkForAutoDetectedComments();
    const interval = setInterval(checkForAutoDetectedComments, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkForAutoDetectedComments = () => {
    // Check if extension has auto-detected comments
    chrome.storage.local.get(['autoDetectedComments'], (result) => {
      if (result.autoDetectedComments) {
        setDetectedComments(result.autoDetectedComments);
      }
    });
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    // Tell extension to start auto-monitoring
    chrome.runtime.sendMessage({ action: 'startAutoMonitoring' });
  };

  const getRiskLevel = (score) => {
    if (score > 0.8) return { level: 'high', color: 'text-red-600', bg: 'bg-red-100' };
    if (score > 0.6) return { level: 'medium', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Controls */}
      <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {showSwahili ? 'Ufuatiliaji wa Mkono' : 'Auto-Monitoring'}
            </h2>
            <p className="text-gray-600 text-sm">
              {showSwahili 
                ? 'Hershield itagundua unyanyasaji kiotomatiki kwenye mitandao yako'
                : 'Hershield will automatically detect harassment on your social media'}
            </p>
          </div>
          
          <button
            onClick={startMonitoring}
            disabled={isMonitoring}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isMonitoring 
                ? 'bg-green-600 text-white' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isMonitoring ? '🔴 Monitoring...' : '🟢 Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Detected Comments */}
      {detectedComments.length > 0 && (
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {showSwahili ? 'Maoni Yaliyogunduliwa' : 'Detected Comments'} ({detectedComments.length})
          </h3>
          
          <div className="space-y-3">
            {detectedComments.map((comment, index) => {
              const risk = getRiskLevel(comment.harassmentScore);
              return (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${risk.bg} border-${risk.color.split('-')[1]}-500`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-800">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>👤 {comment.author}</span>
                        <span>📱 {comment.platform}</span>
                        <span className={`font-semibold ${risk.color}`}>
                          {risk.level.toUpperCase()} RISK ({Math.round(comment.harassmentScore * 100)}%)
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Comments State */}
      {detectedComments.length === 0 && isMonitoring && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">👀</div>
          <p>
            {showSwahili 
              ? 'Inatazama... Hakuna unyanyasaji umegunduliwa bado'
              : 'Watching... No harassment detected yet'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default AutoMonitor;