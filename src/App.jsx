import { useState, useEffect } from 'react'
import {
  Menu, Sun, Moon, ClipboardList, Map, List, Clock, CheckCircle,
  ChevronRight, Star, Camera, Bell, Phone, ArrowLeft, Package,
  Truck, Home, RefreshCw, MapPin
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
  { icon: '📋', label: 'Order placed',       time: 'Mon, Mar 2 · 10:34 AM', done: true },
  { icon: '💳', label: 'Payment confirmed',   time: 'Mon, Mar 2 · 10:35 AM', done: true },
  { icon: '📦', label: 'Preparing your order',time: 'Mon, Mar 2 · 3:00 PM',  done: true },
  { icon: '🚚', label: 'Shipped',             time: 'Tue, Mar 3 · 8:22 AM · FedEx #738291', done: true },
  { icon: '🏃', label: 'Out for delivery',    time: 'Thu, Mar 5 · 9:14 AM',  done: true,  current: true },
  { icon: '🏠', label: 'Delivered',           time: 'Expected by 8 PM today', done: false },
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

const weatherContext = {
  temp: '6°C',
  condition: 'Partly cloudy',
  icon: '🌤',
  timeOfDay: 'afternoon',
  deliveryMessage: 'Arriving this afternoon 🌤',
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
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.textMuted }}>
            Estimated Delivery
          </div>
          <div className="text-3xl font-extrabold" style={{ color: t.text }}>
            {ORDER.estimatedDate}
          </div>
          <div className="text-sm mt-1" style={{ color: t.textMuted }}>
            {ORDER.estimatedTime} · {ORDER.deliveryType}
          </div>
          <div
            className="mt-3 text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1"
            style={{ backgroundColor: isDark ? '#1A2E1A' : '#F0FBF0', color: COLORS.green }}
          >
            ☀️ Clear skies expected — great delivery day
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

