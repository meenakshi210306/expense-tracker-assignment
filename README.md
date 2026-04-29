# Expense Tracker

A full-stack web application for tracking personal expenses. Built with FastAPI (backend) and React + Vite (frontend).

## Features

- ✅ Add, view, update, and delete expenses
- 📊 Filter expenses by category and date range
- 💰 View expense summaries by category
- 📈 Monthly expense reports
- 🎨 Clean and responsive UI
- 🔄 Real-time updates

## Project Structure

```
expense-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── crud.py              # Database operations
│   │   └── routes.py            # API endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx  # Form to add expenses
│   │   │   ├── ExpenseList.jsx  # Display expenses
│   │   │   └── FilterBar.jsx    # Filter controls
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Styles
│   │   ├── main.jsx             # React entry point
│   │   └── api.js               # API client
│   ├── index.html               # HTML template
│   ├── package.json             # NPM dependencies
│   └── vite.config.js           # Vite configuration
│
├── README.md                    # This file
├── .gitignore                   # Git ignore rules
└── docker-compose.yml           # Docker compose (optional)
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8003
   ```

The API will be available at `http://localhost:8003`

API Documentation: `http://localhost:8003/docs`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5176`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./expense.db
ENVIRONMENT=development
DEBUG=True
```

### Frontend
Create a `.env.local` file in the frontend directory:
```
VITE_API_URL=http://localhost:8003/api
```

## API Endpoints

### Expenses
- `GET /api/expenses/` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses/` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/category/{category}` - Get expenses by category
- `GET /api/expenses/category/summary` - Get category summary
- `GET /api/expenses/monthly/{year}/{month}` - Get monthly summary

## Building for Production

### Backend
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Frontend
```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker Setup (Optional)

Build and run with Docker:
```bash
docker-compose up --build
```

## Technologies Used

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - ORM
- SQLite - Database
- Pydantic - Data validation

### Frontend
- React 18 - UI framework
- Vite - Build tool
- Axios - HTTP client

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

---

## Design Decisions & Architecture Notes

### Key Design Decisions

1. **React + Vite for Frontend**
   - Chose Vite over Create React App for faster dev server startup and smaller build size
   - Used React hooks (useState, useEffect) for simpler component state management instead of Redux
   
2. **FastAPI for Backend**
   - Selected FastAPI for automatic API documentation (Swagger UI), built-in validation, and modern async support
   - Used SQLAlchemy ORM with SQLite for simplicity and zero-dependency database setup
   
3. **Modal Form Pattern**
   - Expense form rendered as a modal overlay rather than inline to keep UI clean and focus user attention
   - Click outside modal closes it (standard UX pattern)
   
4. **Client-Side Sorting**
   - Expenses sorted by date (newest first) on the frontend to ensure consistent UI ordering
   - Sorting applied both on initial load and when new expenses are added
   
5. **Category Summary View**
   - Built as separate `CategorySummary` component to display spending breakdown by category
   - Uses grid layout for responsive design across devices
   
6. **Validation Layer**
   - Client-side validation (amount > 0, required fields) for instant user feedback
   - Server-side validation via Pydantic schemas ensures data integrity
   - Prevents duplicate form submissions by disabling button while loading

### Trade-Offs Made Due to Timebox

1. **State Management**
   - Used React `useState` directly instead of implementing Redux or Context API
   - Trade-off: Simpler code vs. slightly harder to manage state across deeply nested components
   - Why: Assignment deadline and current component tree is shallow enough for direct state passing
   
2. **Testing**
   - Prioritized feature completeness over automated unit/integration tests
   - Trade-off: No formal test suite vs. faster feature delivery
   - Why: Manual testing via UI sufficient for assignment scope; wrote clean, testable code for future expansion
   
3. **Database**
   - Used SQLite instead of PostgreSQL for zero setup overhead
   - Trade-off: Limited to single-server deployment vs. immediate productivity
   - Why: Sufficient for development/demo; can migrate to PostgreSQL later
   
4. **Styling**
   - Used vanilla CSS instead of CSS-in-JS (styled-components) or Tailwind
   - Trade-off: More CSS code vs. no additional dependencies
   - Why: Fast to prototype; CSS is scoped to components by class naming

### Intentionally NOT Implemented

1. **User Authentication**
   - No login/multi-user support; this is a personal expense tracker
   - Could add JWT auth later if needed
   
2. **Real-Time Sync**
   - No WebSocket for live updates across tabs/users
   - Design assumes single-user, single-device usage
   
3. **Data Export**
   - No CSV/PDF export features (could add as future enhancement)
   
4. **Offline Mode**
   - No service worker or local caching
   - Requires internet connection to fetch/save expenses
   
5. **Pagination**
   - Uses simple offset/limit on backend but loads all on frontend
   - Fine for ~1000 expenses; would refactor with virtual scrolling for larger datasets

### Architecture Highlights

- **API-First Design**: Frontend communicates entirely through REST API; backend is framework-agnostic
- **Separation of Concerns**: Backend handles business logic, database; frontend handles UI, user interaction
- **Error Handling**: User-friendly error messages in both form validation and API failures
- **Loading States**: Disabled buttons and loading text prevent accidental duplicate submissions
- **Responsive Design**: CSS grid/flexbox ensures app works on mobile, tablet, desktop

