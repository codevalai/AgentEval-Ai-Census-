// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  Globe2,
  Server,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Info,
  MapPin,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_REGIONS } from '../data/initialData.ts';
import { RegionalNode } from '../types/census.ts';

interface PlanetaryRegionalMapProps {
  theme: 'worldometers' | 'sovereign';
}

// Map geographical coordinates to our top planetary megasite regional nodes
export const REGIONAL_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'tokyo-prim': { lat: 35.6895, lng: 139.6917 }, // Tokyo, Japan
  'us-virginia': { lat: 39.0438, lng: -77.4874 }, // Ashburn, VA (Northern VA Megasite)
  'zurich-alpine': { lat: 47.3769, lng: 8.5417 }, // Zurich, Switzerland
  'singapore-equator': { lat: 1.3521, lng: 103.8198 }, // Singapore
  'reykjavik-geo': { lat: 64.1466, lng: -21.9426 }, // Reykjavik, Iceland
  'us-central': { lat: 41.2619, lng: -95.8608 }, // Council Bluffs, Iowa
  'eu-belgium': { lat: 50.4542, lng: 3.8236 }, // St. Ghislain, Belgium
  'eu-frankfurt': { lat: 50.1109, lng: 8.6821 }, // Frankfurt, Germany
  'asia-taiwan': { lat: 24.0518, lng: 120.5161 }, // Changhua / Taipei, Taiwan
  'eu-finland': { lat: 60.5693, lng: 27.1978 }, // Hamina, Finland
  'us-oregon': { lat: 45.5946, lng: -121.1787 }, // The Dalles, Oregon
  'au-sydney': { lat: -33.8688, lng: 151.2093 }, // Sydney, Australia
  'sa-brazil': { lat: -23.5505, lng: -46.6333 }, // Sao Paulo, Brazil
  'in-mumbai': { lat: 19.0760, lng: 72.8777 }, // Mumbai, India
  'ca-montreal': { lat: 45.5017, lng: -73.5673 }, // Montreal, Canada
  'uk-london': { lat: 51.5074, lng: -0.1278 }, // London, UK
  'nl-eemshaven': { lat: 53.4357, lng: 6.8378 }, // Eemshaven, Netherlands
  'kr-seoul': { lat: 37.5665, lng: 126.9780 }, // Seoul, South Korea
  'cl-santiago': { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
  'za-johannesburg': { lat: -26.2041, lng: 28.0473 }, // Johannesburg, South Africa
};

// Valid Google Cloud API keys start with 'AIza' and are approximately 39 characters
export const isValidGoogleMapsKey = (key: string): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.startsWith('AIza') && trimmed.length >= 25;
};

// React Error Boundary to catch any unexpected Maps rendering errors
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class GoogleMapsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Google Maps component error caught gracefully:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const DEFAULT_MAP_CENTER = { lat: 28, lng: 15 };
const GMP_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

