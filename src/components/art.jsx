import { motion } from "framer-motion";

/**
 * Hand-built SVG artwork for each kind of project.
 *
 * Drawn rather than photographed so nothing depends on an external image host,
 * everything loads instantly on slow connections, and the pieces can animate.
 */

const ease = [0.22, 1, 0.36, 1];

/** Shared canvas: soft tinted ground with a faint horizon glow. */
function Scene({ id, children, tint = "#eff4ff" }) {
  return (
    <svg
      viewBox="0 0 400 240"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint} />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={`${id}-brand`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b6ef5" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id}-bg)`} />
      <circle cx="330" cy="30" r="72" fill="#1d4ed8" opacity="0.06" />
      {children}
    </svg>
  );
}

/* ---------------- Tracking: a route with a vehicle running along it --------------- */
function TrackingArt() {
  const route = "M40 190 C110 190 100 110 170 110 S260 150 300 70";
  return (
    <Scene id="track">
      {[70, 110, 150, 190].map((y) => (
        <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="#1d4ed8" strokeWidth="1" opacity="0.07" />
      ))}
      {[80, 160, 240, 320].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="220" stroke="#1d4ed8" strokeWidth="1" opacity="0.07" />
      ))}
      <path d={route} fill="none" stroke="#bdd0fe" strokeWidth="6" strokeLinecap="round" />
      <motion.path
        d={route}
        fill="none"
        stroke="url(#track-brand)"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease }}
      />
      <circle cx="40" cy="190" r="7" fill="#fff" stroke="#1d4ed8" strokeWidth="3" />
      <motion.g
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{ offsetPath: `path("${route}")`, offsetRotate: "0deg" }}
      >
        <circle r="13" fill="#1d4ed8" opacity="0.18" />
        <circle r="7" fill="#1d4ed8" />
        <circle r="3" fill="#fff" />
      </motion.g>
      <g transform="translate(276,46)">
        <path d="M24 12a12 12 0 1 0-24 0c0 9 12 22 12 22S24 21 24 12Z" fill="url(#track-brand)" />
        <circle cx="12" cy="12" r="4.5" fill="#fff" />
      </g>
    </Scene>
  );
}

/* ---------------- Banking: statement rows and a card ---------------- */
function BankingArt() {
  return (
    <Scene id="bank">
      <rect x="40" y="46" width="230" height="150" rx="12" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
      <rect x="58" y="66" width="70" height="8" rx="4" fill="#bdd0fe" />
      <rect x="58" y="84" width="120" height="14" rx="6" fill="#1d4ed8" opacity="0.85" />
      {[118, 144, 170].map((y, i) => (
        <g key={y}>
          <circle cx="68" cy={y + 5} r="7" fill="#eff4ff" />
          <motion.rect
            x="86"
            y={y}
            height="9"
            rx="4.5"
            fill="#e5e9f0"
            initial={{ width: 0 }}
            whileInView={{ width: [110, 140, 96][i] }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease }}
          />
          <rect x="236" y={y} width="22" height="9" rx="4.5" fill="#bdd0fe" />
        </g>
      ))}
      <motion.g
        initial={{ y: 14, opacity: 0, rotate: -8 }}
        whileInView={{ y: 0, opacity: 1, rotate: -8 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3, ease }}
      >
        <rect x="236" y="96" width="132" height="84" rx="12" fill="url(#bank-brand)" />
        <rect x="250" y="116" width="34" height="24" rx="5" fill="#fff" opacity="0.5" />
        <rect x="250" y="152" width="82" height="8" rx="4" fill="#fff" opacity="0.65" />
        <circle cx="336" cy="156" r="11" fill="#fff" opacity="0.45" />
        <circle cx="350" cy="156" r="11" fill="#fff" opacity="0.3" />
      </motion.g>
    </Scene>
  );
}

