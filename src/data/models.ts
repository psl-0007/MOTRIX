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
  /** Text alternative for the photograph. Empty string = decorative (same photo already described elsewhere). */
  alt: string;
  /** Honest credit line: what the photograph actually shows. */
  caption: string;
}

export interface BMWModel {
  id: string; // 'm2' | 'm3' | 'm4' | 'm5' | 'm8'
  name: string; // 'BMW M2'
  shortName: string; // 'M2'
  descriptor: string; // 'PURE DRIVING INSTINCT'
  heroImage: string;
  overviewImage: string;
  /** Text alternative describing the hero photograph. */
  heroAlt: string;
  /** What the hero photograph actually shows (generation / body style). */
  heroCaption: string;
  tagline: string;
  statement: string;
  narrative: string;
  chassisCode: string;
  index: string; // '01', '02', etc.
  specs: ModelSpec;
  /** Footnote shown under the spec table: which car the figures describe. */
  specsNote: string;
  details: DesignDetail[];
  /** Editorial pull-quote (written for this site, not attributed to BMW). */
  quote: string;
}

export const IMAGERY_NOTE =
  'Press imagery is illustrative; specifications shown are manufacturer figures and may vary by market and model year.';

export const BMW_MODELS: BMWModel[] = [
  {
    id: 'm2',
    name: 'BMW M2',
    shortName: 'M2',
    descriptor: 'PURE DRIVING INSTINCT',
    heroImage: '/images/models/m2-hero.jpg',
    overviewImage: '/images/models/m2-rear.jpg',
    heroAlt:
      'Close-up of the front of a red BMW M2 Competition with an LED headlamp, a carbon-trimmed kidney grille carrying the M2 badge and a carbon mirror cap, against a blurred green background.',
    heroCaption: 'Pictured: earlier-generation M2 Competition.',
    tagline: 'Compact Dimensions. Ferocious Intent.',
    statement:
      'A concentrated shot of pure M adrenaline, engineered for those who want an unfiltered mechanical connection.',
    narrative:
      'The BMW M2 carries on the tradition of compact M coupés. A short wheelbase, a wide track and rear-wheel drive keep the car small, light on its feet and eager to rotate, so every corner is an invitation to explore the limits of grip.',
    chassisCode: 'G87',
    index: '01',
    quote: 'Agility is not an attribute. It is the baseline.',
    specs: {
      power: '453 HP',
      torque: '406 LB-FT',
      acceleration: '3.9 SEC',
      topSpeed: '177 MPH',
      engine: '3.0L M TwinPower Turbo inline-6',
      transmission: '6-speed manual or 8-speed M Steptronic',
      drivetrain: 'Rear-wheel drive, Active M Differential',
      weight: 'Approx. 3,800 lbs',
    },
    specsNote:
      'Figures describe the current-generation M2 (G87); the 0-60 time is for the 8-speed automatic. Top speed is electronically limited and needs the M Driver’s Package.',
    details: [
      {
        title: 'A Compact, Purposeful Face',
        subtitle: 'LED HEADLAMPS & KIDNEY GRILLE',
        description:
          'A short front end framed by LED headlamps and a dark kidney grille, with large lower intakes that feed air to the brakes and radiators.',
        image: '/images/models/m2-hero.jpg',
        alt: '',
        caption: 'Closer crop of the opening photograph.',
      },
      {
        title: 'Driver-Focused Cockpit',
        subtitle: 'WHEEL, SHIFTER & CARBON TRIM',
        description:
          'An M steering wheel with shift paddles, carbon-fibre trim and a floor-mounted selector place the main controls within easy reach of the driver.',
        image: '/images/models/m2-interior.jpg',
        alt: 'Right-hand-drive BMW M2 cabin: an M steering wheel with shift paddles, the instrument cluster, a central display, carbon-fibre dash trim and the gear selector.',
        caption: 'Pictured: right-hand-drive M2 in a showroom.',
      },
      {
        title: 'Quad Tailpipe Rear End',
        subtitle: 'DIFFUSER & EXHAUST',
        description:
          'Four tailpipes sit in a dark rear diffuser beneath a lip spoiler, giving the turbocharged inline-six an exit as purposeful as the rest of the car.',
        image: '/images/models/m2-rear.jpg',
        alt: 'Rear three-quarter view of a silver BMW M2 Competition on a wet street, showing the lip spoiler, LED tail-lights, dark diffuser and four tailpipes.',
        caption: 'Pictured: earlier-generation M2 Competition.',
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
    heroAlt:
      'Front three-quarter view of a deep-blue BMW M3 Coupé with round projector headlamps and dark alloy wheels, parked in an underground garage.',
    heroCaption: 'Pictured: earlier-generation M3 Coupé.',
    tagline: 'Race Heritage. Everyday Usable.',
    statement:
      'Motorsport lineage since 1986, distilled into a performance car you can drive every single day.',
    narrative:
      'Generation after generation, the BMW M3 has been the car other performance cars are measured against. The current G80 pairs explosive straight-line urgency with precise, confidence-building chassis control. The photographs here show earlier M3 generations.',
    chassisCode: 'G80',
    index: '02',
    quote: 'The benchmark was never set by consensus. It was set on the stopwatch.',
    specs: {
      power: '503 HP',
      torque: '479 LB-FT',
      acceleration: '3.4 SEC',
      topSpeed: '180 MPH',
      engine: '3.0L M TwinPower Turbo inline-6',
      transmission: '8-speed M Steptronic with Drivelogic',
      drivetrain: 'M xDrive with selectable 2WD mode',
      weight: 'Approx. 4,000 lbs',
    },
    specsNote:
      'Figures describe the current-generation M3 Competition xDrive (G80). Top speed is electronically limited and needs the M Driver’s Package.',
    details: [
      {
        title: 'A Wide, Powerful Front End',
        subtitle: 'BONNET, ARCHES & KIDNEYS',
        description:
          'A raised bonnet, flared front arches and a pair of kidney grilles define the M3 face, cues that every generation has kept.',
        image: '/images/models/m3-hero.jpg',
        alt: '',
        caption: 'Closer crop of the opening photograph.',
      },
      {
        title: 'Rear-Biased by Design',
        subtitle: 'M XDRIVE',
        description:
          'The current M3 Competition xDrive sends its power mainly to the rear axle, can add the front axle for grip, and offers a 2WD mode for rear-drive only.',
        image: '/images/models/m3-rear.jpg',
        alt: 'Rear three-quarter view of a white BMW M3 Sedan with four tailpipes and multi-spoke alloy wheels, parked beside a fence.',
        caption: 'Pictured: earlier-generation M3 Sedan.',
      },
      {
        title: 'Motorsport Heritage',
        subtitle: 'SINCE 1986',
        description:
          'The first M3 arrived in 1986 as a road-going base for touring-car racing, and every generation since has carried that race-bred approach forward.',
        image: '/images/models/m3-front.jpg',
        alt: 'Front three-quarter view of a dark-green BMW M3 Coupé from the 1990s with silver alloy wheels, parked on gravel in the sun.',
        caption: 'Pictured: 1990s M3 Coupé.',
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
    heroAlt:
      'Front three-quarter view of a matte-black BMW M4 with a large vertical kidney grille and lit LED headlamps, parked on cobblestones beside dark foliage.',
    heroCaption: 'Pictured: current-generation M4 Coupé.',
    tagline: 'Sculpted for Velocity. Honed for Control.',
    statement:
      'An athletic coupé profile engineered to slice through resistance and command every apex with relentless authority.',
    narrative:
      'The BMW M4 Competition Coupé is built around balance: surfaces shaped to manage air, a twin-turbocharged inline-six and a chassis tuned for control at the limit. The interior and engine-bay photographs here show the previous generation.',
    chassisCode: 'G82',
    index: '03',
    quote: 'Downforce is nothing without the precision to command it.',
    specs: {
      power: '503 HP',
      torque: '479 LB-FT',
      acceleration: '3.4 SEC',
      topSpeed: '180 MPH',
      engine: '3.0L M TwinPower Turbo inline-6',
      transmission: '8-speed M Steptronic with Drivelogic',
      drivetrain: 'M xDrive with Active M Differential',
      weight: 'Approx. 4,000 lbs',
    },
    specsNote:
      'Figures describe the current-generation M4 Competition xDrive (G82). Top speed is electronically limited and needs the M Driver’s Package.',
    details: [
      {
        title: 'The Vertical Kidney Grille',
        subtitle: 'AIR FOR THE ENGINE',
        description:
          'The large vertical kidneys of the current M4 are more than a statement: behind them sits the cooling air the twin-turbo inline-six depends on.',
        image: '/images/models/m4-hero.jpg',
        alt: '',
        caption: 'Closer crop of the opening photograph.',
      },
      {
        title: 'Driver-Focused Interior',
        subtitle: 'WHEEL, DISPLAY & SELECTOR',
        description:
          'An M steering wheel with shift paddles, carbon-fibre dash trim and a driver-angled layout keep the focus on the road.',
        image: '/images/models/m4-interior.jpg',
        alt: 'Right-hand-drive BMW M4 interior: an M steering wheel with paddles, the instrument cluster, carbon-fibre dash trim, a central display and the gear selector.',
        caption: 'Pictured: previous-generation M4 interior, right-hand drive.',
      },
      {
        title: 'Twin-Turbo Inline-Six',
        subtitle: 'UNDER THE BONNET',
        description:
          'A 3.0-litre twin-turbocharged straight-six sits under an M Power cover, surrounded by intercooler piping and carbon-fibre bracing.',
        image: '/images/models/m4-engine.jpg',
        alt: 'Open bonnet of a BMW M4 showing the 3.0-litre twin-turbo inline-six under its black M Power cover, with carbon-fibre bracing and red jump leads attached.',
        caption: 'Pictured: previous-generation M4 engine bay.',
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
    heroAlt:
      'Head-on view of a white BMW M5 sedan with a wide kidney grille, slim LED headlamps and large lower air intakes, parked in a concrete garage.',
    heroCaption: 'Pictured: earlier-generation M5.',
    tagline: 'Executive Sedan. Supercar Pace.',
    statement:
      'A monumental fusion of twin-turbocharged V8 power and instant electric torque, wrapped in a four-door sedan.',
    narrative:
      'The current-generation BMW M5 (G90) combines a twin-turbocharged V8 with an electric motor for a combined 717 horsepower. It bridges executive comfort and supercar pace in one four-door package. The photographs here show earlier M5 models.',
    chassisCode: 'G90',
    index: '04',
    quote: 'Power is an understatement. Composure is the real headline.',
    specs: {
      power: '717 HP',
      torque: '738 LB-FT',
      acceleration: '3.4 SEC',
      topSpeed: '190 MPH',
      engine: '4.4L twin-turbo V8 plus electric motor',
      transmission: '8-speed M Steptronic',
      drivetrain: 'M xDrive AWD with selectable 2WD mode',
      weight: 'Approx. 5,400 lbs',
    },
    specsNote:
      'Figures describe the current-generation M5 (G90); power and torque are combined system outputs. Top speed is electronically limited and needs the M Driver’s Package.',
    details: [
      {
        title: 'An Imposing Front End',
        subtitle: 'KIDNEY GRILLE & AIR INTAKES',
        description:
          'A broad kidney grille, slim LED headlamps and wide lower intakes give the M5 a face that looks as serious as it performs.',
        image: '/images/models/m5-hero.jpg',
        alt: '',
        caption: 'Closer crop of the opening photograph.',
      },
      {
        title: 'Sleeper Proportions, Wide Stance',
        subtitle: 'ARCHES, WHEELS & M GILL',
        description:
          'Flared wheel arches, large alloy wheels and the M-marked side gill signal that this is far more than a business sedan.',
        image: '/images/models/m5-detail.jpg',
        alt: 'Front three-quarter view of a silver BMW M5 sedan with dark alloy wheels, black kidney grilles and a black side gill, parked on brick paving beside a hedge.',
        caption: 'Pictured: earlier-generation M5 Competition.',
      },
      {
        title: 'Quad Tailpipes, Lip Spoiler',
        subtitle: 'REAR END',
        description:
          'A boot-lid lip spoiler, a dark diffuser and four tailpipes finish the rear of the M5 sedan.',
        image: '/images/models/m5-rear.jpg',
        alt: 'Rear three-quarter view of a white BMW M5 sedan with a lip spoiler, LED tail-lights, a dark diffuser, four tailpipes and dark alloy wheels, parked in a car park.',
        caption: 'Pictured: earlier-generation M5.',
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
    heroAlt:
      'Front three-quarter view of a matte dark-blue BMW M8 Gran Coupé with a twin kidney grille, parked in front of a brick wall.',
    heroCaption: 'Pictured: M8 Gran Coupé (four-door).',
    tagline: 'The Pinnacle of Luxury Performance.',
    statement:
      'Statuesque proportions meet unrestrained V8 thunder at the outer threshold of automotive luxury.',
    narrative:
      'The BMW M8 Competition sits at the top of the BMW M range, offered as a two-door Coupé and a four-door Gran Coupé. Every contour expresses effortless pace, carrying its occupants in luxury while a twin-turbo V8 delivers supercar acceleration.',
    chassisCode: 'F92',
    index: '05',
    quote: 'At this altitude, luxury and brutality converge.',
    specs: {
      power: '617 HP',
      torque: '553 LB-FT',
      acceleration: '3.0 SEC',
      topSpeed: '190 MPH',
      engine: '4.4L M TwinPower Turbo V8',
      transmission: '8-speed M Steptronic with Drivelogic',
      drivetrain: 'M xDrive with Active M Differential',
      weight: 'Approx. 4,300 lbs',
    },
    specsNote:
      'Figures describe the M8 Competition Coupé; the Gran Coupé is slightly slower and heavier. Top speed is electronically limited and needs the M Driver’s Package.',
    details: [
      {
        title: 'Grand-Touring Presence',
        subtitle: 'LONG BONNET & KIDNEY GRILLE',
        description:
          'A long bonnet, a wide twin kidney grille and a low, sweeping roofline give the M8 the stance of a grand tourer.',
        image: '/images/models/m8-hero.jpg',
        alt: '',
        caption: 'Closer crop of the opening photograph.',
      },
      {
        title: 'A Long, Low Profile',
        subtitle: 'SIDE VIEW & WHEELS',
        description:
          'Seen side-on, the long wheelbase, dark roof panel and large dark alloy wheels read as grand tourer first and track car second.',
        image: '/images/models/m8-side.jpg',
        alt: 'Side view of a bright-blue BMW M8 Gran Coupé with a dark roof and large dark alloy wheels, parked beside a yellow line in a car park.',
        caption: 'Pictured: M8 Competition Gran Coupé.',
      },
      {
        title: 'Quad Tailpipes',
        subtitle: 'COUPÉ REAR END',
        description:
          'On the two-door Coupé, four tailpipes sit under a slim lip spoiler and wraparound LED tail-lights.',
        image: '/images/models/m8-rear.jpg',
        alt: 'Rear three-quarter view of a grey BMW M8 Competition Coupé showing a slim lip spoiler, wraparound LED tail-lights, four tailpipes and multi-spoke alloy wheels.',
        caption: 'Pictured: M8 Competition Coupé (two-door).',
      },
    ],
  },
];