// Animated truck along SVG route
function RouteVisualization({ isDark }) {
  const t = getTheme(isDark)
  const [truckPos, setTruckPos] = useState(0)

  useEffect(() => {
    let raf
    let start = null
    const duration = 3000

    function animate(ts) {
      if (!start) start = ts
      const elapsed = (ts - start) % (duration * 2)
      const progress = elapsed < duration
        ? elapsed / duration
        : 2 - elapsed / duration
      setTruckPos(progress)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Route path points
  const path = 'M 30 160 C 80 155 100 110 145 100 C 190 90 195 65 240 58 C 285 51 295 90 340 100'

  // Node positions
  const nodes = [
    { cx: 30,  cy: 160, label: 'Warehouse', icon: '📦', done: true },
    { cx: 145, cy: 100, label: 'Sorting',   icon: '🔄', done: true },
    { cx: 240, cy: 58,  label: 'On the way',icon: '🚚', done: true, active: true },
    { cx: 340, cy: 100, label: 'Your home', icon: '🏠', done: false },
  ]

  // Interpolate position along path (simplified linear interpolation for demo)
  const getPos = (t) => {
    // Cubic bezier approximation
    const p0 = { x: 30,  y: 160 }
    const p3 = { x: 340, y: 100 }
    const p1 = { x: 100, y: 110 }
    const p2 = { x: 295, y: 90 }
    const mt = 1 - t
    const x = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x
    const y = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y
    // Truck is at ~60% of the path (between node 2 and 3)
    const baseT = 0.55
    const rangeT = 0.1
    const actualT = baseT + rangeT * t
    const xA = mt*mt*mt*p0.x + 3*mt*mt*actualT*p1.x + 3*mt*actualT*actualT*p2.x + actualT*actualT*actualT*p3.x
    const yA = mt*mt*mt*p0.y + 3*mt*mt*actualT*p1.y + 3*mt*actualT*actualT*p2.y + actualT*actualT*actualT*p3.y
    return { x: xA, y: yA }
  }

  const truckXY = getPos(truckPos)

  return (
    <div
      className="rounded-2xl p-3 mx-0"
      style={{ backgroundColor: isDark ? '#0D1A2A' : '#EBF3FC' }}
    >
      <svg viewBox="0 0 380 200" width="100%" style={{ overflow: 'visible' }}>
        {/* Dashed background route */}
        <path
          d={path}
          fill="none"
          stroke={isDark ? '#2D3748' : '#CBD5E0'}
          strokeWidth="3"
          strokeDasharray="8 5"
        />
        {/* Completed route (up to truck) */}
        <path
          d="M 30 160 C 80 155 100 110 145 100 C 190 90 195 65 240 58"
          fill="none"
          stroke={COLORS.green}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            {n.active ? (
              <>
                <circle cx={n.cx} cy={n.cy} r="18" fill={COLORS.orange} opacity="0.2" />
                <circle cx={n.cx} cy={n.cy} r="13" fill={COLORS.orange} className="animate-glow-pulse" />
              </>
            ) : (
              <circle
                cx={n.cx} cy={n.cy} r="13"
                fill={n.done ? COLORS.green : (isDark ? '#2D3748' : '#CBD5E0')}
              />
            )}
            <text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize="11">
              {n.icon}
            </text>
            <text
              x={n.cx} y={n.cy + 26}
              textAnchor="middle"
              fontSize="8"
              fill={isDark ? '#8A9BB0' : '#565959'}
              fontFamily="Inter, sans-serif"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Animated truck */}
        <g transform={`translate(${truckXY.x - 12}, ${truckXY.y - 22})`} className="animate-truck-bounce">
          <rect x="0" y="4" width="24" height="14" rx="3" fill={COLORS.orange} />
          <rect x="16" y="0" width="10" height="11" rx="2" fill={COLORS.amber} />
          <circle cx="5"  cy="18" r="3.5" fill={isDark ? '#1A2332' : '#2D3748'} />
          <circle cx="19" cy="18" r="3.5" fill={isDark ? '#1A2332' : '#2D3748'} />
          <circle cx="5"  cy="18" r="1.5" fill="#fff" />
          <circle cx="19" cy="18" r="1.5" fill="#fff" />
        </g>

        {/* Stop dots ahead */}
        {[0.72, 0.82, 0.92].map((frac, i) => {
          const mt = 1 - frac
          const p0 = { x: 30, y: 160 }, p1 = { x: 100, y: 110 }, p2 = { x: 295, y: 90 }, p3 = { x: 340, y: 100 }
          const x = mt*mt*mt*p0.x + 3*mt*mt*frac*p1.x + 3*mt*frac*frac*p2.x + frac*frac*frac*p3.x
          const y = mt*mt*mt*p0.y + 3*mt*mt*frac*p1.y + 3*mt*frac*frac*p2.y + frac*frac*frac*p3.y
          return (
            <circle key={i} cx={x} cy={y} r="5"
              fill={isDark ? '#2D3748' : '#CBD5E0'}
              stroke={isDark ? '#4A5568' : '#A0AEC0'}
              strokeWidth="1.5"
            />
          )
        })}
      </svg>
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
          <StatusPill label="🚚 Out for Delivery" color="orange" pulse />
        </div>

        {/* Route visualization */}
        <div className="animate-fade-up-1">
          <RouteVisualization isDark={isDark} />
        </div>

        {/* ETA Card */}
        <InfoCard isDark={isDark} className="animate-slide-up">
          <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: t.textMuted }}>
            Estimated Arrival
          </div>
          <div className="text-2xl font-extrabold" style={{ color: t.text }}>
            {DRIVER.etaStart} – {DRIVER.etaEnd}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-xs flex items-center gap-1" style={{ color: t.textMuted }}>
              {weatherContext.icon} {weatherContext.condition} · {weatherContext.temp} · Good conditions
            </div>
            <div className="text-xs flex items-center gap-1" style={{ color: t.textMuted }}>
              🕐 {weatherContext.deliveryMessage}
            </div>
          </div>
        </InfoCard>

        {/* Driver info */}
        <InfoCard isDark={isDark} className="animate-fade-up-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: isDark ? '#243040' : '#F5F5F5' }}
            >
              🧑‍✈️
            </div>
            <div className="flex-1">
              <div className="text-xs" style={{ color: t.textMuted }}>Your driver</div>
              <div className="font-semibold text-sm" style={{ color: t.text }}>{DRIVER.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < Math.round(DRIVER.rating) ? COLORS.orange : 'none'}
                    stroke={COLORS.orange}
                  />
                ))}
                <span className="text-xs ml-1" style={{ color: t.textMuted }}>{DRIVER.rating}</span>
              </div>
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
                      <span className="text-lg">{step.icon}</span>
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
          <div className="text-4xl mb-3">⏱</div>
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
            <div className="text-2xl font-extrabold" style={{ color: t.text }}>
              {DELAY.newDate}
            </div>
            <div className="text-sm" style={{ color: t.textMuted }}>{DELAY.newTime}</div>
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
              { icon: '🔔', text: "We'll notify you when it's out for delivery" },
              { icon: '📦', text: 'Your item is secured at a local facility overnight' },
              { icon: '💳', text: 'No charges until delivery is confirmed' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
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
            It's here! 🎉
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
              Thanks for your feedback! ✨
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