/* ---------------- Store: product grid and a cart badge ---------------- */
function StoreArt() {
  return (
    <Scene id="store">
      <rect x="44" y="40" width="312" height="162" rx="12" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <motion.g
            key={`${c}-${r}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * (c + r * 3), ease }}
          >
            <rect x={64 + c * 96} y={60 + r * 72} width="76" height="46" rx="8" fill="#eff4ff" />
            <rect x={64 + c * 96} y={112 + r * 72} width="48" height="7" rx="3.5" fill="#e5e9f0" />
            <rect x={64 + c * 96} y={124 + r * 72} width="28" height="7" rx="3.5" fill="#bdd0fe" />
          </motion.g>
        )),
      )}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.7 }}
      >
        <circle cx="336" cy="60" r="24" fill="url(#store-brand)" />
        <path
          d="M326 52h4l3 14h10l3-9"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="335" cy="70" r="2.2" fill="#fff" />
        <circle cx="343" cy="70" r="2.2" fill="#fff" />
      </motion.g>
    </Scene>
  );
}

/* ---------------- Marketing: a chart climbing ---------------- */
function GrowthArt() {
  const bars = [36, 58, 48, 84, 108, 136];
  return (
    <Scene id="grow">
      <line x1="44" y1="196" x2="360" y2="196" stroke="#e5e9f0" strokeWidth="2" />
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={62 + i * 50}
          width="30"
          rx="6"
          fill={i === bars.length - 1 ? "url(#grow-brand)" : "#bdd0fe"}
          initial={{ height: 0, y: 196 }}
          whileInView={{ height: h, y: 196 - h }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.09, ease }}
        />
      ))}
      <motion.path
        d="M77 160 L127 138 L177 148 L227 112 L277 88 L327 60"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease }}
      />
      <motion.circle
        cx="327"
        cy="60"
        r="8"
        fill="#1d4ed8"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.5 }}
      />
    </Scene>
  );
}

/* ---------------- Mobile: two phones ---------------- */
function MobileArt() {
  return (
    <Scene id="mob">
      <motion.g
        initial={{ y: 20, opacity: 0, rotate: -6 }}
        whileInView={{ y: 0, opacity: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
      >
        <rect x="112" y="46" width="88" height="160" rx="16" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
        <rect x="124" y="66" width="64" height="40" rx="8" fill="#eff4ff" />
        <rect x="124" y="116" width="52" height="8" rx="4" fill="#e5e9f0" />
        <rect x="124" y="132" width="36" height="8" rx="4" fill="#bdd0fe" />
        <rect x="124" y="160" width="64" height="22" rx="8" fill="url(#mob-brand)" />
      </motion.g>
      <motion.g
        initial={{ y: 24, opacity: 0, rotate: 7 }}
        whileInView={{ y: 0, opacity: 1, rotate: 7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.14, ease }}
      >
        <rect x="204" y="58" width="88" height="160" rx="16" fill="url(#mob-brand)" />
        <rect x="216" y="80" width="64" height="9" rx="4.5" fill="#fff" opacity="0.85" />
        <rect x="216" y="98" width="42" height="9" rx="4.5" fill="#fff" opacity="0.5" />
        <circle cx="248" cy="150" r="26" fill="#fff" opacity="0.2" />
        <path
          d="M238 150l7 7 14-15"
          fill="none"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </Scene>
  );
}

/* ---------------- School: report card and marks ---------------- */
function SchoolArt() {
  return (
    <Scene id="school">
      <motion.path
        d="M200 44 L272 74 L200 104 L128 74 Z"
        fill="url(#school-brand)"
        initial={{ y: -14, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      />
      <path d="M266 76v26" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      <rect x="92" y="118" width="216" height="88" rx="12" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="110" y={136 + i * 24} width="96" height="9" rx="4.5" fill="#e5e9f0" />
          <motion.rect
            x="228"
            y={136 + i * 24}
            height="9"
            rx="4.5"
            fill="#1d4ed8"
            opacity={0.9 - i * 0.22}
            initial={{ width: 0 }}
            whileInView={{ width: [62, 44, 54][i] }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease }}
          />
        </g>
      ))}
    </Scene>
  );
}

/* ---------------- Restaurant: menu card and cover ---------------- */
function RestaurantArt() {
  return (
    <Scene id="rest">
      <motion.g
        initial={{ scale: 0.92, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <circle cx="200" cy="122" r="66" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
        <circle cx="200" cy="122" r="44" fill="#eff4ff" />
        <circle cx="200" cy="122" r="22" fill="url(#rest-brand)" opacity="0.85" />
      </motion.g>
      <motion.g
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <rect x="76" y="94" width="10" height="58" rx="5" fill="#bdd0fe" />
        <rect x="94" y="94" width="10" height="58" rx="5" fill="#bdd0fe" />
      </motion.g>
      <motion.g
        initial={{ x: 10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <path d="M312 94c-12 0-18 12-18 24s6 16 12 16v18a6 6 0 0 0 12 0V94Z" fill="#bdd0fe" />
      </motion.g>
    </Scene>
  );
}

/* ---------------- Telecom: globe with signal ---------------- */
function GlobeArt() {
  return (
    <Scene id="globe">
      <circle cx="200" cy="124" r="62" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
      <ellipse cx="200" cy="124" rx="62" ry="24" fill="none" stroke="#bdd0fe" strokeWidth="2" />
      <ellipse cx="200" cy="124" rx="28" ry="62" fill="none" stroke="#bdd0fe" strokeWidth="2" />
      <line x1="138" y1="124" x2="262" y2="124" stroke="#bdd0fe" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="200"
          cy="124"
          r="62"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="2"
          initial={{ scale: 0.6, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }}
          style={{ transformOrigin: "200px 124px" }}
        />
      ))}
      <circle cx="232" cy="96" r="8" fill="url(#globe-brand)" />
      <circle cx="166" cy="146" r="6" fill="#1d4ed8" opacity="0.6" />
    </Scene>
  );
}

/* ---------------- Care: shield ---------------- */
function CareArt() {
  return (
    <Scene id="care">
      <motion.path
        d="M200 52l58 22v42c0 38-26 62-58 72-32-10-58-34-58-72V74l58-22Z"
        fill="#fff"
        stroke="#e5e9f0"
        strokeWidth="2"
        initial={{ y: 12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      />
      <motion.path
        d="M200 66l44 17v32c0 29-20 47-44 55-24-8-44-26-44-55V83l44-17Z"
        fill="url(#care-brand)"
        opacity="0.12"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        style={{ transformOrigin: "200px 124px" }}
      />
      <motion.path
        d="M178 126l15 15 30-32"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.35, ease }}
      />
    </Scene>
  );
}

/* ---------------- Generic: a website being assembled ---------------- */
function SiteArt() {
  return (
    <Scene id="site">
      <rect x="56" y="44" width="288" height="154" rx="12" fill="#fff" stroke="#e5e9f0" strokeWidth="2" />
      <path d="M56 56a12 12 0 0 1 12-12h264a12 12 0 0 1 12 12v14H56V56Z" fill="#eff4ff" />
      {[76, 92, 108].map((cx, i) => (
        <circle key={cx} cx={cx} cy="57" r="4" fill={["#bdd0fe", "#90aefc", "#3b6ef5"][i]} />
      ))}
      <motion.rect
        x="76"
        y="92"
        height="14"
        rx="7"
        fill="url(#site-brand)"
        initial={{ width: 0 }}
        whileInView={{ width: 130 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      />
      {[118, 136].map((y, i) => (
        <motion.rect
          key={y}
          x="76"
          y={y}
          height="8"
          rx="4"
          fill="#e5e9f0"
          initial={{ width: 0 }}
          whileInView={{ width: [186, 142][i] }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease }}
        />
      ))}
      <motion.rect
        x="76"
        y="160"
        width="82"
        height="24"
        rx="8"
        fill="url(#site-brand)"
        initial={{ opacity: 0, y: 168 }}
        whileInView={{ opacity: 1, y: 160 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.55, ease }}
      />
      <rect x="248" y="92" width="76" height="92" rx="10" fill="#eff4ff" />
    </Scene>
  );
}

const byService = {
  "svc-tracking": TrackingArt,
  "svc-banking": BankingArt,
  "svc-ecommerce": StoreArt,
  "svc-spare-parts": StoreArt,
  "svc-school": SchoolArt,
  "svc-restaurant": RestaurantArt,
  "svc-mobile-app": MobileArt,
  "svc-seo": GrowthArt,
  "svc-google-ads": GrowthArt,
  "svc-ranking": GrowthArt,
  "svc-google-business": GlobeArt,
  "svc-esim": GlobeArt,
  "svc-care": CareArt,
};

/** Artwork for a service, falling back to the generic website scene. */
export function ServiceArt({ serviceId }) {
  const Art = byService[serviceId] ?? SiteArt;
  return <Art />;
}

export { TrackingArt, BankingArt, StoreArt, GrowthArt, MobileArt, GlobeArt, SiteArt };
