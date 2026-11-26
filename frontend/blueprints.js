window.TRUCK_BLUEPRINTS = {
  Scania: {
    specs: {
      title: "SCANIA S730 / R500 V8",
      engine: "16.4L DC16 V8 TURBO",
      axle: "6x4 HEAVY TRACTOR",
      gvm: "44,000 KG GCM",
      wheelbase: "3,350 MM"
    },
    svg: `<svg viewBox="0 0 780 285" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- CAD Corner Registration Marks & Centerlines -->
      <path d="M22 18 H46 M22 18 V42 M758 18 H734 M758 18 V42 M22 266 H46 M22 266 V242 M758 266 H734 M758 266 V242" stroke="#363940" stroke-width="1"/>
      <line x1="55" y1="206" x2="725" y2="206" stroke="#25282e" stroke-width="1"/>

      <!-- Main Ladder Chassis Rail & Crossmembers -->
      <rect x="64" y="180" width="600" height="13" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.3"/>
      <line x1="64" y1="186" x2="664" y2="186" stroke="#4b5563" stroke-width="0.9" stroke-dasharray="5 3"/>

      <!-- Fifth Wheel Coupling & Heavy Mounting Plate -->
      <path d="M132 180 L170 162 H236 L252 180 Z" fill="#18191d" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M164 157 H242 L248 162 H160 Z" fill="#262930" stroke="#f3f4f6" stroke-width="1.4"/>
      <circle cx="202" cy="171" r="4" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <!-- Rear Tandem Fenders & Mudflaps -->
      <path d="M68 196 A48 48 0 0 1 164 196" stroke="#6b7280" stroke-width="1.4"/>
      <path d="M170 196 A48 48 0 0 1 266 196" stroke="#6b7280" stroke-width="1.4"/>
      <rect x="64" y="196" width="5" height="32" fill="#0d0e10" stroke="#6b7280" stroke-width="1"/>
      <rect x="262" y="196" width="5" height="32" fill="#0d0e10" stroke="#6b7280" stroke-width="1"/>

      <!-- Aluminum Fuel Tank, Straps & AdBlue / Battery Module -->
      <rect x="280" y="164" width="134" height="38" rx="5" fill="#16181c" stroke="#f3f4f6" stroke-width="1.4"/>
      <line x1="312" y1="164" x2="312" y2="202" stroke="#9ca3af" stroke-width="1.4"/>
      <line x1="382" y1="164" x2="382" y2="202" stroke="#9ca3af" stroke-width="1.4"/>
      <rect x="342" y="160" width="12" height="4" fill="#262930" stroke="#9ca3af" stroke-width="1"/>
      <rect x="422" y="166" width="44" height="34" rx="2" fill="#121316" stroke="#9ca3af" stroke-width="1.2"/>

      <!-- Vertical Exhaust Stack & Aero Cab Fairing -->
      <rect x="454" y="54" width="7" height="114" fill="#18191d" stroke="#9ca3af" stroke-width="1.2"/>
      <path d="M470 42 C442 52 436 96 434 166" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="3 3"/>

      <!-- Scania Highline S-Series Cab Shell -->
      <path d="M470 184 V44 C470 33 480 28 495 28 H586 L646 84 L668 144 V200 H470 Z" fill="#15171b" stroke="#f3f4f6" stroke-width="1.6"/>
      <!-- Roof Light Bar & Sun Visor -->
      <path d="M582 28 L610 46 H584 Z" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      <path d="M624 72 L648 84 L642 90 L620 78 Z" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <!-- Side Window, Door Seam & Handle -->
      <path d="M566 54 H590 L636 96 V130 H566 Z" fill="#0c0d0f" stroke="#d1d5db" stroke-width="1.3"/>
      <line x1="604" y1="68" x2="604" y2="130" stroke="#4b5563" stroke-width="1"/>
      <line x1="556" y1="50" x2="556" y2="196" stroke="#6b7280" stroke-width="1.1"/>
      <rect x="564" y="142" width="14" height="4" fill="#262930" stroke="#9ca3af" stroke-width="1"/>

      <!-- Aerodynamic Mirror Housing -->
      <rect x="622" y="76" width="11" height="36" rx="2" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>
      <line x1="612" y1="84" x2="622" y2="84" stroke="#9ca3af" stroke-width="1.2"/>

      <!-- Scania Signature Wrap-Around Grille Louvers & Headlamp -->
      <path d="M632 136 H666 M634 146 H667 M636 156 H668 M638 166 H668" stroke="#d1d5db" stroke-width="1.4"/>
      <path d="M640 176 H668 V194 H640 Z" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>
      <line x1="644" y1="184" x2="664" y2="184" stroke="#9ca3af" stroke-width="1.2"/>

      <!-- Illuminated Entry Steps -->
      <rect x="568" y="176" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>
      <rect x="568" y="187" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <!-- Front Steer Fender -->
      <path d="M544 200 A48 48 0 0 1 640 200" stroke="#9ca3af" stroke-width="1.4"/>

      <!-- Heavy-Duty 6x4 Multi-Ring Wheels & Hubs -->
      <g>
        <circle cx="116" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="116" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="116" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="116" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="218" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="218" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="218" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="218" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="592" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="592" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="592" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="592" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      </g>

      <!-- CAD Dimension Callout -->
      <line x1="116" y1="254" x2="592" y2="254" stroke="#6b7280" stroke-width="1"/>
      <line x1="116" y1="246" x2="116" y2="260" stroke="#6b7280" stroke-width="1"/>
      <line x1="218" y1="246" x2="218" y2="260" stroke="#6b7280" stroke-width="1"/>
      <line x1="592" y1="246" x2="592" y2="260" stroke="#6b7280" stroke-width="1"/>
      <text x="405" y="249" fill="#9ca3af" font-family="monospace" font-size="9" text-anchor="middle">WHEELBASE 3,350 MM // AXLE LOAD 26,000 KG</text>
    </svg>`
  },

  Iveco: {
    specs: {
      title: "IVECO S-WAY / STRALIS 480",
      engine: "12.9L CURSOR 13",
      axle: "6x4 LONG-HAUL TRACTOR",
      gvm: "44,000 KG GCM",
      wheelbase: "3,500 MM"
    },
    svg: `<svg viewBox="0 0 780 285" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 18 H46 M22 18 V42 M758 18 H734 M758 18 V42 M22 266 H46 M22 266 V242 M758 266 H734 M758 266 V242" stroke="#363940" stroke-width="1"/>
      <line x1="55" y1="206" x2="725" y2="206" stroke="#25282e" stroke-width="1"/>
      <rect x="64" y="180" width="600" height="13" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.3"/>
      <path d="M132 180 L170 162 H236 L252 180 Z" fill="#18191d" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M164 157 H242 L248 162 H160 Z" fill="#262930" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M68 196 A48 48 0 0 1 164 196" stroke="#6b7280" stroke-width="1.4"/>
      <path d="M170 196 A48 48 0 0 1 266 196" stroke="#6b7280" stroke-width="1.4"/>
      <rect x="278" y="164" width="142" height="38" rx="4" fill="#16181c" stroke="#f3f4f6" stroke-width="1.4"/>
      <line x1="322" y1="164" x2="322" y2="202" stroke="#9ca3af" stroke-width="1.4"/>
      <line x1="386" y1="164" x2="386" y2="202" stroke="#9ca3af" stroke-width="1.4"/>

      <!-- Iveco S-Way Raked Aero Cab -->
      <path d="M466 184 V40 C466 33 476 30 490 30 H576 L654 96 L672 200 H466 Z" fill="#15171b" stroke="#f3f4f6" stroke-width="1.6"/>
      <path d="M466 42 Q436 56 430 166" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="3 3"/>
      <path d="M562 54 H584 L642 102 V132 H562 Z" fill="#0c0d0f" stroke="#d1d5db" stroke-width="1.3"/>
      <!-- S-Way V-Profile Grille -->
      <path d="M628 138 H666 M632 148 H668 M636 158 H670 M640 168 H671" stroke="#d1d5db" stroke-width="1.4"/>
      <path d="M642 178 H672 V195 H642 Z" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>
      <rect x="620" y="76" width="10" height="34" rx="2" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>
      <rect x="566" y="178" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>
      <rect x="566" y="188" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <g>
        <circle cx="116" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="116" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="116" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="116" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="218" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="218" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="218" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="218" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="592" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="592" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="592" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="592" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      </g>
      <line x1="116" y1="254" x2="592" y2="254" stroke="#6b7280" stroke-width="1"/>
      <text x="405" y="249" fill="#9ca3af" font-family="monospace" font-size="9" text-anchor="middle">WHEELBASE 3,500 MM // CURSOR 13 HI-SCR</text>
    </svg>`
  },

  Volvo: {
    specs: {
      title: "VOLVO FH16 GLOBETROTTER",
      engine: "16.1L D16K 750HP",
      axle: "6x4 HEAVY TRACTOR",
      gvm: "48,000 KG GCM",
      wheelbase: "3,400 MM"
    },
    svg: `<svg viewBox="0 0 780 285" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 18 H46 M22 18 V42 M758 18 H734 M758 18 V42 M22 266 H46 M22 266 V242 M758 266 H734 M758 266 V242" stroke="#363940" stroke-width="1"/>
      <line x1="55" y1="206" x2="725" y2="206" stroke="#25282e" stroke-width="1"/>
      <rect x="64" y="180" width="600" height="13" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.3"/>
      <path d="M132 180 L170 162 H236 L252 180 Z" fill="#18191d" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M164 157 H242 L248 162 H160 Z" fill="#262930" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M68 196 A48 48 0 0 1 164 196" stroke="#6b7280" stroke-width="1.4"/>
      <path d="M170 196 A48 48 0 0 1 266 196" stroke="#6b7280" stroke-width="1.4"/>
      <rect x="275" y="163" width="144" height="39" rx="4" fill="#16181c" stroke="#f3f4f6" stroke-width="1.4"/>
      <line x1="320" y1="163" x2="320" y2="202" stroke="#9ca3af" stroke-width="1.4"/>

      <!-- Volvo FH16 Globetrotter XL Cab -->
      <path d="M468 184 V34 H576 L648 96 L666 200 H468 Z" fill="#15171b" stroke="#f3f4f6" stroke-width="1.6"/>
      <path d="M562 52 H582 L638 100 V132 H562 Z" fill="#0c0d0f" stroke="#d1d5db" stroke-width="1.3"/>
      <!-- Volvo Iron Mark Diagonal Sash & V-Shaped DRL -->
      <line x1="630" y1="136" x2="664" y2="194" stroke="#f3f4f6" stroke-width="1.6"/>
      <path d="M644 172 L666 184 L644 194" stroke="#d1d5db" stroke-width="1.3"/>
      <rect x="620" y="76" width="10" height="36" rx="2" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>
      <rect x="568" y="178" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>
      <rect x="568" y="188" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <g>
        <circle cx="116" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="116" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="116" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="116" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="218" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="218" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="218" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="218" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="592" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="592" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="592" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="592" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      </g>
      <line x1="116" y1="254" x2="592" y2="254" stroke="#6b7280" stroke-width="1"/>
      <text x="405" y="249" fill="#9ca3af" font-family="monospace" font-size="9" text-anchor="middle">WHEELBASE 3,400 MM // I-SHIFT CRAWLER</text>
    </svg>`
  },

  Mercedes: {
    specs: {
      title: "MERCEDES-BENZ ACTROS 2653",
      engine: "15.6L OM473 INLINE-6",
      axle: "6x4 GIGASPACE",
      gvm: "44,000 KG GCM",
      wheelbase: "3,300 MM"
    },
    svg: `<svg viewBox="0 0 780 285" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 18 H46 M22 18 V42 M758 18 H734 M758 18 V42 M22 266 H46 M22 266 V242 M758 266 H734 M758 266 V242" stroke="#363940" stroke-width="1"/>
      <line x1="55" y1="206" x2="725" y2="206" stroke="#25282e" stroke-width="1"/>
      <rect x="64" y="180" width="600" height="13" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.3"/>
      <path d="M132 180 L170 162 H236 L252 180 Z" fill="#18191d" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M68 196 A48 48 0 0 1 164 196" stroke="#6b7280" stroke-width="1.4"/>
      <path d="M170 196 A48 48 0 0 1 266 196" stroke="#6b7280" stroke-width="1.4"/>
      <rect x="282" y="164" width="136" height="38" rx="4" fill="#16181c" stroke="#f3f4f6" stroke-width="1.4"/>

      <!-- Actros GigaSpace Cab + MirrorCam Wing -->
      <path d="M470 184 V32 H592 L652 86 L666 200 H470 Z" fill="#15171b" stroke="#f3f4f6" stroke-width="1.6"/>
      <path d="M578 48 H598 L644 90 V128 H578 Z" fill="#0c0d0f" stroke="#d1d5db" stroke-width="1.3"/>
      <!-- MirrorCam Camera Arm -->
      <path d="M574 62 H548 V70 H574" fill="#1f2228" stroke="#f3f4f6" stroke-width="1.3"/>
      <line x1="638" y1="140" x2="665" y2="140" stroke="#d1d5db" stroke-width="1.3"/>
      <line x1="640" y1="152" x2="666" y2="152" stroke="#d1d5db" stroke-width="1.3"/>
      <line x1="642" y1="164" x2="666" y2="164" stroke="#d1d5db" stroke-width="1.3"/>
      <rect x="568" y="178" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>
      <rect x="568" y="188" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <g>
        <circle cx="116" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="116" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="116" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="116" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="218" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="218" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="218" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="218" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="592" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="592" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="592" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="592" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      </g>
      <line x1="116" y1="254" x2="592" y2="254" stroke="#6b7280" stroke-width="1"/>
      <text x="405" y="249" fill="#9ca3af" font-family="monospace" font-size="9" text-anchor="middle">WHEELBASE 3,300 MM // POWERSHIFT 3</text>
    </svg>`
  },

  MAN: {
    specs: {
      title: "MAN TGX 26.540",
      engine: "12.4L D2676 INLINE-6",
      axle: "6x4 GX CAB",
      gvm: "44,000 KG GCM",
      wheelbase: "3,300 MM"
    },
    svg: `<svg viewBox="0 0 780 285" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 18 H46 M22 18 V42 M758 18 H734 M758 18 V42 M22 266 H46 M22 266 V242 M758 266 H734 M758 266 V242" stroke="#363940" stroke-width="1"/>
      <line x1="55" y1="206" x2="725" y2="206" stroke="#25282e" stroke-width="1"/>
      <rect x="64" y="180" width="600" height="13" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.3"/>
      <path d="M132 180 L170 162 H236 L252 180 Z" fill="#18191d" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M68 196 A48 48 0 0 1 164 196" stroke="#6b7280" stroke-width="1.4"/>
      <path d="M170 196 A48 48 0 0 1 266 196" stroke="#6b7280" stroke-width="1.4"/>
      <rect x="280" y="164" width="138" height="38" rx="4" fill="#16181c" stroke="#f3f4f6" stroke-width="1.4"/>

      <!-- MAN TGX GX Cab -->
      <path d="M472 184 V36 H590 L650 88 L666 200 H472 Z" fill="#15171b" stroke="#f3f4f6" stroke-width="1.6"/>
      <path d="M574 52 H594 L642 94 V128 H574 Z" fill="#0c0d0f" stroke="#d1d5db" stroke-width="1.3"/>
      <rect x="634" y="132" width="30" height="14" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.2"/>
      <rect x="620" y="76" width="10" height="34" rx="2" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>
      <rect x="568" y="178" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>
      <rect x="568" y="188" width="38" height="7" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.1"/>

      <g>
        <circle cx="116" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="116" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="116" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="116" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="218" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="218" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="218" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="218" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="592" cy="206" r="34" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="592" cy="206" r="24" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="592" cy="206" r="15" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="592" cy="206" r="6" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      </g>
      <line x1="116" y1="254" x2="592" y2="254" stroke="#6b7280" stroke-width="1"/>
      <text x="405" y="249" fill="#9ca3af" font-family="monospace" font-size="9" text-anchor="middle">WHEELBASE 3,300 MM // TIPMATIC 12</text>
    </svg>`
  },

  Isuzu: {
    specs: {
      title: "ISUZU GIGA / FXZ 28-360",
      engine: "9.8L 6UZ1-TC",
      axle: "6x4 FREIGHT CARRIER",
      gvm: "36,000 KG GCM",
      wheelbase: "3,850 MM"
    },
    svg: `<svg viewBox="0 0 780 285" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 18 H46 M22 18 V42 M758 18 H734 M758 18 V42 M22 266 H46 M22 266 V242 M758 266 H734 M758 266 V242" stroke="#363940" stroke-width="1"/>
      <line x1="55" y1="206" x2="725" y2="206" stroke="#25282e" stroke-width="1"/>
      <rect x="64" y="180" width="600" height="13" fill="#0d0e10" stroke="#9ca3af" stroke-width="1.3"/>
      <path d="M68 196 A48 48 0 0 1 164 196" stroke="#6b7280" stroke-width="1.4"/>
      <path d="M170 196 A48 48 0 0 1 266 196" stroke="#6b7280" stroke-width="1.4"/>
      <rect x="280" y="166" width="136" height="35" rx="3" fill="#16181c" stroke="#f3f4f6" stroke-width="1.4"/>

      <!-- Isuzu Forward-Control Cab -->
      <path d="M488 184 V52 H606 L656 96 L668 200 H488 Z" fill="#15171b" stroke="#f3f4f6" stroke-width="1.6"/>
      <path d="M592 66 H612 L650 102 V134 H592 Z" fill="#0c0d0f" stroke="#d1d5db" stroke-width="1.3"/>
      <rect x="636" y="142" width="30" height="9" fill="#0d0e10" stroke="#d1d5db" stroke-width="1.2"/>
      <rect x="636" y="156" width="30" height="9" fill="#0d0e10" stroke="#d1d5db" stroke-width="1.2"/>
      <rect x="624" y="80" width="9" height="32" rx="2" fill="#0d0e10" stroke="#f3f4f6" stroke-width="1.3"/>

      <g>
        <circle cx="116" cy="208" r="32" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="116" cy="208" r="22" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="116" cy="208" r="14" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="116" cy="208" r="5" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="218" cy="208" r="32" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="218" cy="208" r="22" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="218" cy="208" r="14" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="218" cy="208" r="5" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>

        <circle cx="600" cy="208" r="32" fill="#0b0c0e" stroke="#f3f4f6" stroke-width="1.6"/>
        <circle cx="600" cy="208" r="22" fill="#15171b" stroke="#9ca3af" stroke-width="1.1"/>
        <circle cx="600" cy="208" r="14" fill="#0b0c0e" stroke="#d1d5db" stroke-width="1.2"/>
        <circle cx="600" cy="208" r="5" fill="#262930" stroke="#f3f4f6" stroke-width="1.2"/>
      </g>
      <line x1="116" y1="254" x2="600" y2="254" stroke="#6b7280" stroke-width="1"/>
      <text x="405" y="249" fill="#9ca3af" font-family="monospace" font-size="9" text-anchor="middle">WHEELBASE 3,850 MM // 6UZ1-TC TURBO DIESEL</text>
    </svg>`
  }
};
