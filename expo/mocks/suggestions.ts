import { Suggestion } from '@/types/suggestion';

export const SYSTEM_SUGGESTIONS: Suggestion[] = [
  {
    id: 'route-optimization',
    title: 'Route Optimization Engine',
    description: 'Implement an intelligent route optimization system that calculates the most efficient routes for drivers, considering distance, traffic patterns, fuel costs, and delivery time windows.',
    category: 'feature',
    priority: 'high',
    estimatedTime: '2-3 days',
    benefits: [
      'Reduce fuel costs by 15-20%',
      'Improve delivery time accuracy',
      'Increase driver satisfaction',
      'Handle more loads with same fleet size',
    ],
    prompt: `Create a route optimization feature for the trucking app with the following requirements:

1. **Route Calculator Screen** (app/route-optimizer.tsx):
   - Input: Multiple pickup/delivery locations
   - Show optimized route on map visualization
   - Display estimated miles, fuel cost, and time
   - Compare original vs optimized route savings
   
2. **Optimization Algorithm**:
   - Calculate shortest path between multiple stops
   - Consider time windows for pickups/deliveries
   - Factor in rest stops (HOS compliance)
   - Include fuel cost calculations
   
3. **Integration**:
   - Add "Optimize Route" button to load detail page
   - Save optimized routes to load records
   - Show optimization suggestions in driver dashboard
   
4. **UI/UX**:
   - Interactive map with draggable waypoints
   - Side panel showing route details and savings
   - Dark mode compatible design
   - Export route to GPS/navigation apps

Use react-native-maps for visualization if available, or create a text-based route display. Store optimization history in LoadContext.`,
  },
  {
    id: 'ai-load-matching',
    title: 'AI-Powered Load Matching',
    description: 'Use AI to automatically match available drivers with new loads based on location, availability, performance history, truck type, and driver preferences.',
    category: 'feature',
    priority: 'high',
    estimatedTime: '1-2 days',
    benefits: [
      'Reduce load assignment time by 70%',
      'Improve driver-load compatibility',
      'Minimize deadhead miles',
      'Increase dispatcher productivity',
    ],
    requirements: [
      'AI API access (already available via @rork/toolkit-sdk)',
    ],
    prompt: `Implement an AI-powered load matching system with these components:

1. **AI Matching Engine** (utils/loadMatcher.ts):
   - Use @rork/toolkit-sdk's generateObject to analyze loads and drivers
   - Input: Load details (pickup, delivery, weight, type, pay)
   - Input: Available drivers (location, truck type, availability, performance)
   - Output: Ranked list of best driver matches with reasoning
   
2. **Smart Assignment Screen** (app/smart-assign.tsx):
   - Show new unassigned load
   - Display AI-recommended drivers with match scores (0-100)
   - Show reasoning for each recommendation
   - One-tap assignment to top match
   - Override option to manually select different driver
   
3. **Matching Criteria**:
   - Distance from current location to pickup
   - Truck type compatibility
   - Driver availability and HOS compliance
   - Historical performance metrics
   - Preferred routes/regions
   - Deadhead miles minimization
   
4. **Dispatcher Dashboard Integration**:
   - Add "Smart Assign" button to unassigned loads
   - Show auto-assignment suggestions
   - Track assignment success rate
   
Use the AI to provide explanations like: "Best match (95%): Driver John is 45 miles from pickup, has experience with refrigerated loads, available now, and this route matches his preferred region."`,
  },
  {
    id: 'expense-tracker',
    title: 'Automated Expense Tracking',
    description: 'Build a comprehensive expense tracking system for drivers to log fuel, tolls, maintenance, and other expenses with photo receipts and automatic categorization.',
    category: 'feature',
    priority: 'medium',
    estimatedTime: '2-3 days',
    benefits: [
      'Accurate expense reporting for tax purposes',
      'Real-time profitability analysis',
      'Simplified reimbursement process',
      'Better financial visibility',
    ],
    prompt: `Create an expense tracking system with these features:

1. **Expense Entry Screen** (app/add-expense.tsx):
   - Quick expense logging with categories (fuel, tolls, maintenance, food, etc.)
   - Amount, date, location, and notes fields
   - Photo capture for receipts using expo-camera
   - Associate expense with specific load or mark as general
   
2. **Expense List** (app/expenses.tsx):
   - Filter by date range, category, driver, or load
   - Show total expenses by category
   - Monthly/weekly expense summaries
   - Export to CSV functionality
   
3. **Driver Dashboard Integration**:
   - Quick "Add Expense" button
   - Today's expenses summary
   - Week/month totals
   
4. **Admin/Dispatcher Views**:
   - Review and approve driver expenses
   - Generate expense reports by driver or time period
   - Expense trends and analytics
   
5. **Data Structure** (types/expense.ts):
   - id, driverId, loadId (optional), amount, category, date, description, receiptPhoto (uri), status (pending/approved/rejected)
   
6. **Context** (contexts/ExpenseContext.tsx):
   - Manage expenses with AsyncStorage persistence
   - Calculate totals and summaries
   - Filter and search functionality
   
Make the UI fast and mobile-optimized. Drivers should be able to log an expense in under 10 seconds.`,
  },
  {
    id: 'voice-commands',
    title: 'Voice Command Interface',
    description: 'Enable hands-free operation for drivers using voice commands to update load status, add notes, check schedules, and communicate with dispatch.',
    category: 'feature',
    priority: 'medium',
    estimatedTime: '1-2 days',
    benefits: [
      'Improved driver safety (hands-free operation)',
      'Faster status updates while driving',
      'Better HOS compliance',
      'Enhanced user experience',
    ],
    requirements: [
      'Speech-to-text API (available via toolkit)',
    ],
    prompt: `Implement voice command functionality using the speech-to-text API:

1. **Voice Command Button** (components/VoiceCommandButton.tsx):
   - Floating action button with microphone icon
   - Hold to record, release to process
   - Visual feedback during recording
   - Works from any screen in driver app
   
2. **Voice Processing** (utils/voiceCommands.ts):
   - Record audio and send to https://toolkit.rork.com/stt/transcribe/
   - Parse voice commands using AI (@rork/toolkit-sdk generateObject)
   - Supported commands:
     * "Update load status to [status]"
     * "Add note [note text]"
     * "What's my next pickup?"
     * "How many miles to delivery?"
     * "Call dispatch"
   
3. **Command Execution**:
   - Update load status in LoadContext
   - Add notes to current load
   - Show load information
   - Trigger actions based on parsed command
   
4. **Feedback System**:
   - Show transcribed text
   - Display command confirmation
   - Voice feedback (text-to-speech) for responses
   - Error handling for unrecognized commands
   
5. **Driver Settings**:
   - Enable/disable voice commands
   - Adjust sensitivity
   - Choose wake word (optional)
   
Use expo-av for audio recording on mobile, and Web Audio API for web. Make it work seamlessly while driving - safety is the top priority.`,
  },
  {
    id: 'load-marketplace',
    title: 'Load Board Marketplace',
    description: 'Create a marketplace where carriers can post available capacity and shippers can post available loads, enabling better load matching and reduced empty miles.',
    category: 'feature',
    priority: 'medium',
    estimatedTime: '3-4 days',
    benefits: [
      'Find backhaul opportunities',
      'Reduce empty miles by 30%',
      'Increase revenue per truck',
      'Build carrier network',
    ],
    prompt: `Build a load marketplace feature with these components:

1. **Marketplace Screen** (app/marketplace.tsx):
   - Two tabs: "Find Loads" and "Post Capacity"
   - Find Loads: Browse available loads from other carriers
   - Post Capacity: List available trucks/capacity
   - Filter by origin, destination, date, equipment type
   - Search functionality
   
2. **Load Posting** (app/post-load.tsx):
   - Form to post available loads
   - Fields: pickup location, delivery location, date, weight, equipment type, rate, contact info
   - Set visibility (public/private/network only)
   - Expiration date
   
3. **Capacity Posting** (app/post-capacity.tsx):
   - Form to post available trucks
   - Fields: current location, willing to go to, available date, truck type, rate expectations
   - Set visibility and expiration
   
4. **Matching Algorithm**:
   - Show relevant loads based on driver location and preferences
   - Calculate deadhead miles to pickup
   - Show profitability estimates
   - Rank by best match score
   
5. **Contact & Booking**:
   - In-app messaging to discuss loads
   - "Book Load" button to claim a load
   - Automatic status updates
   - Rating system after completion
   
6. **Data Structure** (types/marketplace.ts):
   - MarketplaceLoad: id, posterId, type (load/capacity), origin, destination, date, details, status, visibility
   
7. **Context** (contexts/MarketplaceContext.tsx):
   - Manage marketplace listings
   - Filter and search
   - Booking management
   
Use mock data initially. Design a clean, Tinder-like swipe interface for quick browsing on mobile.`,
  },
  {
    id: 'driver-scorecard',
    title: 'Driver Performance Scorecard',
    description: 'Comprehensive driver performance tracking with scores for safety, efficiency, customer satisfaction, and compliance. Include gamification elements to motivate drivers.',
    category: 'feature',
    priority: 'medium',
    estimatedTime: '2 days',
    benefits: [
      'Improve driver accountability',
      'Identify top performers',
      'Reduce accidents and violations',
      'Data-driven bonus/incentive programs',
    ],
    prompt: `Create a driver scorecard system with performance tracking:

1. **Performance Metrics**:
   - On-time delivery rate (target: >95%)
   - Safety score (accidents, violations, inspections)
   - Fuel efficiency (MPG compared to fleet average)
   - Load acceptance rate
   - Customer ratings (if applicable)
   - Compliance score (HOS, inspections, paperwork)
   - Overall performance score (weighted average)
   
2. **Driver Scorecard Screen** (app/scorecard.tsx):
   - Large overall score (0-100) at top
   - Breakdown by category with progress bars
   - Historical trend charts (weekly/monthly)
   - Badges and achievements
   - Leaderboard ranking
   - Improvement suggestions
   
3. **Gamification Elements**:
   - Achievement badges: "Safety Star", "Fuel Master", "On-Time Hero", "100 Loads", etc.
   - Weekly challenges: "Complete 5 loads on time", "Beat your MPG record"
   - Point system for achievements
   - Leaderboard with categories
   
4. **Admin Dashboard Integration**:
   - View all driver scorecards
   - Compare drivers side-by-side
   - Export performance reports
   - Set performance targets and goals
   
5. **Calculation Logic** (utils/performanceCalculator.ts):
   - Calculate each metric from load history
   - Weight factors: safety 30%, on-time 25%, efficiency 20%, compliance 15%, acceptance 10%
   - Update scores daily
   
6. **Notifications**:
   - Alert drivers when score changes significantly
   - Congratulate on achievements
   - Suggest improvements for low-scoring areas
   
Make the UI encouraging and positive. Focus on improvement, not punishment. Use colors and animations to make achievements feel rewarding.`,
  },
  {
    id: 'document-scanner',
    title: 'AI Document Scanner & Parser',
    description: 'Use AI to scan and automatically extract data from shipping documents like BOLs, rate confirmations, and PODs, eliminating manual data entry.',
    category: 'feature',
    priority: 'high',
    estimatedTime: '1-2 days',
    benefits: [
      'Eliminate 90% of manual data entry',
      'Reduce data entry errors',
      'Speed up load creation by 5x',
      'Improve document organization',
    ],
    requirements: [
      'AI vision API (available via @rork/toolkit-sdk)',
      'expo-camera for document capture',
    ],
    prompt: `Build an AI-powered document scanner with these capabilities:

1. **Document Scanner** (app/scan-document.tsx):
   - Use expo-camera to capture document photos
   - Auto-detect document edges and crop
   - Enhance image quality (contrast, brightness)
   - Support multiple pages
   
2. **AI Extraction** (utils/documentParser.ts):
   - Use @rork/toolkit-sdk generateObject with image input
   - Extract structured data from BOL, rate confirmation, POD
   - Fields to extract: shipper, consignee, pickup/delivery addresses, dates, weight, commodity, rate, reference numbers, special instructions
   - Return structured JSON matching Load type
   
3. **Review & Edit Screen** (app/review-scan.tsx):
   - Show extracted data in editable form
   - Display original document image side-by-side
   - Highlight low-confidence extractions
   - Allow manual corrections
   - "Create Load" button to save
   
4. **Document Library** (app/documents.tsx):
   - Store scanned documents with loads
   - Search documents by load, date, or content
   - Categorize: BOL, POD, Rate Confirmation, Invoice, Other
   - Generate PDFs from scans
   
5. **Quick Scan Feature**:
   - Add "Scan BOL" button to add-load screen
   - Pre-fill form with extracted data
   - Save time on manual entry
   
6. **AI Prompt Example**:
   "Extract shipping information from this Bill of Lading. Return JSON with fields: shipperName, shipperAddress, consigneeName, consigneeAddress, pickupDate, deliveryDate, weight, commodity, pieces, rateAmount, referenceNumber, specialInstructions. If a field is not visible, use null."
   
Make the scanning experience smooth and fast. The entire scan-to-load-creation flow should take under 60 seconds.`,
  },
  {
    id: 'maintenance-scheduler',
    title: 'Predictive Maintenance Scheduler',
    description: 'Track vehicle maintenance needs based on mileage, engine hours, and time intervals. Send automated reminders and predict potential issues before they cause breakdowns.',
    category: 'feature',
    priority: 'medium',
    estimatedTime: '2 days',
    benefits: [
      'Prevent breakdowns and costly repairs',
      'Reduce vehicle downtime by 40%',
      'Extend vehicle lifespan',
      'Maintain resale value',
    ],
    prompt: `Create a maintenance management system with predictive capabilities:

1. **Truck Profile** (types/truck.ts):
   - id, truckNumber, make, model, year, VIN
   - currentMileage, currentEngineHours
   - lastOilChange, lastTireRotation, lastInspection, etc.
   - maintenanceHistory array
   
2. **Maintenance Scheduler** (app/maintenance.tsx):
   - List of all trucks with maintenance status
   - Color-coded alerts: green (good), yellow (due soon), red (overdue)
   - Upcoming maintenance items for each truck
   - Quick action to mark maintenance as completed
   
3. **Maintenance Rules** (utils/maintenanceRules.ts):
   - Oil change: every 15,000 miles or 6 months
   - Tire rotation: every 10,000 miles
   - DOT inspection: every 12 months
   - Brake inspection: every 20,000 miles
   - Coolant flush: every 30,000 miles or 2 years
   - Air filter: every 25,000 miles
   - Custom intervals per truck type
   
4. **Predictive Alerts**:
   - Calculate "due in X miles" or "due in X days"
   - Send notifications 1000 miles before due
   - Escalate if overdue
   - Suggest scheduling downtime during slow periods
   
5. **Maintenance Log** (app/maintenance-log.tsx):
   - Record maintenance activities
   - Fields: truck, date, type, mileage, cost, vendor, notes, photos
   - Track maintenance costs per truck
   - Export maintenance history for truck sale
   
6. **Dashboard Integration**:
   - Admin dashboard: fleet-wide maintenance overview
   - Driver dashboard: their assigned truck status
   - Dispatcher: schedule loads around maintenance needs
   
7. **Cost Tracking**:
   - Track maintenance costs by truck and category
   - Calculate cost per mile
   - Compare trucks to identify high-maintenance vehicles
   - Budget forecasting
   
Include a maintenance calendar view showing all scheduled maintenance across the fleet. Make it easy to schedule and track.`,
  },
  {
    id: 'fuel-optimizer',
    title: 'Fuel Price Finder & Optimizer',
    description: 'Find cheapest fuel stations along routes, track fuel purchases, calculate actual MPG, and provide fuel-saving driving tips.',
    category: 'feature',
    priority: 'medium',
    estimatedTime: '2-3 days',
    benefits: [
      'Save 5-10% on fuel costs',
      'Optimize fuel stop locations',
      'Track real MPG performance',
      'Reduce fuel fraud/theft',
    ],
    requirements: [
      'Fuel price API (or manual entry with AsyncStorage)',
    ],
    prompt: `Build a fuel optimization system with these features:

1. **Fuel Finder** (app/fuel-finder.tsx):
   - Show nearby truck stops with fuel prices
   - Filter by brand, amenities (showers, parking, etc.)
   - Show distance from current location
   - Mark preferred stations
   - Navigate to selected station
   
2. **Route Fuel Planner** (components/RouteFuelPlanner.tsx):
   - Input: route and truck fuel capacity
   - Calculate optimal fuel stops to minimize cost
   - Consider: current fuel level, tank capacity, prices along route
   - Show total fuel cost for trip with vs without optimization
   
3. **Fuel Purchase Logging** (app/log-fuel.tsx):
   - Quick log: station, gallons, price per gallon, total cost
   - Auto-calculate current MPG based on miles since last fill
   - Take photo of receipt
   - Associate with current load or deadhead
   
4. **MPG Tracking** (app/fuel-analytics.tsx):
   - Real-time MPG calculation per fill-up
   - Historical MPG trends by driver/truck
   - Compare to fleet average
   - Identify factors affecting MPG (load weight, weather, route)
   
5. **Fuel Efficiency Tips**:
   - Show personalized tips based on driving behavior
   - "You could save $X/month by improving MPG by 0.5"
   - Tips: maintain 55-60 mph, avoid idling, proper tire pressure, etc.
   
6. **Admin Analytics**:
   - Fleet-wide fuel costs and consumption
   - Identify fuel efficiency leaders
   - Detect unusual fuel patterns (possible fraud)
   - Fuel cost trends over time
   
7. **Data Structure** (types/fuelPurchase.ts):
   - id, driverId, truckId, date, station, gallons, pricePerGallon, totalCost, odometer, mpg, receiptPhoto
   
For fuel prices, start with manual entry (drivers enter prices they see). Can add API integration later. Focus on tracking and analytics to help drivers improve MPG.`,
  },
  {
    id: 'customer-portal',
    title: 'Customer Shipment Tracking Portal',
    description: 'Give customers real-time visibility into their shipments with live tracking, ETAs, proof of delivery, and automated status notifications.',
    category: 'feature',
    priority: 'high',
    estimatedTime: '2-3 days',
    benefits: [
      'Reduce "where is my load?" calls by 80%',
      'Improve customer satisfaction',
      'Competitive advantage',
      'Professional image',
    ],
    prompt: `Create a customer-facing shipment tracking portal:

1. **Public Tracking Page** (app/track/[trackingId].tsx):
   - Public URL: /track/LOAD123456
   - No login required (secured by unique tracking ID)
   - Show: current status, current location (city/state), ETA, pickup/delivery info
   - Timeline view of load progress
   - Estimated time remaining
   - Driver contact info (optional, admin configurable)
   
2. **Tracking ID Generation** (utils/tracking.ts):
   - Generate unique tracking codes for each load
   - Format: 3 letters + 6 digits (e.g., TRK384729)
   - Store in load.trackingId field
   
3. **Map View** (optional):
   - Show approximate truck location on map
   - Privacy: show city level, not exact GPS
   - Pickup and delivery markers
   - Route path
   
4. **Automated Notifications**:
   - Send tracking link via email/SMS when load is created
   - Updates: picked up, in transit, out for delivery, delivered
   - ETA changes (delayed/early)
   - Include tracking link in all notifications
   
5. **Proof of Delivery**:
   - Show POD once delivered
   - Signature image (if captured)
   - Delivery photo
   - Timestamp and recipient name
   
6. **Branded Experience**:
   - Use company logo and colors from settings
   - Professional, customer-friendly design
   - Mobile-optimized (customers check from phones)
   
7. **Admin Controls** (settings/customer-portal.tsx):
   - Enable/disable customer tracking
   - Choose what information to show
   - Customize notification templates
   - Set default visibility options
   
8. **Share Tracking**:
   - "Share Tracking" button in load details
   - Generate shareable link
   - Copy to clipboard
   - Send via SMS/email
   
Make this customer-facing page very polished and professional. It represents your company to customers. Use smooth animations and clear status updates. Think like a customer who just wants to know "where is my stuff?"`,
  },
];
