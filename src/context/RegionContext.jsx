import React, { createContext, useContext, useState, useEffect } from 'react';
import { ghanaConfig, usConfig, allConfigs } from '../config/siteConfig';

const STORAGE_KEY = 'beacon_region';

function detectDefaultRegion() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && allConfigs[saved]) return saved;
  // Detect by browser locale: en-US → us, everything else → gh
  const lang = navigator.language || '';
  return lang.toLowerCase().includes('en-us') ? 'us' : 'gh';
}

const RegionContext = createContext(null);

export const RegionProvider = ({ children }) => {
  const [regionKey, setRegionKey] = useState(detectDefaultRegion);
  const config = allConfigs[regionKey] ?? ghanaConfig;

  const switchRegion = (key) => {
    if (!allConfigs[key]) return;
    localStorage.setItem(STORAGE_KEY, key);
    setRegionKey(key);
  };

  return (
    <RegionContext.Provider value={{ config, regionKey, switchRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);
