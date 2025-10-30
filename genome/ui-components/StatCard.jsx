/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

/**
 * StatCard - Display KPI statistics with trend indicators
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Card label
 * @param {string} props.value - Main value to display
 * @param {string} props.change - Change indicator text
 * @param {React.ReactNode} props.icon - Icon component
 * @param {'up'|'down'|'neutral'} props.trend - Trend direction
 * @param {string} props.className - Additional classes
 * @returns {JSX.Element}
 */
export function StatCard({ label, value, change, icon, trend = 'neutral', className = '' }) {
  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-neutral-600 dark:text-neutral-400',
  }

  return (
    <div className={`rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          <p className={`mt-1 text-sm font-medium ${trendColors[trend]}`}>{change}</p>
        </div>
        <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
