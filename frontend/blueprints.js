window.TRUCK_BLUEPRINTS = {
  Scania: {
    specs: {
      title: "SCANIA S730 / R500 V8",
      engine: "16.4L DC16 V8 TURBO",
      axle: "6x4 HEAVY TRACTOR",
      gvm: "44,000 KG GCM",
      wheelbase: "3,350 MM"
    },
    svg: `<svg viewBox="0 0 760 275" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- CAD Registration Ticks -->
      <path d="M25 20 H45 M25 20 V40 M735 20 H715 M735 20 V40 M25 255 H45 M25 255 V235 M735 255 H715 M735 255 V235" stroke="#334155" stroke-width="1"/>
      <!-- Main Chassis & Fifth Wheel Coupling -->
      <rect x="65" y="182" width="590" height="10" stroke="#94A3B8" stroke-width="1.2"/>
      <line x1="65" y1="187" x2="655" y2="187" stroke="#475569" stroke-width="0.8" stroke-dasharray="4 3"/>
      <path d="M135 182 L175 166 H232 L245 182" stroke="#E2E8F0" stroke-width="1.3"/>
      <line x1="168" y1="162" x2="236" y2="162" stroke="#56B6F7" stroke-width="1.6"/>
      <!-- Rear Mudguards & Air Suspension -->
      <path d="M72 192 A46 46 0 0 1 162 192" stroke="#64748B" stroke-width="1.1"/>
      <path d="M172 192 A46 46 0 0 1 262 192" stroke="#64748B" stroke-width="1.1"/>
      <!-- Fuel Tank, AdBlue & Battery Box -->
      <rect x="282" y="166" width="128" height="34" rx="4" stroke="#E2E8F0" stroke-width="1.3"/>
      <line x1="315" y1="166" x2="315" y2="200" stroke="#64748B" stroke-width="1"/>
      <line x1="378" y1="166" x2="378" y2="200" stroke="#64748B" stroke-width="1"/>
      <rect x="418" y="168" width="42" height="30" rx="2" stroke="#94A3B8" stroke-width="1.1"/>
      <!-- Aero Highline Roof Deflector & Exhaust Stack -->
      <path d="M466 182 V46 C466 36 476 32 490 32 H578 L636 86 L658 144 V196 H466 Z" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M466 46 Q435 55 430 166" stroke="#56B6F7" stroke-width="1.1" stroke-dasharray="3 3"/>
      <line x1="454" y1="54" x2="454" y2="166" stroke="#94A3B8" stroke-width="2"/>
      <!-- Cab Side Window, Door Seam & Aerodynamic Mirror -->
      <path d="M562 56 H584 L628 96 V128 H562 Z" stroke="#56B6F7" stroke-width="1.2"/>
      <line x1="552" y1="52" x2="552" y2="192" stroke="#64748B" stroke-width="1"/>
      <rect x="615" y="76" width="10" height="34" rx="2" stroke="#E2E8F0" stroke-width="1.2"/>
      <!-- Scania Signature Wrap-Around Grille & Headlight -->
      <line x1="628" y1="138" x2="658" y2="138" stroke="#56B6F7" stroke-width="1.2"/>
      <line x1="630" y1="148" x2="658" y2="148" stroke="#56B6F7" stroke-width="1.2"/>
      <line x1="632" y1="158" x2="658" y2="158" stroke="#56B6F7" stroke-width="1.2"/>
      <line x1="634" y1="168" x2="658" y2="168" stroke="#56B6F7" stroke-width="1.2"/>
      <path d="M636 178 H658 V192 H636 Z" stroke="#E2E8F0" stroke-width="1.2"/>
      <!-- Entry Steps -->
      <rect x="564" y="176" width="34" height="6" stroke="#94A3B8" stroke-width="1"/>
      <rect x="564" y="186" width="34" height="6" stroke="#94A3B8" stroke-width="1"/>
      <!-- Tandem Drive Axles + Front Steer Axle -->
      <g stroke="#E2E8F0" stroke-width="1.4">
        <circle cx="117" cy="202" r="32"/><circle cx="117" cy="202" r="18" stroke="#56B6F7"/><circle cx="117" cy="202" r="7"/>
        <circle cx="217" cy="202" r="32"/><circle cx="217" cy="202" r="18" stroke="#56B6F7"/><circle cx="217" cy="202" r="7"/>
        <circle cx="585" cy="202" r="32"/><circle cx="585" cy="202" r="18" stroke="#56B6F7"/><circle cx="585" cy="202" r="7"/>
      </g>
      <!-- Technical Dimension Lines -->
      <line x1="117" y1="248" x2="585" y2="248" stroke="#64748B" stroke-width="0.9"/>
      <line x1="117" y1="240" x2="117" y2="254" stroke="#64748B" stroke-width="0.9"/>
      <line x1="217" y1="240" x2="217" y2="254" stroke="#64748B" stroke-width="0.9"/>
      <line x1="585" y1="240" x2="585" y2="254" stroke="#64748B" stroke-width="0.9"/>
      <text x="400" y="244" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">3,350 MM WHEELBASE</text>
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
    svg: `<svg viewBox="0 0 760 275" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 20 H45 M25 20 V40 M735 20 H715 M735 20 V40 M25 255 H45 M25 255 V235 M735 255 H715 M735 255 V235" stroke="#334155" stroke-width="1"/>
      <rect x="65" y="182" width="590" height="10" stroke="#94A3B8" stroke-width="1.2"/>
      <path d="M135 182 L175 166 H232 L245 182" stroke="#E2E8F0" stroke-width="1.3"/>
      <line x1="168" y1="162" x2="236" y2="162" stroke="#56B6F7" stroke-width="1.6"/>
      <rect x="278" y="166" width="136" height="33" rx="3" stroke="#E2E8F0" stroke-width="1.3"/>
      <line x1="322" y1="166" x2="322" y2="199" stroke="#64748B" stroke-width="1"/>
      <!-- S-Way Raked Aerodynamic Cab -->
      <path d="M462 182 V42 C462 36 472 34 484 34 H568 L644 96 L662 196 H462 Z" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M462 44 Q434 56 428 166" stroke="#56B6F7" stroke-width="1.1" stroke-dasharray="3 3"/>
      <path d="M556 56 H576 L632 102 V130 H556 Z" stroke="#56B6F7" stroke-width="1.2"/>
      <!-- S-Way V-Profile Grille Louvers -->
      <path d="M622 138 H656 M626 148 H658 M630 158 H660 M634 168 H661" stroke="#56B6F7" stroke-width="1.2"/>
      <rect x="614" y="78" width="9" height="32" rx="2" stroke="#E2E8F0" stroke-width="1.2"/>
      <g stroke="#E2E8F0" stroke-width="1.4">
        <circle cx="117" cy="202" r="32"/><circle cx="117" cy="202" r="18" stroke="#56B6F7"/><circle cx="117" cy="202" r="7"/>
        <circle cx="217" cy="202" r="32"/><circle cx="217" cy="202" r="18" stroke="#56B6F7"/><circle cx="217" cy="202" r="7"/>
        <circle cx="585" cy="202" r="32"/><circle cx="585" cy="202" r="18" stroke="#56B6F7"/><circle cx="585" cy="202" r="7"/>
      </g>
      <line x1="117" y1="248" x2="585" y2="248" stroke="#64748B" stroke-width="0.9"/>
      <text x="400" y="244" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">3,500 MM WHEELBASE</text>
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
    svg: `<svg viewBox="0 0 760 275" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 20 H45 M25 20 V40 M735 20 H715 M735 20 V40 M25 255 H45 M25 255 V235 M735 255 H715 M735 255 V235" stroke="#334155" stroke-width="1"/>
      <rect x="65" y="182" width="590" height="10" stroke="#94A3B8" stroke-width="1.2"/>
      <path d="M135 182 L175 166 H232 L245 182" stroke="#E2E8F0" stroke-width="1.3"/>
      <line x1="168" y1="162" x2="236" y2="162" stroke="#56B6F7" stroke-width="1.6"/>
      <rect x="275" y="165" width="138" height="35" rx="3" stroke="#E2E8F0" stroke-width="1.3"/>
      <!-- FH Globetrotter Sloped Windshield Cab -->
      <path d="M464 182 V38 H568 L640 98 L656 196 H464 Z" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M558 54 H576 L630 102 V130 H558 Z" stroke="#56B6F7" stroke-width="1.2"/>
      <!-- Volvo Iron Mark Diagonal Sash -->
      <line x1="624" y1="136" x2="655" y2="188" stroke="#56B6F7" stroke-width="1.4"/>
      <rect x="615" y="76" width="9" height="34" rx="2" stroke="#E2E8F0" stroke-width="1.2"/>
      <g stroke="#E2E8F0" stroke-width="1.4">
        <circle cx="117" cy="202" r="32"/><circle cx="117" cy="202" r="18" stroke="#56B6F7"/><circle cx="117" cy="202" r="7"/>
        <circle cx="217" cy="202" r="32"/><circle cx="217" cy="202" r="18" stroke="#56B6F7"/><circle cx="217" cy="202" r="7"/>
        <circle cx="585" cy="202" r="32"/><circle cx="585" cy="202" r="18" stroke="#56B6F7"/><circle cx="585" cy="202" r="7"/>
      </g>
      <line x1="117" y1="248" x2="585" y2="248" stroke="#64748B" stroke-width="0.9"/>
      <text x="400" y="244" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">3,400 MM WHEELBASE</text>
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
    svg: `<svg viewBox="0 0 760 275" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 20 H45 M25 20 V40 M735 20 H715 M735 20 V40 M25 255 H45 M25 255 V235 M735 255 H715 M735 255 V235" stroke="#334155" stroke-width="1"/>
      <rect x="65" y="182" width="590" height="10" stroke="#94A3B8" stroke-width="1.2"/>
      <path d="M135 182 L175 166 H232 L245 182" stroke="#E2E8F0" stroke-width="1.3"/>
      <rect x="280" y="166" width="130" height="33" rx="3" stroke="#E2E8F0" stroke-width="1.3"/>
      <!-- Actros GigaSpace Upright Cab + MirrorCam Wing -->
      <path d="M466 182 V36 H584 L644 88 L656 196 H466 Z" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M572 52 H592 L636 92 V126 H572 Z" stroke="#56B6F7" stroke-width="1.2"/>
      <path d="M568 66 H546 V73 H568" stroke="#56B6F7" stroke-width="1.3"/>
      <line x1="632" y1="142" x2="656" y2="142" stroke="#56B6F7" stroke-width="1.2"/>
      <line x1="634" y1="154" x2="656" y2="154" stroke="#56B6F7" stroke-width="1.2"/>
      <g stroke="#E2E8F0" stroke-width="1.4">
        <circle cx="117" cy="202" r="32"/><circle cx="117" cy="202" r="18" stroke="#56B6F7"/><circle cx="117" cy="202" r="7"/>
        <circle cx="217" cy="202" r="32"/><circle cx="217" cy="202" r="18" stroke="#56B6F7"/><circle cx="217" cy="202" r="7"/>
        <circle cx="585" cy="202" r="32"/><circle cx="585" cy="202" r="18" stroke="#56B6F7"/><circle cx="585" cy="202" r="7"/>
      </g>
      <line x1="117" y1="248" x2="585" y2="248" stroke="#64748B" stroke-width="0.9"/>
      <text x="400" y="244" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">3,300 MM WHEELBASE</text>
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
    svg: `<svg viewBox="0 0 760 275" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 20 H45 M25 20 V40 M735 20 H715 M735 20 V40 M25 255 H45 M25 255 V235 M735 255 H715 M735 255 V235" stroke="#334155" stroke-width="1"/>
      <rect x="65" y="182" width="590" height="10" stroke="#94A3B8" stroke-width="1.2"/>
      <path d="M135 182 L175 166 H232 L245 182" stroke="#E2E8F0" stroke-width="1.3"/>
      <rect x="278" y="166" width="132" height="33" rx="3" stroke="#E2E8F0" stroke-width="1.3"/>
      <!-- MAN TGX GX Cab -->
      <path d="M468 182 V40 H582 L642 90 L656 196 H468 Z" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M568 54 H588 L634 94 V126 H568 Z" stroke="#56B6F7" stroke-width="1.2"/>
      <rect x="626" y="132" width="28" height="12" stroke="#56B6F7" stroke-width="1.2"/>
      <rect x="614" y="76" width="9" height="32" rx="2" stroke="#E2E8F0" stroke-width="1.2"/>
      <g stroke="#E2E8F0" stroke-width="1.4">
        <circle cx="117" cy="202" r="32"/><circle cx="117" cy="202" r="18" stroke="#56B6F7"/><circle cx="117" cy="202" r="7"/>
        <circle cx="217" cy="202" r="32"/><circle cx="217" cy="202" r="18" stroke="#56B6F7"/><circle cx="217" cy="202" r="7"/>
        <circle cx="585" cy="202" r="32"/><circle cx="585" cy="202" r="18" stroke="#56B6F7"/><circle cx="585" cy="202" r="7"/>
      </g>
      <line x1="117" y1="248" x2="585" y2="248" stroke="#64748B" stroke-width="0.9"/>
      <text x="400" y="244" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">3,300 MM WHEELBASE</text>
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
    svg: `<svg viewBox="0 0 760 275" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 20 H45 M25 20 V40 M735 20 H715 M735 20 V40 M25 255 H45 M25 255 V235 M735 255 H715 M735 255 V235" stroke="#334155" stroke-width="1"/>
      <rect x="65" y="182" width="590" height="10" stroke="#94A3B8" stroke-width="1.2"/>
      <rect x="278" y="168" width="128" height="30" rx="2" stroke="#E2E8F0" stroke-width="1.3"/>
      <!-- Isuzu Cab-Over Forward Control Profile -->
      <path d="M484 182 V56 H598 L648 98 L658 196 H484 Z" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M586 68 H604 L642 102 V132 H586 Z" stroke="#56B6F7" stroke-width="1.2"/>
      <rect x="628" y="140" width="28" height="8" stroke="#56B6F7" stroke-width="1.2"/>
      <rect x="628" y="154" width="28" height="8" stroke="#56B6F7" stroke-width="1.2"/>
      <g stroke="#E2E8F0" stroke-width="1.4">
        <circle cx="117" cy="204" r="30"/><circle cx="117" cy="204" r="16" stroke="#56B6F7"/><circle cx="117" cy="204" r="6"/>
        <circle cx="217" cy="204" r="30"/><circle cx="217" cy="204" r="16" stroke="#56B6F7"/><circle cx="217" cy="204" r="6"/>
        <circle cx="592" cy="204" r="30"/><circle cx="592" cy="204" r="16" stroke="#56B6F7"/><circle cx="592" cy="204" r="6"/>
      </g>
      <line x1="117" y1="248" x2="592" y2="248" stroke="#64748B" stroke-width="0.9"/>
      <text x="400" y="244" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">3,850 MM WHEELBASE</text>
    </svg>`
  }
};
