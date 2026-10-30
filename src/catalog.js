export const categories = [
  { id: 'diagnostic', name: 'Diagnostic Equipment', short: 'Clarity in every diagnosis', image: 'bp-monitor.jpg' },
  { id: 'monitoring', name: 'Patient Monitoring', short: 'Every vital. Every moment.', image: 'patient-monitor.png' },
  { id: 'surgical', name: 'Surgical Equipment', short: 'Precision in your hands', image: 'surgical-kit.jpg' },
  { id: 'furniture', name: 'Hospital Furniture', short: 'Comfort, thoughtfully built', image: 'hospital-bed.jpg' },
  { id: 'respiratory', name: 'Respiratory Care', short: 'Support for every breath', image: 'oxygen-concentrator.jpg' },
  { id: 'laboratory', name: 'Laboratory Equipment', short: 'Discovery in the details', image: 'microscope.jpg' },
  { id: 'mobility', name: 'Mobility Aids', short: 'Independence in motion', image: 'wheelchair.jpg' },
  { id: 'emergency', name: 'Emergency Care', short: 'Ready when it matters', image: 'ecg-machine.jpg' },
];

// All catalog identities, prices, specifications, stock, and ratings are demo data.
// Source photographs are illustrative; they do not establish brand affiliation.
export const products = [
  { id:'bp', name:'Digital Blood Pressure Monitor', brand:'Medora Essentials', category:'diagnostic', price:2499, original:3299, rating:4.8, reviews:124, stock:25, popularity:100, image:'bp-monitor.jpg', description:'An everyday monitoring essential with a clear digital display and an easy-to-use upper-arm cuff.', specs:['Clear, easy-to-read LCD display','Upper-arm cuff included','Simple one-touch operation'] },
  { id:'oximeter', name:'Fingertip Pulse Oximeter', brand:'Medora Essentials', category:'monitoring', price:1299, original:1999, rating:4.7, reviews:86, stock:40, popularity:96, image:'oximeter.jpg', description:'Compact, lightweight monitoring with a bright display, designed for a simple demonstration of at-a-glance readings.', specs:['Compact fingertip design','Colour OLED-style display','Battery-powered portability'] },
  { id:'ecg', name:'12-Channel ECG Machine', brand:'Medora Clinical', category:'diagnostic', tags:['emergency'], price:28990, original:35990, rating:4.9, reviews:42, stock:8, popularity:94, image:'ecg-machine.jpg', description:'A clinical workspace essential that brings a clear waveform display and integrated controls into one compact unit.', specs:['12-channel concept configuration','Integrated printing compartment','Portable desktop form factor'] },
  { id:'monitor', name:'VitalView Pro Patient Monitor', brand:'Medora Advanced', category:'monitoring', price:42990, original:52000, rating:4.9, reviews:67, stock:12, popularity:93, image:'patient-monitor.png', description:'A considered approach to patient monitoring, combining a vivid screen, multi-parameter view, and a portable design.', specs:['12.1-inch concept colour display','Multi-parameter monitoring view','Portable design with carry handle'] },
  { id:'ultrasound', name:'Portable Ultrasound Scanner', brand:'Medora Advanced', category:'diagnostic', price:89990, original:110000, rating:4.8, reviews:31, stock:6, popularity:89, image:'ultrasound.jpg', description:'Imaging designed to move with your practice. A compact scanner concept for a flexible clinical workspace.', specs:['Portable compact configuration','Digital imaging display','Probe included in demo selection'] },
  { id:'oxygen', name:'Oxygen Concentrator', brand:'Medora Respiratory', category:'respiratory', price:34990, original:42990, rating:4.8, reviews:93, stock:10, popularity:87, image:'oxygen-concentrator.jpg', description:'A thoughtfully designed respiratory care concept with accessible controls and a mobile, space-conscious form.', specs:['Easy-to-access control panel','Integrated carrying handles','Wheeled, moveable design'] },
  { id:'nebulizer', name:'Compact Compressor Nebulizer', brand:'Medora Essentials', category:'respiratory', price:1899, original:2499, rating:4.7, reviews:108, stock:30, popularity:85, image:'nebulizer.jpg', description:'A compact compressor design with a simple interface and accessories for a complete demo equipment selection.', specs:['Compact compressor form','Mask and tubing accessories','Simple on/off operation'] },
  { id:'bed', name:'Electric Hospital Bed', brand:'Medora Comfort', category:'furniture', price:65990, original:79990, rating:4.9, reviews:24, stock:4, popularity:82, image:'hospital-bed.jpg', description:'Comfort and practicality come together in a multi-position hospital bed concept with supportive side rails.', specs:['Multi-position concept design','Supportive side rails','Smooth-rolling locking casters'] },
  { id:'thermometer', name:'Digital Thermometer', brand:'Medora Essentials', category:'diagnostic', price:349, original:499, rating:4.6, reviews:156, stock:60, popularity:80, image:'thermometer.jpg', description:'A familiar everyday essential with a lightweight body and a clear digital temperature display.', specs:['Easy-to-read LCD display','Lightweight handheld form','Single-button controls'] },
  { id:'surgical', name:'Surgical Instrument Set', brand:'Medora Precision', category:'surgical', price:4990, original:6490, rating:4.8, reviews:38, stock:15, popularity:78, image:'surgical-kit.jpg', description:'A considered collection of essential instrument forms, presented as an illustrative surgical equipment set.', specs:['Stainless-steel instrument concept','Assorted precision tool selection','Organised equipment set'] },
  { id:'microscope', name:'Binocular Laboratory Microscope', brand:'Medora Discovery', category:'laboratory', price:18990, original:23990, rating:4.8, reviews:29, stock:0, popularity:75, image:'microscope.jpg', description:'An ergonomic binocular microscope concept for a modern laboratory workspace. Currently unavailable in this demo.', specs:['Binocular optical configuration','Adjustable mechanical stage','Integrated illumination design'] },
  { id:'wheelchair', name:'Lightweight Folding Wheelchair', brand:'Medora Mobility', category:'mobility', price:8990, original:11990, rating:4.7, reviews:53, stock:9, popularity:73, image:'wheelchair.jpg', description:'A folding mobility aid concept with a supportive seat and a practical design for everyday movement.', specs:['Folding frame construction','Supportive padded seat','Swing-away footrest design'] },
];

export const benefits = [
  ['badge-check','Certified equipment','A selection experience built around clear documentation and equipment standards.'],
  ['shield-check','Quality you can trust','Thoughtfully considered equipment for the demands of everyday care.'],
  ['lock-keyhole','Secure shopping','Clear pricing and a simple checkout experience, with no payment collected in this demo.'],
  ['truck','Care, delivered','A delivery experience designed to bring your next essential closer.'],
  ['headset','People who care','Helpful support for equipment questions, selection, and the journey ahead.'],
  ['clipboard-check','Warranty confidence','A service experience designed around support beyond the purchase.'],
];

export const reviews = [
  {quote:'The right equipment makes a difference to every working day. A clear selection and thoughtful details make finding it feel effortless.',name:'Dr. Ananya Sharma',role:'Consultant physician · Illustrative profile',initials:'AS'},
  {quote:'From the first search to the final selection, everything feels considered. That is exactly the experience a busy hospital team needs.',name:'Rahul Mehta',role:'Hospital administrator · Illustrative profile',initials:'RM'},
  {quote:'I appreciate being able to compare equipment, save a shortlist, and see the details clearly. It makes planning a better-equipped practice easier.',name:'Dr. Meera Iyer',role:'Healthcare professional · Illustrative profile',initials:'MI'},
];
