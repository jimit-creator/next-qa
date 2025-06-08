# InterviewQA - Interview Preparation Platform

A comprehensive interview question and answer platform built with Next.js, TypeScript, and MongoDB.

## Features

- **Admin Panel**
  - Authentication system
  - Category management
  - Question management
  - Search and filtering

- **User Interface**
  - Browse questions by category
  - Search functionality
  - Bookmark questions
  - Responsive design

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

### Database Setup

#### Option 1: Using Scripts (Recommended)

```bash
# Setup database with migrations and seeders
npm run db:setup

# Or run individually:
npm run db:migrate up
npm run db:seed run
```

#### Option 2: Using API Endpoints

Visit `/admin/login` and click "Initialize Database" button.

#### Option 3: Manual Commands

```bash
# Run migrations
npm run db:migrate up
npm run db:migrate status
npm run db:migrate down <version>

# Run seeders
npm run db:seed run
npm run db:seed force
npm run db:seed reset
npm run db:seed status
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Default Admin Credentials

After database setup:
- **Email**: admin@example.com
- **Password**: admin123

## Database Management

### Migrations

Migrations handle database schema changes:

- **Create Migration**: Add new file in `database/migrations/`
- **Run Migrations**: `npm run db:migrate up`
- **Check Status**: `npm run db:migrate status`
- **Rollback**: `npm run db:migrate down <version>`

### Seeders

Seeders populate the database with default data:

- **Create Seeder**: Add new file in `database/seeders/`
- **Run Seeders**: `npm run db:seed run`
- **Force Run**: `npm run db:seed force`
- **Reset Database**: `npm run db:seed reset`

### API Endpoints

- `POST /api/database/setup` - Complete database setup
- `GET/POST /api/database/migrate` - Migration management
- `GET/POST /api/database/seed` - Seeder management

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # Reusable components
├── database/              # Database migrations and seeders
│   ├── migrations/        # Database schema migrations
│   └── seeders/          # Database seeders
├── lib/                   # Utility libraries
│   └── database/         # Database management classes
├── scripts/              # Database management scripts
└── types/                # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add migrations/seeders if needed
5. Test your changes
6. Submit a pull request

## License

This project is licensed under the MIT License.