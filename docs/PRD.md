# Product Requirements Document (PRD) - SAM Financial Portfolio MVP

## 1. Executive Summary
The Software Asset Management (SAM) Financial Portfolio application is designed to empower Financial Analysts and Leadership with a comprehensive view of software spend, forecasts, and renewal lifecycles. This MVP focuses on providing interactive dashboards, detailed purchase order (PO) management, and granular forecasting capabilities to optimize financial planning and decision-making.

## 2. User Personas
*   **Financial Analyst**: Responsible for managing individual POs, updating forecasts, tracking actuals vs. budget, and preparing renewal strategies.
*   **Leadership / Executive**: Requires high-level visibility into organizational spend, funding sources, and top spending areas (Level 4/5 leaders) to drive strategic initiatives.

## 3. Key Features & Functional Requirements

### 3.1. Landing Page / Module Hub
*   **Objective**: Central entry point for all SAM modules.
*   **Features**:
    *   Dynamic card-based layout displaying available modules based on user access.
    *   **Modules Implemented**:
        *   Financial Analysts PO Portfolio
        *   Portfolio View for Leaders
        *   Purchase Order Processing
        *   Enterprise Software Portfolio
    *   Responsive grid layout.

### 3.2. Financial Analyst Portfolio Dashboard
*   **Objective**: Operational hub for analysts to monitor their portfolio health.
*   **Features**:
    *   **KPI Cards**: Real-time metrics for Total Annualized Spend, Forecast (CY/FY), Commit, Actuals (YTD/MTD), and Variance.
    *   **Tabbed Interface**:
        *   **POs**: Searchable/Sortable data table of owned Purchase Orders.
        *   **Forecast**: 72-month forecast matrix summary.
        *   **Actuals**: Feed of actual spend data.
        *   **Renewals**: Upcoming renewal candidates with risk assessment.
        *   **Charts**: Visualizations for Forecast vs Actuals (Burn-up) and Variance Waterfall.
    *   **Filtering**: Filter by Fiscal Year and Department.

### 3.3. Single PO Detail View
*   **Objective**: Deep dive into a specific Purchase Order's attributes and financial status.
*   **Features**:
    *   **Header**: PO Number, Vendor, Status, and Edit controls.
    *   **Data Sections**:
        *   **Main PO Data**: Cost Pool, Category, Leadership hierarchy (L2-L5), Owners.
        *   **Renewal PO Data**: Term, Dates, Deal Status, Opportunity Status.
    *   **Financial Grids**: Quarterly breakdown of Commit, Actuals, Forecast, and Potential Liability.
    *   **Uplift Analysis**: Scenario planning for Price, Volume, and Expansion changes.
    *   **Navigation**: Links to Renewal Analysis and Forecast Manager.

### 3.4. 72-Month Forecast Manager
*   **Objective**: Granular control over long-term financial forecasting.
*   **Features**:
    *   **Multi-Granularity Views**: Toggle between Monthly, Quarterly, and Yearly views.
    *   **Interactive Grid**:
        *   Expandable quarters to reveal monthly details.
        *   **Inline Editing**: Direct manipulation of forecast amounts for future periods.
        *   **Smart Aggregation**: Editing a quarter automatically distributes amounts to months.
        *   **Visual Indicators**: Color-coded variance (Green/Yellow/Red) comparing Forecast vs Actuals.
        *   **Status Locking**: Past periods locked; future periods editable.
    *   **Fiscal Year Logic**: Aligned with fiscal calendar (FY starts in August).

### 3.5. Portfolio View for Leaders
*   **Objective**: Executive summary of spend distribution.
*   **Features**:
    *   **Top Spend Charts**:
        *   **Level 4 Leaders**: Stacked bar chart broken down by Tiers (Mega, Platinum, Gold, etc.).
        *   **Level 5 Leaders**: Horizontal bar chart of top spenders.
    *   **Funding Source Analysis**:
        *   Donut charts comparing Central vs Functional funding.
        *   Vertical bar charts showing tier distribution within funding sources.
    *   **Global Filters**: Filter dashboard by SLT Leader, Funding Source, COGS/OPEX, etc.

## 4. Technical Architecture

### 4.1. Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: Shadcn UI (Radix Primitives)
*   **State/Data Fetching**: TanStack Query (React Query)
*   **Icons**: Lucide React

### 4.2. Data Model (Mock)
*   **API Routes**: Next.js Route Handlers simulating backend endpoints.
*   **Endpoints**:
    *   `/api/financial-portfolio`: Aggregated portfolio data.
    *   `/api/financial-portfolio/[poId]/forecast`: Granular 72-month forecast data.
    *   `/api/financial-portfolio/leaders-view`: Aggregated leadership spend data.
    *   `/api/datalake/v1/attributes/purchaseorders`: Detailed PO attributes.

### 4.3. Rendering Strategy & Performance
*   **Hybrid Rendering Model**:
    *   **SSG (Static Site Generation)**: Landing page, Financial Analyst Portfolio main page, and Leaders View are pre-rendered at build time for optimal performance.
    *   **SSR (Server-Side Rendering)**: Dynamic routes like `[poId]` pages and API routes render on-demand per request.
    *   **Client Components**: Interactive pages (marked with `'use client'`) use client-side rendering for real-time interactivity (e.g., Forecast Manager with inline editing).
*   **Next.js App Router**: Leverages React Server Components architecture for optimal code splitting and reduced JavaScript bundle size.
*   **Turbopack**: Next.js 16's high-performance bundler provides significantly faster builds and hot module replacement (HMR) compared to Webpack.

### 4.4. State Management
*   **Server State**: Managed via **TanStack Query (React Query)**:
    *   Automatic caching, background refetching, and request deduplication.
    *   Optimistic updates for instant UI feedback (e.g., editing forecast cells).
    *   Query invalidation for data consistency.
*   **Local UI State**: React's built-in `useState` and `useReducer` for component-level state (e.g., expanded rows, active filters, editing mode).
*   **No Global Store**: Intentionally avoided Redux/Zustand to keep the architecture simple; React Query handles most cross-component state synchronization.

## 5. Future Roadmap
*   **Backend Integration**: Replace mock API routes with real database connections (PostgreSQL/Snowflake).
*   **Authentication**: Integrate SSO/Auth0 for secure access.
*   **Export/Import**: Enable Excel/CSV export for forecasts and reports.
*   **Comment System**: Add collaboration features on POs and Forecasts.
