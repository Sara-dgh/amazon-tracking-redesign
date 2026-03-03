import { useState } from 'react'
import {
  Menu, Sun, Moon, ClipboardList, Map, List, Clock, CheckCircle,
  ChevronRight, Star, Camera, Bell, Phone, ArrowLeft, Package,
  Truck, Home, RefreshCw, MapPin, User, CreditCard, Navigation
} from 'lucide-react'
import './index.css'

// ============================================================
// === MOCK DATA ===
// ============================================================
const ORDER = {
  id: '114-8392847-2938475',
  item: 'Sony WH-1000XM5 Headphones',
  price: '$429.99',
  placedDate: 'Monday, March 2 · 10:34 AM',
  estimatedDate: 'Thursday, March 5',
  estimatedTime: 'Before 8 PM',
  deliveryType: 'FREE delivery with Prime',
  userName: 'Sarah',
}

const DRIVER = {
  name: 'Marcus D.',
  rating: 4.9,
  stopsAhead: 3,
  etaStart: '2:15 PM',
  etaEnd: '2:45 PM',
  location: 'Burnaby, BC',
}

const TIMELINE_STEPS = [
  { Icon: ClipboardList, label: 'Order placed',        time: 'Mon, Mar 2 · 10:34 AM', done: true },
  { Icon: CreditCard,    label: 'Payment confirmed',    time: 'Mon, Mar 2 · 10:35 AM', done: true },
  { Icon: Package,       label: 'Preparing your order', time: 'Mon, Mar 2 · 3:00 PM',  done: true },
  { Icon: Truck,         label: 'Shipped',              time: 'Tue, Mar 3 · 8:22 AM · FedEx #738291', done: true },
  { Icon: Navigation,    label: 'Out for delivery',     time: 'Thu, Mar 5 · 9:14 AM',  done: true, current: true },
  { Icon: Home,          label: 'Delivered',            time: 'Expected by 8 PM today', done: false },
]

const DELAY = {
  originalDate: 'Thursday, March 5',
  originalTime: 'Before 8 PM',
  newDate: 'Friday, March 6',
  newTime: 'Before 9 PM',
  reason: 'Heavy snow in your area is affecting delivery routes.',
}

const DELIVERY = {
  date: 'Thursday, March 5',
  time: '1:47 PM',
  location: 'Front door',
}


// ============================================================
// === THEME & COLORS ===
// ============================================================
const COLORS = {
  orange: '#FF9900',
  navy: '#131921',
  textPrimary: '#0F1111',
  textSecondary: '#565959',
  green: '#067D62',
  amber: '#C45500',
  red: '#CC0C39',
  beige: '#FAF7F2',
  sage: '#6FCF97',
  cardDark: '#1E2A35',
  darkBg: '#0D1117',
  darkSurface: '#161D26',
}

function getTheme(isDark) {
  return {
    bg:          isDark ? COLORS.darkBg      : COLORS.beige,
    surface:     isDark ? COLORS.darkSurface : '#ffffff',
    card:        isDark ? COLORS.cardDark    : '#ffffff',
    border:      isDark ? '#2D3748'          : '#E7E7E7',
    text:        isDark ? '#F0F0F0'          : COLORS.textPrimary,
    textMuted:   isDark ? '#8A9BB0'          : COLORS.textSecondary,
    navBg:       isDark ? '#1A2332'          : '#ffffff',
    navBorder:   isDark ? '#2D3748'          : '#E7E7E7',
  }
}

// ============================================================
// === COMPONENTS ===
// ============================================================

