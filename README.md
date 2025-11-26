# SAM Financial Portfolio Application

[![Deployment Status](https://img.shields.io/badge/vercel-deployed-success)](https://vercel.com)

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
sam_app/
├── src/
│   ├── app/
│   │   ├── api/                                    # Mock API Route Handlers
│   │   │   ├── account/v1/accounts/accesslevels/
│   │   │   │   └── [userid]/route.ts              # User modules/access levels
│   │   │   ├── datalake/v1/attributes/
│   │   │   │   └── purchaseorders/route.ts        # PO data endpoint
│   │   │   ├── dataloader/v1/attributes/purchaseorders/
│   │   │   │   └── aggregatePOWithoutMandatoryFY/route.ts  # Renewal candidates
│   │   │   └── financial-portfolio/
│   │   │       ├── route.ts                       # Portfolio aggregated data
│   │   │       ├── [poId]/forecast/route.ts       # 72-month forecast data
│   │   │       └── leaders-view/route.ts          # Leadership spend data
│   │   ├── home/
│   │   │   ├── financialAnalystsPortfolio/
│   │   │   │   ├── [poId]/
│   │   │   │   │   ├── page.tsx                   # Single PO Detail View
│   │   │   │   │   ├── forecast/page.tsx          # 72-Month Forecast Manager
│   │   │   │   │   └── renewal/page.tsx           # Renewal Analysis
│   │   │   │   ├── leaders/page.tsx               # Portfolio View for Leaders
│   │   │   │   └── page.tsx                       # Financial Analyst Dashboard
│   │   │   ├── snowFlakePoView/page.tsx           # PO Processing View
│   │   │   ├── viewasset/page.tsx                 # Enterprise Portfolio View
│   │   │   └── layout.tsx                         # Home layout wrapper
│   │   ├── layout.tsx                             # Root layout with providers
│   │   └── page.tsx                               # Landing Page (Module Hub)
│   ├── components/
│   │   ├── ui/                                    # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── data-table.tsx                     # Reusable data table
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── sonner.tsx
│   │   ├── providers.tsx                          # React Query provider
│   │   └── renewal-modal.tsx                      # Add as Renewal modal
│   └── lib/
│       └── utils.ts                               # Utility functions
├── docs/
│   ├── PRD.md                                     # Product Requirements Doc
│   └── README.md                                  # Original project docs
├── package.json
├── tsconfig.json
└── tailwind.config.ts
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