export const PlanetaryRegionalMap: React.FC<PlanetaryRegionalMapProps> = React.memo(({ theme }) => {
  const isLight = theme === 'worldometers';

  // Key management: check localStorage first, then environment variable
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const [apiKey, setApiKey] = useState<string>(() => {
    const saved = localStorage.getItem('custom_google_maps_api_key');
    if (saved && isValidGoogleMapsKey(saved)) return saved;
    if (isValidGoogleMapsKey(envKey)) return envKey;
    return '';
  });

  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const [keyNotice, setKeyNotice] = useState<string | null>(null);

  const [selectedNode, setSelectedNode] = useState<RegionalNode | null>(null);
  const [filterTier, setFilterTier] = useState<'ALL' | 'APEX' | 'OPTIMAL'>('ALL');
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Intercept Google Maps authentication failures to prevent unhandled script crashes
  useEffect(() => {
    const handleAuthFailure = () => {
      console.warn('Google Maps authentication failure (InvalidKeyMapError or key unauthorized).');
      setAuthError(true);
      setKeyNotice('Google Maps API key was rejected by Google servers (InvalidKeyMapError). Please check key restrictions.');
    };

    // Attach to window.gm_authFailure which Google Maps calls on invalid key
    (window as any).gm_authFailure = handleAuthFailure;

    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);

    // Suppress window script error bubbling from invalid Google Maps keys
    const handleWindowError = (event: ErrorEvent) => {
      if (
        event.message?.includes('Google Maps') ||
        event.message?.includes('InvalidKeyMapError') ||
        event.filename?.includes('maps.googleapis.com')
      ) {
        event.preventDefault();
        setAuthError(true);
      }
    };
    window.addEventListener('error', handleWindowError);

    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  const handleApplyKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setApiKey('');
      localStorage.removeItem('custom_google_maps_api_key');
      setAuthError(false);
      setKeyNotice('API Key removed. Displaying native Planetary Vector Mesh.');
      return;
    }

    if (!trimmed.startsWith('AIza')) {
      setKeyNotice("Invalid key format: Google Cloud API keys must begin with 'AIza...'.");
      return;
    }

    localStorage.setItem('custom_google_maps_api_key', trimmed);
    setApiKey(trimmed);
    setAuthError(false);
    setKeyNotice('Custom Google Maps API key applied.');
    setShowKeyInput(false);
  };

  const displayedNodes = INITIAL_REGIONS.filter((node) => {
    if (filterTier === 'APEX') return node.apexNodes >= 500;
    if (filterTier === 'OPTIMAL') return node.health === 'OPTIMAL';
    return true;
  });

  const isMapsActive = Boolean(apiKey && isValidGoogleMapsKey(apiKey) && !authError);

  return (
    <section className={`rounded-xl border transition-all ${
      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/80 border-slate-800 text-slate-100 backdrop-blur-md'
    } p-6 mb-8`}>
      {/* Quota Exceeded Notification Bar */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm mb-4 rounded-lg">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5 mb-6 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Planetary Megasites Geospatial Mesh
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${
                  isMapsActive
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {isMapsActive ? 'Google Maps Platform Active' : 'Planetary Vector Mesh'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time telemetry across the 20 planetary AI megasites, compute clusters, and BFT quorum distribution
              </p>
            </div>
          </div>
        </div>

        {/* Filter & API Key Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterTier('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              filterTier === 'ALL'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All 20 Nodes
          </button>
          <button
            onClick={() => setFilterTier('APEX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              filterTier === 'APEX'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Apex (≥500)
          </button>
          <button
            onClick={() => setFilterTier('OPTIMAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              filterTier === 'OPTIMAL'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Optimal
          </button>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
            title="Configure Google Maps API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isMapsActive ? 'Key Active' : 'API Key'}</span>
          </button>
        </div>
      </div>

      {/* Key Input Modal / Drawer */}
      {showKeyInput && (
        <form onSubmit={handleApplyKey} className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Key className="w-4 h-4 text-blue-500" />
              <span>Google Maps Platform API Key Configuration</span>
            </div>
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 font-mono"
            >
              <span>Get API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Google Cloud Maps API keys start with <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">AIza...</code>.
            Ensure the <strong>Maps JavaScript API</strong> is enabled on your Google Cloud project.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Apply Key
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setInputKey('');
                    setApiKey('');
                    localStorage.removeItem('custom_google_maps_api_key');
                    setAuthError(false);
                    setKeyNotice('Switched to Planetary Vector Mesh.');
                  }}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Notice Banner */}
      {keyNotice && (
        <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono flex items-center justify-between text-blue-600 dark:text-blue-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{keyNotice}</span>
          </div>
          <button onClick={() => setKeyNotice(null)} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Map View Area */}
      <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-inner bg-slate-950">
        {isMapsActive ? (
          <GoogleMapsErrorBoundary
            onError={() => setAuthError(true)}
            fallback={
              <VectorMeshView
                nodes={displayedNodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
              />
            }
          >
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={DEFAULT_MAP_CENTER}
                defaultZoom={2}
                minZoom={2}
                maxZoom={12}
                mapId="planetary_agentic_mesh_map"
                gestureHandling="cooperative"
                disableDefaultUI={false}
                internalUsageAttributionIds={GMP_ATTRIBUTION_IDS}
                className="w-full h-full"
              >
                {displayedNodes.map((node) => {
                  const coords = REGIONAL_COORDINATES[node.id];
                  if (!coords) return null;

                  const isApex = node.apexNodes >= 500;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <AdvancedMarker
                      key={node.id}
                      position={coords}
                      onClick={() => setSelectedNode(node)}
                      title={`${node.name} (${node.city}, ${node.country})`}
                    >
                      <Pin
                        background={isApex ? '#f59e0b' : '#3b82f6'}
                        glyphColor="#ffffff"
                        borderColor={isSelected ? '#ffffff' : isApex ? '#b45309' : '#1d4ed8'}
                        scale={isSelected ? 1.3 : isApex ? 1.15 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {selectedNode && REGIONAL_COORDINATES[selectedNode.id] && (
                  <InfoWindow
                    position={REGIONAL_COORDINATES[selectedNode.id]}
                    onCloseClick={() => setSelectedNode(null)}
                  >
                    <div className="p-2 max-w-xs text-slate-900">
                      <div className="flex items-center gap-1.5 mb-1 font-bold text-xs text-blue-700">
                        <Server className="w-3.5 h-3.5" />
                        <span>{selectedNode.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mb-2 font-mono">
                        {selectedNode.city}, {selectedNode.country} • {selectedNode.regionCode}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono border-t pt-2 border-slate-200">
                        <div>
                          <span className="text-slate-500 block">Total Agents:</span>
                          <span className="font-semibold text-slate-800">
                            {Number(selectedNode.totalAgents).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">BFT Weight:</span>
                          <span className="font-semibold text-emerald-600">
                            {selectedNode.bftWeight}% Quorum
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Latency:</span>
                          <span className="font-semibold text-slate-800">
                            {selectedNode.latencyMs} ms
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Apex Clusters:</span>
                          <span className="font-semibold text-amber-600">
                            {selectedNode.apexNodes.toLocaleString()} nodes
                          </span>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </GoogleMapsErrorBoundary>
        ) : (
          <VectorMeshView
            nodes={displayedNodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        )}

        {/* Live Mesh Status HUD Badge */}
        <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Active Megasites: {displayedNodes.length} / 20</span>
          <span className="text-slate-500">|</span>
          <span className="text-[10px] text-emerald-400">BFT Quorum 100% Sat</span>
        </div>
      </div>

      {/* Selected Node Details Bar */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 font-bold">
                RANK #{selectedNode.rank}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {selectedNode.name}
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({selectedNode.city}, {selectedNode.country})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-slate-600 dark:text-slate-300">
              <div>Agents: <strong className="text-slate-900 dark:text-white">{Number(selectedNode.totalAgents).toLocaleString()}</strong></div>
              <div>BFT Weight: <strong className="text-emerald-500">{selectedNode.bftWeight}%</strong></div>
              <div>Latency: <strong className="text-slate-900 dark:text-white">{selectedNode.latencyMs}ms</strong></div>
              <div>Apex Clusters: <strong className="text-amber-500">{selectedNode.apexNodes}</strong></div>
              <div>Health: <strong className="text-emerald-500">{selectedNode.health}</strong></div>
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of Key Regional Clusters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {INITIAL_REGIONS.slice(0, 4).map((node) => (
          <div
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedNode?.id === node.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>RANK #{node.rank}</span>
              <span className="text-emerald-500">{node.latencyMs}ms</span>
            </div>
            <div className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
              {node.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {node.city}, {node.country}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

// High-fidelity SVG Planetary Vector Mesh fallback
interface VectorMeshViewProps {
  nodes: RegionalNode[];
  selectedNode: RegionalNode | null;
  onSelectNode: (node: RegionalNode) => void;
}

const VectorMeshView: React.FC<VectorMeshViewProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
}) => {
  // SVG viewport dimensions
  const width = 1000;
  const height = 500;

  // Convert lat/lng to equirectangular SVG coordinate space
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // Connecting mesh paths between key planetary backbones
  const backboneConnections: [string, string][] = [
    ['tokyo-prim', 'us-virginia'],
    ['us-virginia', 'eu-frankfurt'],
    ['eu-frankfurt', 'zurich-alpine'],
    ['zurich-alpine', 'singapore-equator'],
    ['singapore-equator', 'tokyo-prim'],
    ['eu-frankfurt', 'reykjavik-geo'],
    ['reykjavik-geo', 'us-virginia'],
    ['us-virginia', 'us-central'],
    ['us-central', 'us-oregon'],
    ['us-oregon', 'tokyo-prim'],
    ['singapore-equator', 'au-sydney'],
    ['eu-frankfurt', 'in-mumbai'],
    ['in-mumbai', 'singapore-equator'],
    ['us-virginia', 'sa-brazil'],
    ['eu-frankfurt', 'za-johannesburg'],
  ];

  return (
    <div className="relative w-full h-full bg-[#030712] overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="backboneLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Atmospheric Glow */}
        <rect width={width} height={height} fill="url(#meshGlow)" />

        {/* Global Grid Lines */}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const { y } = project(lat, 0);
          return (
            <line
              key={`lat-${lat}`}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="#1e293b"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
          );
        })}
        {[-120, -60, 0, 60, 120].map((lng) => {
          const { x } = project(0, lng);
          return (
            <line
              key={`lng-${lng}`}
              x1={x}
              y1="0"
              x2={x}
              y2={height}
              stroke="#1e293b"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Equator & Prime Meridian emphasis */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#334155" strokeWidth="1" />
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#334155" strokeWidth="1" />

        {/* Continental Abstract Landmass Shapes */}
        <path
          d="M 120 120 Q 200 80 300 130 T 260 220 T 160 240 Z" // North America
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.75"
          opacity="0.8"
        />
        <path
          d="M 280 260 Q 340 280 320 380 T 260 440 T 240 320 Z" // South America
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.75"
          opacity="0.8"
        />
        <path
          d="M 460 110 Q 560 90 600 160 T 520 220 T 450 180 Z" // Europe
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.75"
          opacity="0.8"
        />
        <path
          d="M 470 210 Q 570 210 560 330 T 480 380 T 440 260 Z" // Africa
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.75"
          opacity="0.8"
        />
        <path
          d="M 600 100 Q 820 80 880 180 T 780 280 T 620 200 Z" // Asia
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.75"
          opacity="0.8"
        />
        <path
          d="M 780 330 Q 880 340 860 410 T 770 410 Z" // Australia
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.75"
          opacity="0.8"
        />

        {/* Inter-node Backbone Optical Beams */}
        {backboneConnections.map(([idA, idB], idx) => {
          const coordA = REGIONAL_COORDINATES[idA];
          const coordB = REGIONAL_COORDINATES[idB];
          if (!coordA || !coordB) return null;

          const pA = project(coordA.lat, coordA.lng);
          const pB = project(coordB.lat, coordB.lng);

          return (
            <line
              key={`beam-${idx}`}
              x1={pA.x}
              y1={pA.y}
              x2={pB.x}
              y2={pB.y}
              stroke="url(#backboneLine)"
              strokeWidth="1.2"
              opacity="0.5"
              strokeDasharray="6 4"
            />
          );
        })}

        {/* Regional Node Markers */}
        {nodes.map((node) => {
          const coords = REGIONAL_COORDINATES[node.id];
          if (!coords) return null;

          const { x, y } = project(coords.lat, coords.lng);
          const isSelected = selectedNode?.id === node.id;
          const isApex = node.apexNodes >= 500;

          const markerColor = isApex ? '#f59e0b' : '#3b82f6';

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => onSelectNode(node)}
            >
              {/* Pulse Ring */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 16 : isApex ? 12 : 9}
                fill="none"
                stroke={markerColor}
                strokeWidth={isSelected ? 2 : 1}
                opacity={isSelected ? 0.9 : 0.4}
                className="animate-ping"
                style={{ animationDuration: isApex ? '2s' : '3.5s' }}
              />

              {/* Core Node Dot */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 7 : isApex ? 5 : 4}
                fill={markerColor}
                stroke="#ffffff"
                strokeWidth={isSelected ? 2 : 1.2}
              />

              {/* Node City Label */}
              <text
                x={x}
                y={y - (isSelected ? 10 : 8)}
                textAnchor="middle"
                fontSize={isSelected ? '11' : '9'}
                fontFamily="ui-monospace, monospace"
                fontWeight={isSelected ? 'bold' : 'normal'}
                fill={isSelected ? '#60a5fa' : '#cbd5e1'}
                className="pointer-events-none drop-shadow-md"
              >
                {node.city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
