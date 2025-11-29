// EvidenceCollector.jsx
import React, { useState } from 'react';
import { analyzeEvidence } from '../services/api'; // Make sure this path is correct

function EvidenceCollector({ showSwahili, onAnalysisComplete }) {
  const [logData, setLogData] = useState([
    { source: 'twitter', count: 3, timestamp: '07:47:24' },
    { source: 'twitter', count: 3, timestamp: '08:07:48' },
    { source: 'unknown', count: 1, timestamp: '09:16:08' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeEvidence = async () => {
    setIsAnalyzing(true);
    try {
      console.log('Analyzing evidence:', logData);
      
      // Call your Flask backend
      const analysisResult = await analyzeEvidence(logData);
      
      console.log('Analysis completed:', analysisResult);
      
      // Pass results to parent component or navigate
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(showSwahili ? 'Hitilafu katika kuchambua' : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addNewEntry = () => {
    setLogData([...logData, { source: 'twitter', count: 1, timestamp: new Date().toLocaleTimeString() }]);
  };

  const updateEntry = (index, field, value) => {
    const updatedData = [...logData];
    updatedData[index][field] = value;
    setLogData(updatedData);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {showSwahili ? 'Kusanya Ushahidi' : 'Collect Evidence'}
      </h2>
      
      {/* Evidence Log Display */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            {showSwahili ? 'Logi ya Matukio' : 'Event Log'}
          </h3>
          <button
            onClick={addNewEntry}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + {showSwahili ? 'Ongeza' : 'Add'}
          </button>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {logData.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <select 
                value={entry.source}
                onChange={(e) => updateEntry(index, 'source', e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="unknown">Unknown</option>
              </select>
              
              <input
                type="number"
                value={entry.count}
                onChange={(e) => updateEntry(index, 'count', parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 border rounded text-sm"
                min="1"
              />
              
              <span className="text-sm text-gray-600">
                {showSwahili ? 'maoni' : 'comments'}
              </span>
              
              <input
                type="text"
                value={entry.timestamp}
                onChange={(e) => updateEntry(index, 'timestamp', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
                placeholder="HH:MM:SS"
              />
              
              <button
                onClick={() => setLogData(logData.filter((_, i) => i !== index))}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          {showSwahili ? 'Muhtasari wa Ushahidi' : 'Evidence Summary'}
        </h4>
        <p className="text-blue-700">
          {showSwahili 
            ? `Jumla: ${logData.reduce((sum, entry) => sum + entry.count, 0)} maoni kutoka kwa vyanzo ${new Set(logData.map(entry => entry.source)).size}`
            : `Total: ${logData.reduce((sum, entry) => sum + entry.count, 0)} comments from ${new Set(logData.map(entry => entry.source)).size} sources`
          }
        </p>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyzeEvidence}
        disabled={isAnalyzing || logData.length === 0}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
          isAnalyzing || logData.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            {showSwahili ? 'Inachambua...' : 'Analyzing...'}
          </>
        ) : (
          <>
            🔍 {showSwahili ? 'Chambua Ushahidi' : 'Analyze Evidence'}
          </>
        )}
      </button>
      
      {logData.length === 0 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          {showSwahili 
            ? 'Ongeza angalau kitu kimoja kwenye logi ili kuchambua'
            : 'Add at least one entry to the log to analyze'
          }
        </p>
      )}
    </div>
  );
}

export default EvidenceCollector;