# ShiftRx - Healthcare Staffing Marketplace

A Next.js application for healthcare facilities to post shifts and providers to apply for them.

## Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Language**: TypeScript 5
- **Database**: SQLite with Prisma ORM
- **State Management**: TanStack React Query 5.90.2
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Form Validation**: React Hook Form + Zod
- **Notifications**: Sonner

## Features

- Browse and filter available shifts
- Apply to shifts and withdraw applications
- View application history
- Admin users can create new shifts
- Hire providers for shifts (testable via API)
- View hired provider information on shift details

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Push the Prisma schema to create the database:

```bash
npm run db:push
```

### 3. Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

This creates:
- **5 users**: 1 admin + 4 healthcare providers
- **6 sample shifts** with various specialties
- **3 sample applications**

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Sample Users

The seed script creates these users:

- **admin@shiftrx.com** - Facility Admin (can create shifts)
- **sarah.johnson@example.com** - Dr. Sarah Johnson
- **mike.chen@example.com** - Nurse Mike Chen
- **emily.rodriguez@example.com** - Dr. Emily Rodriguez
- **james.wilson@example.com** - Nurse James Wilson

Switch between users using the dropdown in the header.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (visual database browser)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── users/
│   │   ├── shifts/
│   │   └── applications/
│   ├── applications/      # User applications page
│   └── shifts/            # Shift pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (Header)
│   ├── shifts/           # Shift-related components
│   └── applications/     # Application-related components
├── contexts/             # React Context providers
├── hooks/                # React Query hooks
├── lib/                  # Utilities and configurations
├── services/             # Business logic layer
│   ├── UserService.ts
│   ├── ShiftService.ts
│   └── ApplicationService.ts
└── types/                # TypeScript type definitions
```

## API Endpoints

### Users
- `GET /api/users` - Get all users

### Shifts
- `GET /api/shifts` - Get all shifts (with optional filters)
- `GET /api/shifts/[id]` - Get shift by ID
- `POST /api/shifts` - Create new shift (admin only)
- `POST /api/shifts/hire` - Hire a provider for a shift

### Applications
- `GET /api/applications` - Get applications by user
- `POST /api/applications` - Apply to a shift
- `PATCH /api/applications/[id]` - Update application status
- `DELETE /api/applications/[id]` - Delete application

## Testing the Hire Endpoint

You can test the hire endpoint using the included Postman collection:

```bash
# Import ShiftRx.postman_collection.json into Postman
# Run the "Complete Hire Workflow" folder requests 1-5 in sequence
```

Or use curl:

```bash
# 1. Get shifts to find a shift ID
curl http://localhost:3000/api/shifts

# 2. Get applications for that shift
curl http://localhost:3000/api/shifts/{shiftId}

# 3. Hire a provider
curl -X POST http://localhost:3000/api/shifts/hire \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "APPLICATION_ID",
    "shiftId": "SHIFT_ID"
  }'
```

## Architecture

This application follows a **service layer architecture**:

- **Routes**: Handle HTTP concerns (request/response)
- **Services**: Contain business logic and database operations
- **React Query**: Manages server state and caching
- **React Context**: Manages client state (user selection)

## License

This project is licensed under the MIT License.
