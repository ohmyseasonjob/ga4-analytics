'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

type Status = 'active' | 'partial' | 'inactive' | 'success' | 'warning' | 'error' | 'info'

interface StatusBadgeProps {
  status: Status
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = {
    active: { bg: 'bg-success/20', text: 'text-success', dot: 'bg-success', defaultLabel: 'Actif' },
    partial: { bg: 'bg-warning/20', text: 'text-warning', dot: 'bg-warning', defaultLabel: 'Partiel' },
    inactive: { bg: 'bg-error/20', text: 'text-error', dot: 'bg-error', defaultLabel: 'Inactif' },
    success: { bg: 'bg-success/20', text: 'text-success', dot: 'bg-success', defaultLabel: 'Succès' },
    warning: { bg: 'bg-warning/20', text: 'text-warning', dot: 'bg-warning', defaultLabel: 'Attention' },
    error: { bg: 'bg-error/20', text: 'text-error', dot: 'bg-error', defaultLabel: 'Erreur' },
    info: { bg: 'bg-info/20', text: 'text-info', dot: 'bg-info', defaultLabel: 'Info' },
  }

  const { bg, text, dot, defaultLabel } = config[status]

  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', bg, text, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dot)} />
      {label || defaultLabel}
    </span>
  )
}

interface AlertBannerProps {
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  description?: string
  className?: string
}

export function AlertBanner({ type, title, description, className }: AlertBannerProps) {
  const config = {
    warning: {
      bg: 'bg-warning/10 border-warning/30',
      icon: AlertTriangle,
      iconColor: 'text-warning',
      titleColor: 'text-warning',
    },
    error: {
      bg: 'bg-error/10 border-error/30',
      icon: XCircle,
      iconColor: 'text-error',
      titleColor: 'text-error',
    },
    info: {
      bg: 'bg-info/10 border-info/30',
      icon: Info,
      iconColor: 'text-info',
      titleColor: 'text-info',
    },
    success: {
      bg: 'bg-success/10 border-success/30',
      icon: CheckCircle,
      iconColor: 'text-success',
      titleColor: 'text-success',
    },
  }

  const { bg, icon: Icon, iconColor, titleColor } = config[type]

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border', bg, className)}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColor)} />
      <div>
        <p className={cn('font-medium', titleColor)}>{title}</p>
        {description && (
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}

interface TrackingSourceCardProps {
  name: string
  id: string
  status: 'active' | 'partial' | 'inactive'
  details: string
  color?: string
  className?: string
}

export function TrackingSourceCard({
  name,
  id,
  status,
  details,
  color = 'yellow',
  className,
}: TrackingSourceCardProps) {
  const dotColors: Record<string, string> = {
    yellow: 'bg-oms-yellow',
    cyan: 'bg-oms-cyan',
    violet: 'bg-oms-violet',
    green: 'bg-oms-green',
  }

  return (
    <div className={cn('bg-card border border-border rounded-xl p-4 flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <span className={cn('w-2.5 h-2.5 rounded-full', dotColors[color])} />
        <div>
          <p className="text-text-primary font-medium">{name}</p>
          <p className="text-text-muted text-xs">{id}</p>
        </div>
      </div>
      <div className="text-right">
        <StatusBadge status={status} />
        <p className="text-text-muted text-xs mt-1">{details}</p>
      </div>
    </div>
  )
}
