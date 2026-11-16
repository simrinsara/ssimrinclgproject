/**
 * Sample Event Catalog for Eventify
 * Contains realistic campus and community events with full metadata,
 * multi-paragraph descriptions, and schedule highlights.
 */

export const EVENT_CATEGORIES = [
  'All',
  'Conference',
  'Workshop',
  'Cultural',
  'Technology',
  'Seminar',
  'Community'
];

export const EVENTS = [
  {
    id: 'sustainable-futures-symposium',
    title: 'Annual Symposium on Sustainable Futures',
    category: 'Conference',
    date: '2026-11-21',
    time: '09:30 AM – 04:00 PM',
    location: 'Founders Hall, Main Auditorium',
    organizer: 'School of Architecture & Urban Studies',
    capacity: 180,
    featured: true,
    upcoming: true,
    image: '/src/assets/images/hero_keynote_hall_1794814590723.jpg',
    imageAlt: 'Speaker addressing college students inside a sunlit timber lecture hall',
    summary:
      'A full-day student and faculty symposium examining urban ecology, timber construction, and low-energy civic infrastructure.',
    description: [
      'The Annual Symposium on Sustainable Futures brings together urban planners, environmental engineers, and undergraduate researchers for a day of open lectures and roundtable dialogue. Sessions focus on practical climate adaptation strategies for mid-sized college towns and campus infrastructure.',
      'Morning keynotes examine mass-timber campus architecture and rainwater catchment systems, followed by afternoon student poster critiques and an open Q&A with visiting municipal designers. Light lunch and printed symposium booklets are provided to all registered attendees.'
    ],
    agenda: [
      { time: '09:30 AM', item: 'Check-in, coffee, and exhibition walk' },
      { time: '10:00 AM', item: 'Opening Keynote: Adaptive Campus Architecture' },
      { time: '01:00 PM', item: 'Student Research Presentations & Panel' },
      { time: '03:00 PM', item: 'Closing Roundtable & Open Discussion' }
    ]
  },
  {
    id: 'letterpress-print-workshop',
    title: 'Hand-Set Typography & Printmaking Workshop',
    category: 'Workshop',
    date: '2026-11-25',
    time: '02:00 PM – 05:00 PM',
    location: 'Fine Arts Building, Print Studio 204',
    organizer: 'Campus Design Collective',
    capacity: 24,
    featured: true,
    upcoming: true,
    image: '/src/assets/images/event_design_workshop_1794814591339.jpg',
    imageAlt: 'Students rolling ink on wood type blocks around a sunlit printmaking table',
    summary:
      'Learn movable wood-type composition, ink mixing, and tabletop proof-press printing in a three-hour studio session.',
    description: [
      'Step away from screens and spend an afternoon working directly with physical wood and metal type. Designed for beginners and visual design students alike, this workshop introduces spacing, lock-up, and hand-inked registration on cotton rag paper.',
      'Each participant will compose a short typographic broadside or event poster and take home ten freshly pulled prints. All inks, brayers, aprons, and archival paper sheets are included at no cost for enrolled students.'
    ],
    agenda: [
      { time: '02:00 PM', item: 'Studio safety & introduction to wood type cases' },
      { time: '02:30 PM', item: 'Composing headlines and spacing on the press bed' },
      { time: '03:45 PM', item: 'Inking rollers and pulling test proofs' },
      { time: '04:30 PM', item: 'Print drying rack review & studio cleanup' }
    ]
  },
  {
    id: 'courtyard-acoustic-session',
    title: 'Autumn Courtyard Acoustic Session',
    category: 'Cultural',
    date: '2026-11-28',
    time: '06:30 PM – 09:00 PM',
    location: 'Old Quad Brick Courtyard',
    organizer: 'Student Music Guild',
    capacity: 120,
    featured: false,
    upcoming: true,
    image: '/src/assets/images/event_music_courtyard_1794814590974.jpg',
    imageAlt: 'Two student guitarists performing under warm string lights in a brick courtyard',
    summary:
      'An intimate evening of folk duos, original songwriting, and warm spiced cider under the courtyard string lights.',
    description: [
      'Hosted outdoors on the stone steps of the Old Quad, the Autumn Courtyard Acoustic Session highlights six student songwriters and acoustic ensembles performing unplugged sets. Bring a warm jacket or blanket for stone-step seating.',
      'The Student Music Guild will also run a community vinyl swap table starting at 6:00 PM before the first performers take the stage. Rain location: Student Union Ballroom.'
    ],
    agenda: [
      { time: '06:00 PM', item: 'Courtyard gates open & vinyl swap table' },
      { time: '06:30 PM', item: 'Opening acoustic duo: Clara & Dev' },
      { time: '07:30 PM', item: 'Intermission with warm cider & pastries' },
      { time: '08:00 PM', item: 'Featured ensemble & open mic finale' }
    ]
  },
  {
    id: 'robotics-hardware-expo',
    title: 'Undergraduate Robotics & Hardware Expo',
    category: 'Technology',
    date: '2026-12-03',
    time: '11:00 AM – 03:30 PM',
    location: 'Engineering Atrium, North Wing',
    organizer: 'Department of Electrical & Computer Engineering',
    capacity: 220,
    featured: false,
    upcoming: true,
    image: '/src/assets/images/event_robotics_fair_1794814592542.jpg',
    imageAlt: 'Engineering students demonstrating tabletop robotic arms and circuit boards in a bright atrium',
    summary:
      'Live tabletop demonstrations of autonomous rovers, articulated robotic arms, and custom embedded sensor boards.',
    description: [
      'Explore eighteen semester-long hardware projects built by sophomore, junior, and senior engineering teams. Visitors can test robotic grippers, inspect PCB layouts, and speak directly with student builders about firmware architecture and mechanical tolerances.',
      'Faculty advisors and local hardware engineers will host a brief lightning critique at 2:00 PM, highlighting open-source tools and fabrication lessons learned in the campus makerspace.'
    ],
    agenda: [
      { time: '11:00 AM', item: 'Exhibition floor opens to students & visitors' },
      { time: '12:30 PM', item: 'Live rover obstacle course demonstration' },
      { time: '02:00 PM', item: 'Engineering team lightning talks' },
      { time: '03:00 PM', item: 'People’s choice showcase recognition' }
    ]
  },
  {
    id: 'independent-zine-seminar',
    title: 'Small Press & Independent Zine Fair',
    category: 'Seminar',
    date: '2026-12-06',
    time: '01:30 PM – 04:30 PM',
    location: 'Carnegie Library, Reading Room B',
    organizer: 'Campus Literary Review',
    capacity: 65,
    featured: false,
    upcoming: false,
    image: '/src/assets/images/event_literature_panel_1794814592324.jpg',
    imageAlt: 'Author speaking to an audience in a warm sunlit university library with zine display tables',
    summary:
      'An afternoon author conversation and student zine browse celebrating independent print culture and campus essays.',
    description: [
      'Join visiting small-press editor Nora Lindqvist for a candid talk on starting independent journals, editing essays, and saddle-stitch binding on a student budget. Following the Q&A, browse tables featuring over twenty student-printed chapbooks, photo zines, and campus literary issues.',
      'Attendees are welcome to bring blank notebooks or test risograph samples at the library resource table.'
    ],
    agenda: [
      { time: '01:30 PM', item: 'Doors open & zine reading tables' },
      { time: '02:00 PM', item: 'Featured Talk: Sustaining Small Print Communities' },
      { time: '03:00 PM', item: 'Audience Q&A and open floor discussion' },
      { time: '03:45 PM', item: 'Informal zine swap & refreshments' }
    ]
  },
  {
    id: 'campus-autumn-5k-run',
    title: 'Morning Campus 5K & Community Breakfast',
    category: 'Community',
    date: '2026-12-12',
    time: '08:00 AM – 10:30 AM',
    location: 'Elm Walk Gatehouse (Start & Finish)',
    organizer: 'Campus Recreation & Wellness Club',
    capacity: 150,
    featured: false,
    upcoming: false,
    image: '/src/assets/images/event_community_run_1794814593396.jpg',
    imageAlt: 'University students warming up together along a tree-lined brick campus pathway in morning light',
    summary:
      'A friendly, untimed morning 5K walk or run along the tree-lined perimeter path, followed by oats and coffee.',
    description: [
      'Open to runners, joggers, and brisk walkers of every pace, this community morning loop winds through the historic brick walkways and botanical gardens before finals week begins. Group dynamic stretching starts promptly at 8:00 AM.',
      'All registered participants receive a warm oat bowl, fresh fruit, and pour-over coffee near the Gatehouse lawn after crossing the finish line.'
    ],
    agenda: [
      { time: '08:00 AM', item: 'Check-in and group warm-up stretch' },
      { time: '08:20 AM', item: '5K run & community walk start' },
      { time: '09:15 AM', item: 'Post-run recovery & campus breakfast' },
      { time: '10:30 AM', item: 'Event wrap-up' }
    ]
  }
];

/**
 * Finds a single event object by its unique ID string.
 * @param {string | null} eventId
 * @returns {object | undefined}
 */
export function getEventById(eventId) {
  if (!eventId) return undefined;
  return EVENTS.find((event) => event.id === eventId);
}
