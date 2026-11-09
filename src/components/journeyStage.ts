// SVG stage of the export journey (from the Wahid Export 360 kit). Ids are prefixed "xj-".
/* eslint-disable */
export const STAGE_SVG = `

      <!-- ============ BACK LAYER (behind car) ============ -->
      <svg class="layer" viewBox="0 0 1600 900" id="xj-back">
        <defs>
          <radialGradient id="xj-spot" cx="50%" cy="0%" r="80%">
            <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="xj-skyport" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#eef2f2"/><stop offset="1" stop-color="#e3eaec"/>
          </linearGradient>
          <pattern id="xj-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#3f9c7f" stroke-opacity=".14" stroke-width="1"/>
          </pattern>
        </defs>

        <!-- solid studio backdrop: the car blends (multiply) against this, so keep it -->
        <rect x="-2000" y="-1000" width="5600" height="2900" fill="#f3f4f2"/>

        <!-- studio floor (intro / order / showroom) -->
        <g id="xj-gStudio">
          <ellipse cx="800" cy="650" rx="560" ry="46" fill="#e7e9e6"/>
        </g>

        <!-- inspection bay -->
        <g id="xj-gScanBay" opacity="0">
          <rect x="0" y="0" width="1600" height="900" fill="url(#xj-grid)"/>
          <ellipse cx="700" cy="650" rx="470" ry="44" fill="none" stroke="#3f9c7f" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 10"/>
          <!-- scan gantry -->
          <rect x="260" y="200" width="14" height="460" rx="4" fill="#cdd3cf"/>
          <rect x="1126" y="200" width="14" height="460" rx="4" fill="#cdd3cf"/>
          <rect x="260" y="192" width="880" height="16" rx="6" fill="#cdd3cf"/>
        </g>

        <!-- road to the port -->
        <g id="xj-gRoad" opacity="0">
          <rect x="0" y="0" width="1600" height="900" fill="url(#xj-skyport)"/>
          <g id="xj-hills" fill="#dfe6e4">
            <path d="M-400 600 C -200 470, 0 520, 200 560 C 400 470, 600 500, 800 560 C 1000 470, 1200 510, 1400 560 C 1600 470, 1800 520, 2000 600Z"/>
          </g>
          <rect x="0" y="690" width="1600" height="90" fill="#cfd5d2"/>
          <g id="xj-roadDash"></g>
          <g id="xj-poles"></g>
          <!-- port cranes arriving -->
          <g id="xj-cranes" fill="none" stroke="#9fb0a8" stroke-width="10" stroke-linejoin="round">
            <path d="M0 690 V360 H240 M60 360 L0 420 M120 690 V360"/>
            <path d="M300 690 V300 H560 M380 300 L300 380 M440 690 V300"/>
          </g>
        </g>

        <!-- sea + ship ramp + quay -->
        <g id="xj-gSea" opacity="0">
          <rect x="0" y="0" width="1600" height="900" fill="url(#xj-skyport)"/>
          <rect x="0" y="664" width="1600" height="236" fill="var(--sea)"/>
          <g id="xj-waves" fill="none" stroke="#b9d2dc" stroke-width="3" stroke-linecap="round"></g>
          <g id="xj-quay"><rect x="1330" y="664" width="400" height="236" fill="#cfd5d2"/><rect x="1330" y="660" width="400" height="8" fill="#b9c1bd"/></g>
          <g id="xj-shipBack">
            <!-- stern ramp -->
            <path id="xj-ramp" d="M1188 606 L1336 664 L1336 672 L1188 616Z" fill="#7d8984"/>
          </g>
        </g>

        <!-- customs -->
        <g id="xj-gCustoms" opacity="0">
          <rect x="0" y="690" width="1600" height="90" fill="#d6dbd8"/>
          <rect x="880" y="380" width="230" height="300" rx="10" fill="#e9ecea" stroke="#c9d0cc" stroke-width="3"/>
          <rect x="880" y="380" width="230" height="64" rx="10" fill="var(--brand)"/>
          <text class="t" x="995" y="421" text-anchor="middle" fill="#eef3f0" font-size="26" font-weight="800" letter-spacing="4">DOUANE</text>
          <rect x="910" y="470" width="170" height="90" rx="6" fill="#d5e3e8"/>
          <rect x="860" y="600" width="26" height="90" rx="6" fill="#0d1411"/>
        </g>

        <!-- showroom -->
        <g id="xj-gShow" opacity="0">
          <rect x="0" y="0" width="1600" height="660" fill="#eceeeb"/>
          <rect x="0" y="660" width="1600" height="240" fill="#e2e5e1"/>
          <text class="t" x="800" y="250" text-anchor="middle" fill="#0d1411" fill-opacity=".07" font-size="190" font-weight="800" letter-spacing="10">WAHID AUTO</text>
          <path d="M520 0 L380 660 H1220 L1080 0Z" fill="url(#xj-spot)" opacity=".9"/>
          <ellipse cx="800" cy="660" rx="520" ry="40" fill="#d5d9d4"/>
        </g>

        <!-- car carrier truck (drawn behind the car) -->
        <g id="xj-truck" opacity="0">
          <!-- local origin = deck top, centre -->
          <rect x="-230" y="0" width="600" height="18" rx="4" fill="#3b4642"/>
          <rect x="-230" y="18" width="600" height="20" fill="#26302c"/>
          <path d="M-390 38 V-70 Q-390 -120 -340 -120 H-262 Q-240 -120 -240 -98 V38Z" fill="#0d1411"/>
          <path d="M-376 -60 Q-376 -104 -336 -104 H-280 V-60Z" fill="#b8ccd4"/>
          <rect x="-392" y="10" width="160" height="12" fill="#3f9c7f"/>
          <g fill="#151c19" stroke="#8d9893" stroke-width="7">
            <circle cx="-320" cy="52" r="30"/><circle cx="160" cy="52" r="30"/><circle cx="235" cy="52" r="30"/><circle cx="310" cy="52" r="30"/>
          </g>
          <text class="t" x="70" y="34" text-anchor="middle" fill="#eef3f0" font-size="15" font-weight="800" letter-spacing="3">WAHID AUTO</text>
        </g>
      </svg>

      <!-- ============ CAR (8 frames, 45° apart) ============ -->
      <div class="car" id="xj-car"></div>

      <!-- ============ FRONT LAYER (in front of car) ============ -->
      <svg class="layer" viewBox="0 0 1600 900" id="xj-front">
        <defs>
          <linearGradient id="xj-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#3f9c7f" stop-opacity="0"/>
            <stop offset=".5" stop-color="#3f9c7f" stop-opacity=".55"/>
            <stop offset="1" stop-color="#3f9c7f" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- inspection: scanning beam + hotspots + checklist -->
        <g id="xj-gScan" opacity="0">
          <g id="xj-beamG">
            <rect x="-60" y="200" width="120" height="470" fill="url(#xj-beam)"/>
            <rect x="-1.5" y="200" width="3" height="470" fill="#3f9c7f"/>
          </g>
          <g id="xj-hotspots"></g>
        </g>

        <!-- RoRo ship hull + superstructure (car disappears behind it) -->
        <g id="xj-ship" opacity="0">
          <path d="M150 560 H1192 V620 L1150 700 H260 Q190 640 150 560Z" fill="#0d1411"/>
          <rect x="150" y="652" width="1040" height="14" fill="#b3261e" opacity=".85"/>
          <path d="M250 330 H1180 V560 H200 Q205 420 250 330Z" fill="#f7f8f6" stroke="#c7cfcb" stroke-width="3"/>
          <g fill="#c5d0cc"><rect x="300" y="380" width="840" height="6"/><rect x="300" y="440" width="840" height="6"/><rect x="300" y="500" width="840" height="6"/></g>
          <path d="M290 330 V270 H470 V330Z" fill="#f7f8f6" stroke="#c7cfcb" stroke-width="3"/>
          <rect x="300" y="284" width="160" height="20" rx="3" fill="#b8ccd4"/>
          <rect x="1040" y="250" width="56" height="80" fill="#0d1411"/>
          <rect x="1040" y="262" width="56" height="12" fill="#3f9c7f"/>
          <text class="t" x="720" y="620" text-anchor="middle" fill="#eef3f0" font-size="30" font-weight="800" letter-spacing="8">KOREA ⟶ ALGERIA</text>
        </g>

        <!-- customs barrier arm -->
        <g id="xj-barrier" opacity="0" transform="translate(873 612)">
          <g id="xj-arm"><rect x="0" y="-9" width="520" height="18" rx="9" fill="#ffffff" stroke="#0d1411" stroke-width="3"/>
            <g fill="#b3261e"><rect x="60" y="-6" width="40" height="12"/><rect x="180" y="-6" width="40" height="12"/><rect x="300" y="-6" width="40" height="12"/><rect x="420" y="-6" width="40" height="12"/></g>
          </g>
          <circle r="16" fill="#0d1411"/>
        </g>
      </svg>

      <!-- ============ HUD (chat, documents, stamp, map, checklist) ============ -->
      <svg class="layer" viewBox="0 0 1600 900" id="xj-hud">
        <!-- order chat -->
        <g id="xj-chat1" opacity="0" transform="translate(560 250)">
          <rect width="440" height="78" rx="24" fill="#ffffff" stroke="#dfe3e0" stroke-width="2"/>
          <text class="t t-i18n" x="220" y="48" text-anchor="middle" font-size="22" fill="#0d1411" data-i18n-svg="chat1"></text>
        </g>
        <g id="xj-chat2" opacity="0" transform="translate(620 345)">
          <rect width="420" height="78" rx="24" fill="#3f9c7f"/>
          <text class="t t-i18n" x="210" y="48" text-anchor="middle" font-size="22" fill="#ffffff" font-weight="600" data-i18n-svg="chat2"></text>
        </g>

        <!-- inspection checklist -->
        <g id="xj-checklist" opacity="0" transform="translate(1150 300)"></g>

        <!-- export document + stamp -->
        <g id="xj-doc" opacity="0" transform="translate(1110 262)">
          <rect width="330" height="420" rx="14" fill="#ffffff" stroke="#dfe3e0" stroke-width="2"/>
          <text class="t" x="28" y="56" font-size="20" font-weight="800" fill="#0d1411" letter-spacing="2">EXPORT CERTIFICATE</text>
          <g fill="#e6e9e7"><rect x="28" y="88" width="274" height="12" rx="6"/><rect x="28" y="116" width="220" height="12" rx="6"/><rect x="28" y="144" width="250" height="12" rx="6"/><rect x="28" y="190" width="274" height="12" rx="6"/><rect x="28" y="218" width="180" height="12" rx="6"/><rect x="28" y="246" width="230" height="12" rx="6"/></g>
          <g id="xj-stamp" transform="translate(220 330)" opacity="0">
            <g transform="rotate(-14)">
              <circle r="74" fill="none" stroke="#b3261e" stroke-width="6"/>
              <circle r="60" fill="none" stroke="#b3261e" stroke-width="2"/>
              <text class="t" y="-12" text-anchor="middle" font-size="18" font-weight="800" fill="#b3261e" letter-spacing="3">WAHID AUTO</text>
              <text class="t" y="18" text-anchor="middle" font-size="22" font-weight="800" fill="#b3261e" letter-spacing="2">EXPORT ✓</text>
            </g>
          </g>
        </g>

        <!-- sailing map -->
        <g id="xj-map" opacity="0" transform="translate(500 120)">
          <rect width="600" height="120" rx="20" fill="#ffffff" fill-opacity=".9" stroke="#dfe3e0" stroke-width="2"/>
          <path id="xj-mapRoute" d="M540 70 C 430 10, 170 10, 60 70" fill="none" stroke="#c9d0cc" stroke-width="3" stroke-dasharray="4 8"/>
          <path id="xj-mapDone" d="M540 70 C 430 10, 170 10, 60 70" fill="none" stroke="#3f9c7f" stroke-width="3"/>
          <circle cx="540" cy="70" r="7" fill="#0d1411"/><circle cx="60" cy="70" r="7" fill="#0d1411"/>
          <text class="t" x="540" y="104" text-anchor="middle" font-size="15" font-weight="800" letter-spacing="2">KR</text>
          <text class="t" x="60" y="104" text-anchor="middle" font-size="15" font-weight="800" letter-spacing="2">DZ</text>
          <g id="xj-mapShip"><circle r="13" fill="#3f9c7f"/><path d="M-7 1 H7 L4 6 H-4Z M-4 -1 V-5 H3 V-1Z" fill="#fff"/></g>
        </g>

        <!-- customs stamp -->
        <g id="xj-stamp2" opacity="0" transform="translate(1250 440)">
          <g transform="rotate(10)">
            <rect x="-150" y="-50" width="300" height="100" rx="12" fill="none" stroke="#3f9c7f" stroke-width="6"/>
            <text class="t t-i18n" y="12" text-anchor="middle" font-size="30" font-weight="800" fill="#3f9c7f" data-i18n-svg="cleared"></text>
          </g>
        </g>

        <!-- delivered badge -->
        <g id="xj-keys" opacity="0" transform="translate(800 790)">
          <rect x="-190" y="-34" width="380" height="68" rx="34" fill="#0d1411"/>
          <text class="t t-i18n" y="10" text-anchor="middle" font-size="24" font-weight="700" fill="#ffffff" data-i18n-svg="delivered"></text>
        </g>
      </svg>
`
