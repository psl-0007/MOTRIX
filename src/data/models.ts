export interface ModelSpec {
  power: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  weight: string;
}

export interface DesignDetail {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface BMWModel {
  id: string; // 'm2' | 'm3' | 'm4' | 'm5' | 'm8'
  name: string; // 'BMW M2'
  shortName: string; // 'M2'
  descriptor: string; // 'PURE DRIVING INSTINCT'
  heroImage: string;
  overviewImage: string;
  tagline: string;
  statement: string;
  narrative: string;
  chassisCode: string;
  index: string; // '01', '02', etc.
  specs: ModelSpec;
  details: DesignDetail[];
  quote: string;
}

export const BMW_MODELS: BMWModel[] = [
  {
    id: 'm2',
    name: 'BMW M2',
    shortName: 'M2',
    descriptor: 'PURE DRIVING INSTINCT',
    heroImage: '/images/models/m2-hero.jpg',
    overviewImage: '/images/models/m2-rear.jpg',
    tagline: 'Compact Dimensions. Ferocious Intent.',
    statement: 'A concentrated shot of pure M adrenaline, engineered for those who demand unfiltered mechanical connection.',
    narrative: 'The BMW M2 honors the legacy of iconic compact sports coupés. With a short wheelbase, wide track, and rear-wheel drive agility, every curve becomes an invitation to push the boundaries of lateral grip.',
    chassisCode: 'G87',
    index: '01',
    quote: 'Agility is not an attribute — it is our baseline instinct.',
    specs: {
      power: '453 HP',
      torque: '406 LB-FT',
      acceleration: '3.9 SEC',
      topSpeed: '177 MPH',
      engine: '3.0L M TwinPower Turbo Inline-6',
      transmission: '6-Speed Manual / 8-Speed M Steptronic',
      drivetrain: 'Rear-Wheel Drive with Active M Differential',
      weight: '3,814 LBS',
    },
    details: [
      {
        title: 'Sculpted Muscularity',
        subtitle: 'AERODYNAMIC AGGRESSION',
        description: 'Frameless horizontal kidney grilles and broad flared wheel arches provide the structural cooling and stance required for intense track sessions.',
        image: '/images/models/m2-hero.jpg',
      },
      {
        title: 'Driver-Centric Cockpit',
        subtitle: 'ERGONOMIC PURITY',
        description: 'Optional M Carbon bucket seats reduce mass by nearly 24 pounds while locking the driver into optimal steering geometry.',
        image: '/images/models/m2-interior.jpg',
      },
      {
        title: 'Quad Exhaust Stance',
        subtitle: 'ACOUSTIC AUTHORITY',
        description: 'Integrated rear diffuser with quad 100mm tailpipes tuned to resonate the high-revving roar of the twin-turbocharged inline six.',
        image: '/images/models/m2-rear.jpg',
      },
    ],
  },
  {
    id: 'm3',
    name: 'BMW M3',
    shortName: 'M3',
    descriptor: 'PERFORMANCE WITH PURPOSE',
    heroImage: '/images/models/m3-hero.jpg',
    overviewImage: '/images/models/m3-rear.jpg',
    tagline: 'The Definitive High-Performance Sedan.',
    statement: 'Four doors. Five seats. Uncompromising motorsport heritage forged on the Nürburgring Nordschleife.',
    narrative: 'Decade after decade, the BMW M3 remains the benchmark against which all sports sedans are measured. The G80 iteration combines explosive straight-line urgency with surgical chassis precision.',
    chassisCode: 'G80',
    index: '02',
    quote: 'The benchmark was never set by consensus; it was set by lap times.',
    specs: {
      power: '503 HP',
      torque: '479 LB-FT',
      acceleration: '3.4 SEC',
      topSpeed: '180 MPH',
      engine: '3.0L M TwinPower Turbo High-Rev Inline-6',
      transmission: '8-Speed M Steptronic with Drivelogic',
      drivetrain: 'M xDrive with 2WD Track Mode',
      weight: '3,990 LBS',
    },
    details: [
      {
        title: 'Track-Tuned Aerodynamics',
        subtitle: 'CFRP ROOF & SPOILER',
        description: 'Standard carbon fiber reinforced plastic (CFRP) roof lowers the center of gravity while channel strakes direct airflow to the decklid spoiler.',
        image: '/images/models/m3-hero.jpg',
      },
      {
        title: 'Dual Personality Dynamics',
        subtitle: 'INTELLIGENT M XDRIVE',
        description: 'Switch instantly between 4WD for maximum wet traction, 4WD Sport for rear bias, and pure 2WD for uninhibited drift control.',
        image: '/images/models/m3-rear.jpg',
      },
      {
        title: 'Motorsport Heritage',
        subtitle: 'SINCE 1986',
        description: 'From the Group A touring car triumphs to today, the M3 lineage embodies genuine race-bred engineering.',
        image: '/images/models/m3-front.jpg',
      },
    ],
  },
  {
    id: 'm4',
    name: 'BMW M4',
    shortName: 'M4',
    descriptor: 'PRECISION IN MOTION',
    heroImage: '/images/models/m4-hero.jpg',
    overviewImage: '/images/models/m4-rear.jpg',
    tagline: 'Sculpted for Velocity. Honed for Control.',
    statement: 'An athletic coupé profile engineered to slice through resistance and command every apex with relentless authority.',
    narrative: 'The BMW M4 Competition Coupé represents the zenith of contemporary sports car architecture. Every surface is sculpted to balance downforce and drag, creating an intensely visceral driving experience.',
    chassisCode: 'G82',
    index: '03',
    quote: 'Downforce is nothing without the precision to command it.',
    specs: {
      power: '523 HP',
      torque: '479 LB-FT',
      acceleration: '3.4 SEC',
      topSpeed: '180 MPH',
      engine: '3.0L M TwinPower Turbo S58 Inline-6',
      transmission: '8-Speed M Steptronic with Drivelogic',
      drivetrain: 'M xDrive with Active M Differential',
      weight: '3,979 LBS',
    },
    details: [
      {
        title: 'Vertical Kidney Architecture',
        subtitle: 'DIRECT AIR CHANNELING',
        description: 'Frameless vertical kidneys route torrents of cooling air directly to the twin turbochargers and dedicated transmission oil coolers.',
        image: '/images/models/m4-hero.jpg',
      },
      {
        title: 'Carbon Bucket Environment',
        subtitle: 'COMPETITION INTERIOR',
        description: 'Illuminated M4 badging, integrated harness pass-throughs, and carbon fiber structural bracing create an authentic cockpit atmosphere.',
        image: '/images/models/m4-interior.jpg',
      },
      {
        title: 'S58 Twin-Turbo Core',
        subtitle: '3D-PRINTED CYLINDER HEAD',
        description: 'Forged lightweight crankshaft and 3D-printed core for the cylinder head allow cooling ducts impossible through traditional casting.',
        image: '/images/models/m4-engine.jpg',
      },
    ],
  },
  {
    id: 'm5',
    name: 'BMW M5',
    shortName: 'M5',
    descriptor: 'POWER WITHOUT COMPROMISE',
    heroImage: '/images/models/m5-hero.jpg',
    overviewImage: '/images/models/m5-rear.jpg',
    tagline: 'Electrified Super-Sedan Dominance.',
    statement: 'A monumental fusion of twin-turbocharged V8 fury and instantaneous electric torque.',
    narrative: 'The all-new seventh generation BMW M5 ushers in an epochal leap with its M HYBRID powertrain. Delivering an unprecedented 717 horsepower, it effortlessly bridges executive grand touring and hypercar performance.',
    chassisCode: 'G90',
    index: '04',
    quote: 'Power is an understatement. Total supremacy is the reality.',
    specs: {
      power: '717 HP',
      torque: '738 LB-FT',
      acceleration: '3.4 SEC',
      topSpeed: '190 MPH',
      engine: '4.4L M TwinPower Turbo V8 + Electric Motor',
      transmission: '8-Speed M Steptronic with Hybrid Module',
      drivetrain: 'M xDrive AWD with 2WD Drift Capability',
      weight: '5,390 LBS',
    },
    details: [
      {
        title: 'M Hybrid Propulsion',
        subtitle: 'INSTANT ELECTRIFIED RESPONSE',
        description: 'A 194-hp electric motor integrated directly into the 8-speed transmission fills any turbo lag with instantaneous torque from zero RPM.',
        image: '/images/models/m5-hero.jpg',
      },
      {
        title: 'Iconic Glow Kidney Grille',
        subtitle: 'NIGHTTIME SIGNATURE',
        description: 'Contour lighting frames the bold front mask, announcing the arrival of the most powerful M5 ever produced.',
        image: '/images/models/m5-detail.jpg',
      },
      {
        title: 'Widebody Executive Stance',
        subtitle: '75MM WIDER TRACK',
        description: 'Prominently flared arches accommodate staggered 20-inch front and 21-inch rear ultra-high performance wheels.',
        image: '/images/models/m5-rear.jpg',
      },
    ],
  },
  {
    id: 'm8',
    name: 'BMW M8',
    shortName: 'M8',
    descriptor: 'THE ART OF GRAND TOURING',
    heroImage: '/images/models/m8-hero.jpg',
    overviewImage: '/images/models/m8-rear.jpg',
    tagline: 'The Pinnacle of Luxury Performance.',
    statement: 'Statuesque proportions meet unrestrained V8 thunder at the outer threshold of automotive luxury.',
    narrative: 'The BMW M8 Competition Coupé represents the zenith of the BMW M hierarchy. Every contour expresses effortless velocity, transporting occupants in bespoke luxury while shattering 0-60 mph in 3.0 seconds.',
    chassisCode: 'F92',
    index: '05',
    quote: 'At this altitude of engineering, luxury and brutality converge.',
    specs: {
      power: '617 HP',
      torque: '553 LB-FT',
      acceleration: '3.0 SEC',
      topSpeed: '190 MPH',
      engine: '4.4L M TwinPower Turbo 32-Valve V8',
      transmission: '8-Speed M Sport Automatic with Drivelogic',
      drivetrain: 'M xDrive with Active M Differential',
      weight: '4,295 LBS',
    },
    details: [
      {
        title: 'Low-Slung Grand Tourer Stance',
        subtitle: 'CARBON ROOF & CONTOURS',
        description: 'A dramatically raked roofline crafted from carbon fiber reinforced plastic sweeps backward to a sculpted integrated lip spoiler.',
        image: '/images/models/m8-hero.jpg',
      },
      {
        title: 'Flawless High-Speed Stability',
        subtitle: 'ADAPTIVE M SUSPENSION',
        description: 'Electronically controlled dampers continuously assess road telemetry in milliseconds to maintain unwavering composure at triple-digit speeds.',
        image: '/images/models/m8-side.jpg',
      },
      {
        title: 'Signature M Quad Exhaust',
        subtitle: 'V8 SYMPHONIC EXHAUST',
        description: 'Active flap control channels the distinctive, gut-wrenching acoustic signature of the cross-bank exhaust manifold V8.',
        image: '/images/models/m8-rear.jpg',
      },
    ],
  },
];