// Amazon Header
function Header({ isDark, onToggleDark, showBack, onBack }) {
  return (
    <div
      className="flex items-center justify-between px-4 h-14 flex-shrink-0"
      style={{ backgroundColor: COLORS.navy }}
    >
      {showBack ? (
        <button onClick={onBack} className="p-1 text-white">
          <ArrowLeft size={22} />
        </button>
      ) : (
        <button className="p-1 text-white">
          <Menu size={22} />
        </button>
      )}

      {/* Amazon logo */}
      <div className="flex flex-col items-center">
        <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
          amazon
        </span>
        <div
          className="h-0.5 w-10 rounded-full mt-0.5"
          style={{
            background: `linear-gradient(to right, ${COLORS.orange} 70%, transparent 100%)`,
            transform: 'rotate(-2deg)',
            borderRadius: '0 50% 50% 0',
          }}
        />
      </div>

      <button
        onClick={onToggleDark}
        className="p-1 text-white transition-transform hover:scale-110"
        style={{ transition: 'background-color 300ms' }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  )
}

// Status Pill
function StatusPill({ label, color = 'orange', pulse = false }) {
  const colorMap = {
    orange: { bg: COLORS.orange,  text: '#fff' },
    green:  { bg: COLORS.green,   text: '#fff' },
    amber:  { bg: '#F4A261',      text: '#7C3504' },
    grey:   { bg: '#E0E0E0',      text: '#565959' },
  }
  const c = colorMap[color] || colorMap.orange
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {pulse && (
        <span
          className="animate-pulse-dot w-2 h-2 rounded-full bg-white inline-block"
        />
      )}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  )
}

