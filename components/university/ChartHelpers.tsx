'use client'

import type { LucideIcon } from 'lucide-react'

/**
 * SectionHeader — separador de sección unificado para todos los tabs.
 * Ícono en cuadrado de color + título en small-caps + subtítulo opcional.
 */
export function SectionHeader({
    icon: Icon,
    title,
    subtitle,
    color = 'indigo',
}: {
    icon: LucideIcon
    title: string
    subtitle?: string
    color?: 'indigo' | 'emerald' | 'amber' | 'slate' | 'blue'
}) {
    const palette: Record<string, { bg: string; border: string; icon: string }> = {
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'text-indigo-600' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-600' },
        amber:   { bg: 'bg-amber-50',   border: 'border-amber-100',   icon: 'text-amber-600' },
        slate:   { bg: 'bg-slate-50',   border: 'border-slate-200',   icon: 'text-slate-500' },
        blue:    { bg: 'bg-blue-50',    border: 'border-blue-100',    icon: 'text-blue-600' },
    }
    const p = palette[color]
    return (
        <div className="flex items-center gap-3 pt-2">
            <div className={`w-7 h-7 rounded-lg ${p.bg} border ${p.border} flex items-center justify-center shrink-0`}>
                <Icon size={14} className={p.icon} />
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">{title}</p>
                {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{subtitle}</p>}
            </div>
        </div>
    )
}

/**
 * Custom Recharts Tooltip
 * Muestra el nombre completo del label (sin truncar) y los valores de cada serie.
 */
export function CustomTooltip({ active, payload, label, labelColor = '#1e293b' }: any) {
    if (!active || !payload || !payload.length) return null

    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 24px -4px rgba(0,0,0,0.12)',
                padding: '10px 14px',
                minWidth: '160px',
                maxWidth: '260px',
                border: 'none',
            }}
        >
            {/* Label completo — sin truncar */}
            <p
                style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: labelColor,
                    marginBottom: '8px',
                    lineHeight: '1.3',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '6px',
                }}
            >
                {label}
            </p>
            {payload.map((entry: any, i: number) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginTop: i > 0 ? '3px' : '0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: entry.color || entry.fill,
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                            {entry.name}
                        </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                        {typeof entry.value === 'number' ? entry.value.toLocaleString('es-CL') : entry.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

/**
 * Custom YAxis Tick para gráficos verticales (layout="vertical").
 * Renderiza el texto en múltiples líneas si supera `maxCharsPerLine`.
 * Pasa el nombre COMPLETO como título en el SVG title para accesibilidad.
 */
export function CustomYAxisTick({
    x, y, payload,
    maxCharsPerLine = 18,
    fontSize = 11,
    fill = '#475569',
    fontWeight = 500,
}: any) {
    const text: string = payload.value || ''
    
    // Dividir en palabras y reagrupar en líneas
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''
    
    for (const word of words) {
        const test = current ? `${current} ${word}` : word
        if (test.length <= maxCharsPerLine) {
            current = test
        } else {
            if (current) lines.push(current)
            current = word.length > maxCharsPerLine ? word.substring(0, maxCharsPerLine - 1) + '…' : word
        }
    }
    if (current) lines.push(current)

    const lineHeight = fontSize + 2
    const totalHeight = lines.length * lineHeight
    const startY = y - (totalHeight / 2) + lineHeight / 2

    return (
        <g>
            <title>{text}</title>
            {lines.map((line, i) => (
                <text
                    key={i}
                    x={x}
                    y={startY + i * lineHeight}
                    textAnchor="end"
                    fill={fill}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    fontFamily="inherit"
                >
                    {line}
                </text>
            ))}
        </g>
    )
}
