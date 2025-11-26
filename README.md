# SAM Financial Portfolio Application

## Overview
The **SAM (Software Asset Management) Financial Portfolio** application is a modern, web-based platform designed to help organizations manage their software spend, track purchase orders (POs), and forecast financial commitments with precision. Built with **Next.js** and **Tailwind CSS**, it offers a responsive and interactive experience for Financial Analysts and Leadership.

## 🚀 Key Features

*   **📊 Financial Analyst Dashboard**: A comprehensive view of portfolio health with KPIs, PO lists, and actuals tracking.
*   **📝 Single PO Management**: Detailed view of PO attributes, renewal data, and financial breakdowns.
*   **📅 72-Month Forecast Manager**: 
    *   Interactive grid for managing long-term forecasts.
    *   Support for Monthly, Quarterly, and Yearly views.
    *   Inline editing with optimistic UI updates.
    *   Fiscal Year alignment (August start).
*   **📈 Leaders View**: 
    *   Executive dashboard visualizing spend by Organizational Level (L4/L5).
    *   Funding source analysis (Central vs Functional).
    *   Tier-based spend breakdown (Mega, Platinum, Gold, etc.).

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
*   **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
*   **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                    # Mock API Route Handlers
│   ├── home/
│   │   ├── financialAnalystsPortfolio/
│   │   │   ├── [poId]/         # Single PO Details & Forecast Pages
│   │   │   ├── leaders/        # Leaders View Dashboard
│   │   │   └── page.tsx        # Main Analyst Dashboard
│   └── page.tsx                # Landing Page (Module Hub)
├── components/
│   ├── ui/                     # Reusable UI components (Buttons, Cards, Tables)
│   └── ...
└── lib/                        # Utilities and helpers
```

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js 18+ 
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd sam_app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Mock Data
The application currently runs on **Mock APIs** defined in `src/app/api`. No external database connection is required for the initial demo. Data is generated on-the-fly or served from static mock objects to simulate a realistic environment.

## 🎨 Design System
The UI follows a clean, professional aesthetic suitable for enterprise financial tools:
*   **Colors**: Slate/Gray scale for structure, with semantic colors (Blue, Green, Red, Violet) for data visualization and status.
*   **Typography**: Inter (default Sans).
*   **Interactivity**: Hover effects, smooth transitions, and immediate feedback on user actions.

---
*Generated for SAM Project - November 2025*
