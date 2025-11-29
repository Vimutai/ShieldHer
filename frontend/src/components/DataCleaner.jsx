import React, { useState } from 'react';

function DataCleaner({ showSwahili }) {
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanType, setCleanType] = useState('all');

  const handleCleanData = async () => {
    if (!confirm(showSwahili 
      ? 'Una uhakika unataka kufuta data yote ya utafutaji? Hii haiwezi kutenduliwa.' 
      : 'Are you sure you want to delete all browsing data? This cannot be undone.'
    )) {
      return;
    }

    setIsCleaning(true);
    
    try {
      // Clear localStorage (your app data)
      localStorage.removeItem('hersheidEvidence');
      localStorage.removeItem('shieldHerAnalysis');
      localStorage.removeItem('userPreferences');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear IndexedDB if used
      if (window.indexedDB) {
        const databases = await window.indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      }
      
      // Clear cookies for your domain
      const domain = window.location.hostname;
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
      }
      
      // Show success message
      alert(showSwahili 
        ? '✅ Data yote imefutwa kikamilifu!' 
        : '✅ All data cleared successfully!'
      );
      
      // Reload the page to reset the app
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error cleaning data:', error);
      alert(showSwahili 
        ? '❌ Hitilafu katika kufuta data' 
        : '❌ Error clearing data'
      );
    } finally {
      setIsCleaning(false);
    }
  };

  const handleClearEvidenceOnly = () => {
    if (!confirm(showSwahili 
      ? 'Una uhakika unataka kufuta ushahidi wote?' 
      : 'Are you sure you want to delete all evidence?'
    )) {
      return;
    }

    // Clear only evidence data
    localStorage.removeItem('hersheidEvidence');
    localStorage.removeItem('shieldHerAnalysis');
    
    alert(showSwahili 
      ? '✅ Ushahidi umeftuliwa!' 
      : '✅ Evidence cleared!'
    );
    
    // Reload to reflect changes
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-red-200">
      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
        🗑️ {showSwahili ? 'Futa Data' : 'Clear Data'}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        {showSwahili 
          ? 'Futa data yote ya utafutaji na ushahidi kwa usalama'
          : 'Safely delete all browsing data and evidence'
        }
      </p>

      <div className="space-y-3">
        {/* Clear Evidence Only */}
        <button
          onClick={handleClearEvidenceOnly}
          className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          📋 {showSwahili ? 'Futa Ushahidi Tu' : 'Clear Evidence Only'}
        </button>

        {/* Clear All Data */}
        <button
          onClick={handleCleanData}
          disabled={isCleaning}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
            isCleaning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isCleaning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {showSwahili ? 'Inafuta...' : 'Cleaning...'}
            </>
          ) : (
            <>
              🗑️ {showSwahili ? 'Futa Data Yote' : 'Delete All Data'}
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-red-50 rounded-lg">
        <h4 className="font-semibold text-red-800 text-sm mb-2">
          ⚠️ {showSwahili ? 'Taarifa Muhimu' : 'Important Notice'}
        </h4>
        <ul className="text-xs text-red-700 space-y-1">
          <li>• {showSwahili ? 'Haiwezi kutenduliwa' : 'This cannot be undone'}</li>
          <li>• {showSwahili ? 'Ushahidi wote utapotea' : 'All evidence will be lost'}</li>
          <li>• {showSwahili ? 'Mipangilio itarejeshwa' : 'Settings will be reset'}</li>
          <li>• {showSwahili ? 'Programu itaanzwa upya' : 'App will restart'}</li>
        </ul>
      </div>
    </div>
  );
}

export default DataCleaner;