// Info Card
function InfoCard({ children, className = '', isDark, style = {} }) {
  const t = getTheme(isDark)
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${className}`}
      style={{
        backgroundColor: t.card,
        border: `1px solid ${t.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Bottom Navigation
function BottomNav({ activeScreen, onNavigate, isDark }) {
  const t = getTheme(isDark)
  const tabs = [
    { id: 1, icon: ClipboardList, label: 'Confirm' },
    { id: 2, icon: Map,           label: 'Track' },
    { id: 3, icon: List,          label: 'Timeline' },
    { id: 4, icon: Clock,         label: 'Delay' },
    { id: 5, icon: CheckCircle,   label: 'Delivered' },
  ]
  return (
    <div
      className="flex items-center justify-around px-2 py-2 flex-shrink-0"
      style={{
        backgroundColor: t.navBg,
        borderTop: `1px solid ${t.navBorder}`,
        minHeight: '60px',
      }}
    >
      {tabs.map(tab => {
        const active = activeScreen === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center gap-0.5 flex-1 py-1 min-h-[44px] justify-center"
            style={{ color: active ? COLORS.orange : t.textMuted }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {active && (
              <div
                className="w-4 h-0.5 rounded-full mt-0.5"
                style={{ backgroundColor: COLORS.orange }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================
// === SCREEN 1: Order Confirmation ===
// ============================================================
function Screen1({ isDark, onNavigate }) {
  const t = getTheme(isDark)
  return (
    <div
      className="flex-1 overflow-y-auto no-scrollbar"
      style={{ backgroundColor: t.bg }}
    >
      <div className="px-4 py-6 flex flex-col gap-4">
        {/* Animated Checkmark */}
        <div className="flex justify-center animate-circle-pulse">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <svg viewBox="0 0 52 52" width="56" height="56">
              <circle
                cx="26" cy="26" r="24"
                fill="none"
                stroke={COLORS.green}
                strokeWidth="2.5"
                opacity="0.3"
              />
              <path
                fill="none"
                stroke={COLORS.green}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27 L22 35 L38 18"
                className="animate-draw-check"
              />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center animate-fade-up-1">
          <h1 className="text-2xl font-bold" style={{ color: t.text }}>
            Order confirmed, {ORDER.userName}!
          </h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>
            We're already getting it ready for you.
          </p>
        </div>

        {/* Delivery Estimate Card */}
        <InfoCard isDark={isDark} className="animate-fade-up-2">
          <div className="text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: t.textMuted }}>
            Estimated Delivery
          </div>
          <div className="text-xl font-bold" style={{ color: t.text }}>
            {ORDER.estimatedDate}
          </div>
          <div className="text-xs mt-1" style={{ color: t.textMuted }}>
            {ORDER.estimatedTime} · {ORDER.deliveryType}
          </div>
          <div
            className="mt-3 text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
            style={{ backgroundColor: isDark ? '#1A2E1A' : '#F0FBF0', color: COLORS.green }}
          >
            <Sun size={11} /> Clear skies expected — great delivery day
          </div>
        </InfoCard>

        {/* Order Summary Card */}
        <InfoCard isDark={isDark} className="animate-fade-up-3">
          <div className="flex gap-3 items-center">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isDark ? '#243040' : '#F5F5F5' }}
            >
              <Package size={28} style={{ color: t.textMuted }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight" style={{ color: t.text }}>
                {ORDER.item}
              </div>
              <div className="text-xs mt-1" style={{ color: t.textMuted }}>
                Order #{ORDER.id}
              </div>
              <div className="text-base font-bold mt-1" style={{ color: t.text }}>
                {ORDER.price}
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Order placed */}
        <div className="animate-fade-up-4">
          <div className="text-xs text-center" style={{ color: t.textMuted }}>
            Placed on {ORDER.placedDate}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 animate-fade-up-5">
          <button
            onClick={() => onNavigate(2)}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
            style={{ backgroundColor: COLORS.orange, minHeight: '44px' }}
          >
            Track your order
          </button>
          <button
            className="w-full py-3 text-sm font-medium"
            style={{ color: COLORS.orange }}
          >
            View order details
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// === SCREEN 2: Live Tracking Map ===
// ============================================================

function RouteVisualization() {
  // Apple Maps day mode — warm beige, white roads, dark labels
  const bg = '#E8DDD0'
  const block = 'rgba(0,0,0,0.055)'
  const road = 'rgba(255,255,255,0.92)'

  // Key coordinates — snapped to road grid
  const ox = 30,  oy = 166  // origin (on y=166 road)
  const dx = 201, dy = 82   // driver (~65% along route, on y=82 road)
  const hx = 308, hy = 48   // home (on x=308 road)

  // Route follows the road grid with rounded corners (Q = quadratic bezier at each turn)
  // Completed: east on y=166 → north on x=80 → east on y=140 → north on x=164 → east on y=82 to driver
  const routeCompleted = 'M 30 166 L 72 166 Q 80 166 80 158 L 80 148 Q 80 140 88 140 L 156 140 Q 164 140 164 132 L 164 90 Q 164 82 172 82 L 201 82'
  // Remaining: east on y=82 → north on x=308 to home
  const routeRemaining = 'M 201 82 L 300 82 Q 308 82 308 74 L 308 48'
  // Full route underlay
  const routeFull = 'M 30 166 L 72 166 Q 80 166 80 158 L 80 148 Q 80 140 88 140 L 156 140 Q 164 140 164 132 L 164 90 Q 164 82 172 82 L 300 82 Q 308 82 308 74 L 308 48'

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: bg }}>
      <svg viewBox="0 0 380 200" width="100%" style={{ display: 'block' }}>
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* City blocks */}
        {[
          [16,14,54,30], [88,10,62,26], [166,18,50,36], [236,8,56,34], [306,14,54,28],
          [16,88,54,38],  [90,96,60,32], [172,82,52,44], [244,78,58,38], [315,90,46,40],
          [16,148,64,28], [100,145,54,32],[180,150,58,28],[258,143,52,35],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill={block} />
        ))}

        {/* Road grid */}
        <line x1="0" y1="82"  x2="380" y2="82"  stroke={road} strokeWidth="8" />
        <line x1="0" y1="140" x2="380" y2="140" stroke={road} strokeWidth="5" />
        <line x1="0" y1="166" x2="380" y2="166" stroke={road} strokeWidth="4" />
        <line x1="80"  y1="0" x2="80"  y2="200" stroke={road} strokeWidth="5" />
        <line x1="164" y1="0" x2="164" y2="200" stroke={road} strokeWidth="8" />
        <line x1="250" y1="0" x2="250" y2="200" stroke={road} strokeWidth="5" />
        <line x1="308" y1="0" x2="308" y2="200" stroke={road} strokeWidth="4" />

        {/* Vignette */}
        <rect x="0" y="0" width="380" height="200" fill="url(#vignette)" />

        {/* Full route underlay (very faint) */}
        <path
          d={routeFull}
          fill="none"
          stroke="rgba(0,0,0,0.07)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Completed segment */}
        <path
          d={routeCompleted}
          fill="none"
          stroke={COLORS.green}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Remaining segment */}
        <path
          d={routeRemaining}
          fill="none"
          stroke="rgba(0,0,0,0.22)"
          strokeWidth="3"
          strokeDasharray="5 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Origin dot */}
        <circle cx={ox} cy={oy} r="7" fill={COLORS.green} opacity="0.25" />
        <circle cx={ox} cy={oy} r="4.5" fill={COLORS.green} />
        <circle cx={ox} cy={oy} r="1.8" fill={bg} />

        {/* Driver — live location */}
        <circle cx={dx} cy={dy} r="24" fill={COLORS.orange} className="animate-live-ring" />
        <circle cx={dx} cy={dy} r="12" fill={COLORS.orange} filter="url(#glow)" />
        <circle cx={dx} cy={dy} r="4.5" fill="#fff" />

        {/* Driver label */}
        <rect x={dx - 32} y={dy - 46} width="64" height="18" rx="9" fill={COLORS.orange} />
        <text
          x={dx} y={dy - 34}
          textAnchor="middle" fontSize="9" fontWeight="700"
          fill="#fff" fontFamily="Inter, sans-serif"
        >
          Your driver
        </text>

        {/* Destination pin */}
        <ellipse cx={hx} cy={hy - 12} rx="11.5" ry="11.5" fill="#1F2937" />
        <polygon points={`${hx - 8},${hy - 4} ${hx + 8},${hy - 4} ${hx},${hy + 8}`} fill="#1F2937" />
        <circle cx={hx} cy={hy - 12} r="4.5" fill={COLORS.orange} />

        {/* Destination label */}
        <rect x={hx - 28} y={hy + 10} width="56" height="18" rx="9" fill="#1F2937" />
        <text
          x={hx} y={hy + 23}
          textAnchor="middle" fontSize="9" fontWeight="700"
          fill="#fff" fontFamily="Inter, sans-serif"
        >
          Your home
        </text>
      </svg>

      {/* Map footer */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ backgroundColor: COLORS.green }}
          />
          <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>Live tracking</span>
        </div>
        <span className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>Updated 1 min ago</span>
      </div>
    </div>
  )
}

function Screen2({ isDark }) {
  const t = getTheme(isDark)
  return (
    <div
      className="flex-1 overflow-y-auto no-scrollbar"
      style={{ backgroundColor: t.bg }}
    >
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Status pill */}
        <div className="flex justify-center animate-fade-up">
          <StatusPill label="Out for Delivery" color="orange" pulse />
        </div>

        {/* Route visualization */}
        <div className="animate-fade-up-1">
          <RouteVisualization />
        </div>

        {/* ETA Card */}
        <InfoCard isDark={isDark} className="animate-slide-up">
          <div className="text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: t.textMuted }}>
            Estimated Arrival
          </div>
          <div className="text-xl font-bold" style={{ color: t.text }}>
            {DRIVER.etaStart} – {DRIVER.etaEnd}
          </div>
        </InfoCard>

        {/* Driver info */}
        <InfoCard isDark={isDark} className="animate-fade-up-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isDark ? '#243040' : '#F5F5F5' }}
            >
              <User size={22} style={{ color: t.textMuted }} />
            </div>
            <div className="flex-1">
              <div className="text-xs" style={{ color: t.textMuted }}>Your driver</div>
              <div className="font-semibold text-sm" style={{ color: t.text }}>{DRIVER.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: t.textMuted }}>Stops ahead</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.orange }}>{DRIVER.stopsAhead}</div>
            </div>
          </div>
        </InfoCard>

        {/* Live update ticker */}
        <div
          className="flex items-center gap-2 justify-center pb-2 animate-fade-up-4"
          style={{ color: t.textMuted }}
        >
          <span className="w-2 h-2 rounded-full animate-blink" style={{ backgroundColor: COLORS.green, display: 'inline-block' }} />
          <span className="text-xs">Last updated 1 min ago</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// === SCREEN 3: Delivery Timeline ===
// ============================================================
function Screen3({ isDark }) {
  const t = getTheme(isDark)

  return (
    <div
      className="flex-1 overflow-y-auto no-scrollbar"
      style={{ backgroundColor: t.bg }}
    >
      <div className="px-4 py-5 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: t.text }}>Your delivery journey</h2>
          <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Order #{ORDER.id}</p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {TIMELINE_STEPS.map((step, i) => {
            const isLast = i === TIMELINE_STEPS.length - 1
            return (
              <div key={i} className={`animate-step-${i} flex gap-3`}>
                {/* Left column: circle + line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                    style={{
                      backgroundColor: step.current
                        ? COLORS.orange
                        : step.done
                          ? COLORS.green
                          : (isDark ? '#2D3748' : '#E0E0E0'),
                      boxShadow: step.current ? `0 0 0 4px rgba(255,153,0,0.2)` : 'none',
                    }}
                  >
                    {step.done ? (
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <path
                          d="M3 8.5L6.5 12L13 5"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <step.Icon size={16} color={isDark ? '#8A9BB0' : '#A0AEC0'} />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 my-1"
                      style={{
                        backgroundColor: step.done && !step.current ? COLORS.green : (isDark ? '#2D3748' : '#E0E0E0'),
                        minHeight: '24px',
                        borderStyle: step.done ? 'solid' : 'dashed',
                      }}
                    />
                  )}
                </div>

                {/* Right content */}
                <div className={`pb-5 flex-1 ${isLast ? 'pb-2' : ''}`}>
                  <div
                    className={`text-sm font-${step.done || step.current ? 'semibold' : 'normal'}`}
                    style={{
                      color: step.current
                        ? COLORS.orange
                        : step.done
                          ? t.text
                          : t.textMuted,
                    }}
                  >
                    {step.label}
                    {step.current && (
                      <span
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: COLORS.orange, color: '#fff' }}
                      >
                        Now
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: t.textMuted }}>
                    {step.time}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Estimated delivery card */}
        <InfoCard
          isDark={isDark}
          className="animate-fade-up-5"
          style={{ borderLeft: `4px solid ${COLORS.orange}` }}
        >
          <div className="text-sm font-semibold" style={{ color: t.text }}>
            Estimated delivery today before 8 PM
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="flex-1 h-2 rounded-full"
              style={{ backgroundColor: isDark ? '#2D3748' : '#E7E7E7' }}
            >
              <div
                className="h-2 rounded-full"
                style={{ width: '83%', backgroundColor: COLORS.green }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: COLORS.orange }}>5/6 steps</span>
          </div>
        </InfoCard>

        {/* Alerts toggle */}
        <div
          className="flex items-center justify-between p-3 rounded-2xl animate-fade-up"
          style={{ backgroundColor: isDark ? COLORS.cardDark : '#fff', border: `1px solid ${isDark ? '#2D3748' : '#E7E7E7'}` }}
        >
          <div className="flex items-center gap-2">
            <Bell size={16} style={{ color: COLORS.orange }} />
            <span className="text-sm" style={{ color: t.text }}>Delivery alerts</span>
          </div>
          <div
            className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ backgroundColor: COLORS.green }}
          >
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// === SCREEN 4: Delay Notification ===
// ============================================================
function Screen4({ isDark }) {
  const t = getTheme(isDark)
  return (
    <div
      className="flex-1 overflow-y-auto no-scrollbar"
      style={{ backgroundColor: t.bg }}
    >
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Empathy hero */}
        <div
          className="rounded-2xl p-5 animate-fade-up"
          style={{ backgroundColor: isDark ? '#2A1E10' : '#FEF3E9', border: `1px solid #F4A261` }}
        >
          <div className="mb-3"><Clock size={32} color={isDark ? '#FDDCB5' : '#C45500'} /></div>
          <h2 className="text-xl font-bold leading-snug" style={{ color: isDark ? '#FDDCB5' : '#7C3504' }}>
            Your package is taking a little longer
          </h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: isDark ? '#D4A76A' : '#A0522D' }}>
            We're sorry for the delay. {DELAY.reason}
          </p>
        </div>

        {/* Updated delivery card */}
        <InfoCard isDark={isDark} className="animate-fade-up-1">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.textMuted }}>
            Updated Delivery
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-base line-through" style={{ color: t.textMuted }}>
              {DELAY.originalDate} · {DELAY.originalTime}
            </div>
            <div className="text-xl font-bold" style={{ color: t.text }}>
              {DELAY.newDate}
            </div>
            <div className="text-xs" style={{ color: t.textMuted }}>{DELAY.newTime}</div>
          </div>
          <div
            className="mt-3 text-xs px-3 py-2 rounded-xl"
            style={{ backgroundColor: isDark ? '#1A2E1A' : '#F0FBF0', color: COLORS.green }}
          >
            Your item is safe and on its way.
          </div>
        </InfoCard>

        {/* What happens next */}
        <InfoCard isDark={isDark} className="animate-fade-up-2">
          <div className="text-sm font-semibold mb-3" style={{ color: t.text }}>
            What happens next
          </div>
          <div className="flex flex-col gap-3">
            {[
              { Icon: Bell,       text: "We'll notify you when it's out for delivery" },
              { Icon: Package,    text: 'Your item is secured at a local facility overnight' },
              { Icon: CreditCard, text: 'No charges until delivery is confirmed' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.Icon size={18} style={{ color: t.textMuted, flexShrink: 0, marginTop: 1 }} />
                <span className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </InfoCard>

        {/* CTAs */}
        <div className="flex flex-col gap-3 animate-fade-up-3">
          <button
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
            style={{ backgroundColor: COLORS.orange, minHeight: '44px' }}
          >
            Get notified when it ships
          </button>
          <button
            className="w-full py-3 text-sm font-medium flex items-center justify-center gap-1"
            style={{ color: t.textMuted }}
          >
            <Phone size={14} /> Contact support
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// === SCREEN 5: Delivered + Review ===
// ============================================================
const CONFETTI_COLORS = ['#FF9900', '#6FCF97', '#2D9CDB', '#F4A261', '#CC0C39', '#A78BFA', '#FDE68A', '#6EE7B7']

function Confetti() {
  const dots = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${10 + i * 10}%`,
    top: `${20 + (i % 3) * 15}%`,
    delay: `${i * 0.08}s`,
    size: i % 2 === 0 ? 8 : 6,
  }))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map(d => (
        <div
          key={d.id}
          className="confetti-dot"
          style={{
            backgroundColor: d.color,
            left: d.left,
            top: d.top,
            animationDelay: d.delay,
            width: d.size,
            height: d.size,
          }}
        />
      ))}
    </div>
  )
}

function Screen5({ isDark }) {
  const t = getTheme(isDark)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [feedbackShown, setFeedbackShown] = useState(false)
  const [starKey, setStarKey] = useState(0)

  function handleStar(n) {
    setRating(n)
    setStarKey(k => k + 1)
    setFeedbackShown(true)
  }

  return (
    <div
      className="flex-1 overflow-y-auto no-scrollbar"
      style={{ backgroundColor: t.bg }}
    >
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Celebration */}
        <div className="relative flex flex-col items-center py-2 animate-circle-pulse">
          <Confetti />
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <svg viewBox="0 0 60 60" width="68" height="68">
              <circle cx="30" cy="30" r="28" fill={COLORS.green} opacity="0.15" />
              <circle cx="30" cy="30" r="22" fill={COLORS.green} />
              <path
                d="M17 31 L25 39 L43 21"
                fill="none"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-check"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mt-3" style={{ color: t.text }}>
            It's here!
          </h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>
            Delivered {DELIVERY.date} at {DELIVERY.time}
          </p>
        </div>

        {/* Delivery photo card */}
        <InfoCard isDark={isDark} className="animate-fade-up-1">
          <div
            className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 mb-3"
            style={{ backgroundColor: isDark ? '#243040' : '#F0F4F8' }}
          >
            <Camera size={28} style={{ color: t.textMuted }} />
            <span className="text-xs" style={{ color: t.textMuted }}>Delivery photo</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: COLORS.orange }} />
            <span className="text-sm" style={{ color: t.text }}>Left at: {DELIVERY.location}</span>
          </div>
        </InfoCard>

        {/* Package summary */}
        <InfoCard isDark={isDark} className="animate-fade-up-2">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.textMuted }}>
            Delivered item
          </div>
          <div className="text-sm font-semibold" style={{ color: t.text }}>{ORDER.item}</div>
          <div className="text-xs mt-0.5" style={{ color: t.textMuted }}>Order #{ORDER.id}</div>
        </InfoCard>

        {/* Delivery rating */}
        <InfoCard isDark={isDark} className="animate-fade-up-3">
          <div className="text-sm font-semibold mb-3" style={{ color: t.text }}>
            How was your delivery experience?
          </div>
          <div key={starKey} className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                className={rating === n ? 'animate-star-bounce' : ''}
                onMouseEnter={() => setHoveredStar(n)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleStar(n)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', minHeight: '44px' }}
              >
                <Star
                  size={32}
                  fill={n <= (hoveredStar || rating) ? COLORS.orange : 'none'}
                  stroke={COLORS.orange}
                />
              </button>
            ))}
          </div>
          {feedbackShown && (
            <div
              className="mt-3 text-sm text-center font-medium animate-fade-up"
              style={{ color: COLORS.green }}
            >
              Thanks for your feedback!
            </div>
          )}
        </InfoCard>

        {/* Product review prompt */}
        <InfoCard isDark={isDark} className="animate-fade-up-4">
          <div className="text-sm font-medium mb-1" style={{ color: t.text }}>
            Enjoying your Sony Headphones? Share your thoughts.
          </div>
          <div className="text-xs mb-3" style={{ color: t.textMuted }}>
            Your review helps others make confident decisions.
          </div>
          <button
            className="w-full py-3 rounded-2xl text-sm font-semibold border-2"
            style={{ color: COLORS.orange, borderColor: COLORS.orange, background: 'none', minHeight: '44px' }}
          >
            Write a review
          </button>
        </InfoCard>

        {/* Reorder */}
        <div className="animate-fade-up-5 pb-2">
          <button
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.orange, minHeight: '44px' }}
          >
            <RefreshCw size={16} />
            Buy again
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// === APP ROOT ===
// ============================================================
export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [activeScreen, setActiveScreen] = useState(1)

  const t = getTheme(isDark)

  const screens = { 1: Screen1, 2: Screen2, 3: Screen3, 4: Screen4, 5: Screen5 }
  const ActiveScreen = screens[activeScreen]

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundColor: isDark ? '#050A10' : '#D4D8DC',
        transition: 'background-color 300ms',
        padding: '20px 0',
      }}
    >
      {/* Mobile frame */}
      <div
        className="relative flex flex-col rounded-3xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '390px',
          minHeight: '844px',
          height: 'calc(100vh - 40px)',
          maxHeight: '844px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          backgroundColor: t.bg,
          transition: 'background-color 300ms',
        }}
      >
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark(d => !d)}
          showBack={activeScreen !== 1}
          onBack={() => setActiveScreen(s => Math.max(1, s - 1))}
        />

        <ActiveScreen isDark={isDark} onNavigate={setActiveScreen} />

        <BottomNav
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          isDark={isDark}
        />
      </div>
    </div>
  )
}
