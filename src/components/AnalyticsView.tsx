import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, BarChart4, Download, Loader2, Calendar, FileText, Share2, Award, Zap, Globe, Twitter, Linkedin, Instagram, Facebook, Music } from 'lucide-react';
import { SocialPlatform, PlatformMetric } from '../types';

interface AnalyticsViewProps {
  platformMetrics: PlatformMetric[];
  onTriggerPDFExport: () => void;
  isExportingPDF: boolean;
  isOnline: boolean;
  totalPendingPostCount: number;
}

interface AnalyticsDataPoint {
  day: string;
  twitter: number;
  linkedin: number;
  instagram: number;
  facebook: number;
  tiktok: number;
}

const HISTORIC_DATA: AnalyticsDataPoint[] = [
  { day: 'Mon', twitter: 420, linkedin: 180, instagram: 520, facebook: 240, tiktok: 890 },
  { day: 'Tue', twitter: 380, linkedin: 220, instagram: 610, facebook: 290, tiktok: 980 },
  { day: 'Wed', twitter: 510, linkedin: 310, instagram: 720, facebook: 310, tiktok: 1100 },
  { day: 'Thu', twitter: 490, linkedin: 290, instagram: 680, facebook: 280, tiktok: 1050 },
  { day: 'Fri', twitter: 650, linkedin: 450, instagram: 890, facebook: 420, tiktok: 1450 },
  { day: 'Sat', twitter: 820, linkedin: 150, instagram: 1200, facebook: 550, tiktok: 1850 },
  { day: 'Sun', twitter: 750, linkedin: 110, instagram: 1150, facebook: 490, tiktok: 1720 },
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  platformMetrics,
  onTriggerPDFExport,
  isExportingPDF,
  isOnline,
  totalPendingPostCount,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'followers' | 'reach' | 'engagement'>('engagement');
  const [activePlatformFilter, setActivePlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return '#818CF8';
      case 'linkedin': return '#3B82F6';
      case 'instagram': return '#EC4899';
      case 'facebook': return '#1877F2';
      case 'tiktok': return '#A78BFA';
    }
  };

  const getPlatformBannerName = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'X (Twitter)';
      case 'linkedin': return 'LinkedIn';
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'tiktok': return 'TikTok';
    }
  };

  const getPlatformIcon = (platform: SocialPlatform | 'all', size = 12) => {
    switch (platform) {
      case 'all': return <Globe size={size} />;
      case 'twitter': return <Twitter size={size} />;
      case 'linkedin': return <Linkedin size={size} />;
      case 'instagram': return <Instagram size={size} />;
      case 'facebook': return <Facebook size={size} />;
      case 'tiktok': return <Music size={size} />;
    }
  };

  // Compute overall metrics
  const totalFollowers = platformMetrics.reduce((sum, item) => sum + item.followers, 0);
  const avgEngagement = platformMetrics.reduce((sum, item) => sum + item.engagementRate, 0) / platformMetrics.length;
  const totalReach = platformMetrics.reduce((sum, item) => sum + item.reach, 0);

  // Custom SVG path computations for a fully responsive, beautiful area graph
  const getChartPoints = (platformKey: SocialPlatform | 'all') => {
    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Extract values
    const values = HISTORIC_DATA.map((d) => {
      if (platformKey === 'all') {
        return d.twitter + d.linkedin + d.instagram + d.facebook + d.tiktok;
      }
      return d[platformKey];
    });

    const maxVal = Math.max(...values) * 1.15 || 100;
    const minVal = 0;

    const points = HISTORIC_DATA.map((d, index) => {
      const x = paddingLeft + (index / (HISTORIC_DATA.length - 1)) * chartWidth;
      const val = platformKey === 'all'
        ? d.twitter + d.linkedin + d.instagram + d.facebook + d.tiktok
        : d[platformKey];
      const y = paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      return { x, y, val, day: d.day };
    });

    // Create line path d attribute
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

    // Create closed area path
    const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} Z`;

    return { points, linePath, areaPath, width, height, chartWidth, chartHeight, paddingTop, paddingLeft, maxVal };
  };

  const chartData = getChartPoints(activePlatformFilter);

  return (
    <div id="analytics-panel" className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden transition-all duration-300 text-white">
      
      {/* Background flare accents representing the premium Space theme */}
      <span className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-5">
        <div>
          <h2 className="font-sans font-bold text-lg text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-400" />
            Social Engagement Tracker
          </h2>
          <p className="text-xs text-white/40">
            Real-time cross-platform analytics reporting engine
          </p>
        </div>

        {/* Action Buttons: Export PDF */}
        <button
          onClick={onTriggerPDFExport}
          disabled={isExportingPDF}
          className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all shadow-md hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-50 select-none"
        >
          {isExportingPDF ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Formatting PDF Engine...
            </>
          ) : (
            <>
              <Download size={14} />
              Export PDF Report
            </>
          )}
        </button>
      </div>

      {/* Grid of Key Performance Indicators (KPI Overview Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        {/* KPI 1 */}
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 relative">
          <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-white/40 block">
            TOTAL AUDIENCE
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl font-bold font-sans text-white">
              {totalFollowers.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">
              +4.8%
            </span>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">Aggregate user reach</p>
        </div>

        {/* KPI 2 */}
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 relative">
          <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-white/40 block">
            AVERAGE ENGAGEMENT RATE
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl font-bold font-sans text-white">
              {avgEngagement.toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">
              +1.2%
            </span>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">Weighted platform interaction</p>
        </div>

        {/* KPI 3 */}
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 relative">
          <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-white/40 block">
            ACTIVE CAMPAIGN REACH
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl font-bold font-sans text-white">
              {totalReach.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">
              +12.4%
            </span>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">Weekly total impressions</p>
        </div>
      </div>

      {/* Main Core Vector Graph Area */}
      <div className="bg-white/5 rounded-3xl p-4 border border-white/5 mb-5 relative">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 pb-3 mb-2.5 border-b border-white/5">
          <div>
            <span className="text-xs font-bold text-white">
              Active Click History
            </span>
            <span className="text-[10px] text-white/40 block">
              Audited daily traffic click loops per platform
            </span>
          </div>

          {/* Platforms Pills Filter Panel */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActivePlatformFilter('all')}
              className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activePlatformFilter === 'all'
                  ? 'bg-indigo-600 text-white border-transparent shadow'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Globe size={11} />
              <span>All Platforms</span>
            </button>
            {platformMetrics.map((item) => (
              <button
                key={item.platform}
                onClick={() => setActivePlatformFilter(item.platform)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5 ${
                  activePlatformFilter === item.platform
                    ? 'bg-indigo-600 text-white border-transparent shadow font-bold'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {getPlatformIcon(item.platform, 11)}
                <span>{item.platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vector SVG Chart Render */}
        <div className="relative w-full overflow-hidden" style={{ height: chartData.height }}>
          <svg
            viewBox={`0 0 ${chartData.width} ${chartData.height}`}
            className="w-full h-full overflow-visible"
          >
            {/* Horizontal Grid guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = chartData.paddingTop + ratio * chartData.chartHeight;
              const val = (chartData.maxVal * (1 - ratio)).toFixed(0);
              return (
                <g key={index} className="opacity-40 select-none">
                  <line
                    x1={chartData.paddingLeft}
                    y1={y}
                    x2={chartData.width - 20}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    className="text-white/10"
                  />
                  <text
                    x={chartData.paddingLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-white/40 font-mono text-[8px]"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid guidelines */}
            {chartData.points.map((p, i) => (
              <g key={i} className="opacity-40">
                <line
                  x1={p.x}
                  y1={chartData.paddingTop}
                  x2={p.x}
                  y2={chartData.paddingTop + chartData.chartHeight}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-white/10"
                />
                <text
                  x={p.x}
                  y={chartData.paddingTop + chartData.chartHeight + 14}
                  textAnchor="middle"
                  className="fill-white/40 font-sans text-[8.5px] font-bold"
                >
                  {p.day}
                </text>
              </g>
            ))}

            {/* Closed Colored Gradient Fill underneath area */}
            <path
              d={chartData.areaPath}
              className="fill-indigo-500/10 transition-all duration-500"
            />

            {/* Primary line stroke */}
            <path
              d={chartData.linePath}
              fill="none"
              stroke={activePlatformFilter === 'all' ? '#818CF8' : getPlatformColor(activePlatformFilter)}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />

            {/* Nodes on points */}
            {chartData.points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? '5.5' : '3.5'}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-150 stroke-[2]"
                stroke={activePlatformFilter === 'all' ? '#818CF8' : getPlatformColor(activePlatformFilter)}
                fill={hoveredIndex === i ? '#FFF' : '#0a0a0a'}
              />
            ))}
          </svg>

          {/* Interactive Tooltip on Node Hover */}
          <AnimatePresence>
            {hoveredIndex !== null && (
              <div
                className="absolute bg-[#0d0d0d] border border-white/15 text-white rounded-xl p-2 text-[10px] pointer-events-none drop-shadow-md z-30"
                style={{
                  left: `${((chartData.points[hoveredIndex].x / chartData.width) * 100).toFixed(0)}%`,
                  top: `${((chartData.points[hoveredIndex].y / chartData.height) * 100 - 20).toFixed(0)}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <span className="font-mono text-white/40 uppercase tracking-widest">{chartData.points[hoveredIndex].day} Traffic:</span>
                <p className="font-sans font-bold text-indigo-400 mt-0.5">{chartData.points[hoveredIndex].val.toLocaleString()} Clicks</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sub-table: Platform metric breakdown */}
      <div className="space-y-2">
        <span className="text-[9px] font-bold font-mono tracking-wider text-white/40 uppercase block">
          PLATFORM PORTFOLIO ENGINE
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead>
              <tr className="border-b border-white/10 text-white/45 font-bold font-mono uppercase tracking-wider text-[9px]">
                <th className="pb-2">Platform</th>
                <th className="pb-2 text-right">Followers</th>
                <th className="pb-2 text-right">Engagement</th>
                <th className="pb-2 text-right">Reach</th>
                <th className="pb-2 text-right">Total Posts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {platformMetrics.map((item) => (
                <tr key={item.platform} className="hover:bg-white/5">
                  <td className="py-2.5 font-bold uppercase flex items-center gap-2">
                    <span 
                      className="p-1 rounded-md bg-white/5 flex items-center justify-center"
                      style={{ color: getPlatformColor(item.platform) }}
                    >
                      {getPlatformIcon(item.platform, 12)}
                    </span>
                    {getPlatformBannerName(item.platform)}
                  </td>
                  <td className="py-2.5 text-right font-medium">{item.followers.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-emerald-400 font-bold">{item.engagementRate.toFixed(1)}%</td>
                  <td className="py-2.5 text-right font-medium">{item.reach.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-semibold text-white/60">{item.postsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
