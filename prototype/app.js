// Global Tech Forecast & AFE Platform — Clickable Prototype
// All page content, navigation, and interactions

let currentRole = 'budget-owner'; // budget-owner | finance | approver
let currentPage = 'dashboard';
let currentSubTab = {};

// ===== PAGE TEMPLATES =====

const pages = {

// ----- DASHBOARD -----
dashboard: () => `
<div class="page-enter">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-xl font-bold">Good morning, John</h1>
      <p class="text-sm text-gray-500 mt-1">FY26 · Cost Center CC-4201 (Cloud Engineering)</p>
    </div>
    <div class="flex gap-2">
      <select class="text-xs border border-gray-200 rounded-md px-3 py-1.5 bg-white">
        <option>FY26 (Aug 2025 – Jul 2026)</option>
        <option>FY27 (Aug 2026 – Jul 2027)</option>
      </select>
      <button class="btn-primary" onclick="navigateTo('people')">+ New Forecast Version</button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="grid grid-cols-4 gap-4 mb-6">
    <div class="kpi-card">
      <div class="text-[10px] text-gray-500 uppercase tracking-wide">Total Forecast</div>
      <div class="text-2xl font-bold mt-1">$4.82M</div>
      <div class="text-[11px] text-green-600 mt-1">↑ 3.2% vs prior version</div>
    </div>
    <div class="kpi-card">
      <div class="text-[10px] text-gray-500 uppercase tracking-wide">Actuals YTD</div>
      <div class="text-2xl font-bold mt-1">$1.21M</div>
      <div class="text-[11px] text-gray-500 mt-1">3 months completed</div>
    </div>
    <div class="kpi-card">
      <div class="text-[10px] text-gray-500 uppercase tracking-wide">Pending Actions</div>
      <div class="text-2xl font-bold mt-1 text-amber-500">5</div>
      <div class="text-[11px] text-amber-600 mt-1">2 urgent approvals</div>
    </div>
    <div class="kpi-card">
      <div class="text-[10px] text-gray-500 uppercase tracking-wide">Active AFEs</div>
      <div class="text-2xl font-bold mt-1">3</div>
      <div class="text-[11px] text-blue-600 mt-1">1 in review</div>
    </div>
  </div>

  <!-- Workflow Status -->
  ${workflowBar()}

  <!-- Quick Actions + Activity -->
  <div class="grid grid-cols-2 gap-4 mt-6">
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <h3 class="text-sm font-semibold mb-3">Quick Actions</h3>
      <div class="space-y-2">
        <div class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onclick="navigateTo('people')">
          <span class="w-7 h-7 bg-blue-100 rounded flex items-center justify-center text-xs">📝</span>
          <div><div class="text-xs font-medium">Submit Forecast v3 for Review</div><div class="text-[10px] text-gray-500">2 blocking issues remain</div></div>
        </div>
        <div class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onclick="navigateTo('people')">
          <span class="w-7 h-7 bg-green-100 rounded flex items-center justify-center text-xs">👤</span>
          <div><div class="text-xs font-medium">New Hiring Request</div><div class="text-[10px] text-gray-500">Add incremental headcount</div></div>
        </div>
        <div class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onclick="navigateTo('afe')">
          <span class="w-7 h-7 bg-amber-100 rounded flex items-center justify-center text-xs">📄</span>
          <div><div class="text-xs font-medium">Create New AFE</div><div class="text-[10px] text-gray-500">Capital authorization request</div></div>
        </div>
        <div class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onclick="navigateTo('cross-cost')">
          <span class="w-7 h-7 bg-purple-100 rounded flex items-center justify-center text-xs">🔗</span>
          <div><div class="text-xs font-medium">Review Cross-Cost Requests</div><div class="text-[10px] text-gray-500">3 pending estimates</div></div>
        </div>
      </div>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <h3 class="text-sm font-semibold mb-3">Recent Activity</h3>
      <div class="space-y-3">
        <div class="flex gap-2 text-xs"><div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div><div><strong>Finance</strong> requested info on DevOps rate override<br><span class="text-gray-400">2 hours ago</span></div></div>
        <div class="flex gap-2 text-xs"><div class="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div><div><strong>CloudOps</strong> submitted cross-cost estimate for PRJ-0042<br><span class="text-gray-400">Yesterday</span></div></div>
        <div class="flex gap-2 text-xs"><div class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div><div><strong>AFE-2025-003</strong> approved by VP Finance<br><span class="text-gray-400">2 days ago</span></div></div>
        <div class="flex gap-2 text-xs"><div class="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div><div><strong>Workday actuals</strong> ingested — $2.3K variance detected<br><span class="text-gray-400">3 days ago</span></div></div>
        <div class="flex gap-2 text-xs"><div class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div><div><strong>Security team</strong> reconfirmed estimate for PRJ-0018<br><span class="text-gray-400">4 days ago</span></div></div>
      </div>
    </div>
  </div>
</div>
`,

// ----- PEOPLE TAB -----
people: () => `
<div class="page-enter">
  ${forecastTabBar('people')}
  ${subTabBar('people', ['Hiring Requests', 'Approved Team', 'Monthly Grid'])}

  <div id="people-subtab-content">
    ${getPeopleSubContent()}
  </div>
</div>
`,

// ----- SOFTWARE TAB -----
software: () => `
<div class="page-enter">
  ${forecastTabBar('software')}
  ${subTabBar('software', ['All Software', 'By Vendor', 'Monthly Grid'])}

  <!-- KPIs -->
  <div class="grid grid-cols-4 gap-3 mb-4">
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Total Software</div><div class="text-lg font-bold mt-1">$1.42M</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Renewals Due</div><div class="text-lg font-bold mt-1 text-amber-500">3</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">CapEx Portion</div><div class="text-lg font-bold mt-1">$380K</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">OpEx Portion</div><div class="text-lg font-bold mt-1">$1.04M</div></div>
  </div>

  <!-- Filters + Add -->
  <div class="flex justify-between items-center mb-3">
    <div class="flex gap-2">
      <input class="text-xs border border-gray-200 rounded-md px-3 py-1.5 w-40" placeholder="Search software...">
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white"><option>All Funding Types</option></select>
    </div>
    <button class="btn-primary budget-owner-only" onclick="openModal('add-software')">+ Add Software Expense</button>
  </div>

  <!-- Table -->
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th class="finance-col">Cost Ctr</th>
          <th>Software / License</th>
          <th>Vendor</th>
          <th>Project ID</th>
          <th>Type</th>
          <th>Funding</th>
          <th class="text-right">Annual Cost</th>
          <th class="text-right">Monthly</th>
          <th>Renewal</th>
          <th>Status</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="finance-col font-medium">CC-4201</td>
          <td class="font-medium">Snowflake Enterprise</td>
          <td>Snowflake Inc</td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0042</code></td>
          <td><span class="badge badge-draft">SaaS</span></td>
          <td>OpEx</td>
          <td class="text-right font-semibold">$420,000</td>
          <td class="text-right">$35,000</td>
          <td>Mar 2026</td>
          <td><span class="badge badge-approved">Active</span></td>
          <td class="text-center"><button class="text-blue-500 hover:text-blue-700 budget-owner-only">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col font-medium">CC-4201</td>
          <td class="font-medium">Dynatrace Full-Stack</td>
          <td>Dynatrace LLC</td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0018</code></td>
          <td><span class="badge badge-warning">License</span></td>
          <td>CapEx</td>
          <td class="text-right font-semibold">$280,000</td>
          <td class="text-right">$23,333</td>
          <td class="text-amber-600 font-semibold">⚠️ Oct 2025</td>
          <td><span class="badge badge-warning">Renewal Due</span></td>
          <td class="text-center"><button class="text-blue-500 hover:text-blue-700 budget-owner-only">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col font-medium">CC-4201</td>
          <td class="font-medium">GitHub Enterprise</td>
          <td>Microsoft</td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0042</code></td>
          <td><span class="badge badge-draft">SaaS</span></td>
          <td>OpEx</td>
          <td class="text-right font-semibold">$156,000</td>
          <td class="text-right">$13,000</td>
          <td>Jul 2026</td>
          <td><span class="badge badge-approved">Active</span></td>
          <td class="text-center"><button class="text-blue-500 hover:text-blue-700 budget-owner-only">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col font-medium">CC-4305</td>
          <td class="font-medium">Jira + Confluence</td>
          <td>Atlassian</td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0042</code></td>
          <td><span class="badge badge-draft">SaaS</span></td>
          <td>OpEx</td>
          <td class="text-right font-semibold">$98,000</td>
          <td class="text-right">$8,167</td>
          <td>Jan 2026</td>
          <td><span class="badge badge-approved">Active</span></td>
          <td class="text-center"><button class="text-blue-500 hover:text-blue-700 budget-owner-only">✏️</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`,

// ----- OPERATING TAB -----
operating: () => `
<div class="page-enter">
  ${forecastTabBar('operating')}
  ${subTabBar('operating', ['All Expenses', 'By Category', 'Monthly Grid'])}

  <!-- KPIs -->
  <div class="grid grid-cols-4 gap-3 mb-4">
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Total Operating</div><div class="text-lg font-bold mt-1">$620K</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Recurring</div><div class="text-lg font-bold mt-1">$485K</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">One-time</div><div class="text-lg font-bold mt-1">$135K</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Categories</div><div class="text-lg font-bold mt-1">5</div></div>
  </div>

  <!-- Filters + Add -->
  <div class="flex justify-between items-center mb-3">
    <div class="flex gap-2">
      <input class="text-xs border border-gray-200 rounded-md px-3 py-1.5 w-40" placeholder="Search expenses...">
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white">
        <option>All Categories</option><option>Infrastructure</option><option>Travel</option><option>Training</option><option>Professional Services</option>
      </select>
    </div>
    <button class="btn-primary budget-owner-only" onclick="openModal('add-expense')">+ Add Operating Expense</button>
  </div>

  <!-- Table -->
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th class="finance-col">Cost Ctr</th>
          <th>Expense Description</th>
          <th>Category</th>
          <th>Project ID</th>
          <th>Recurring</th>
          <th>Funding</th>
          <th class="text-right">Annual Cost</th>
          <th class="text-right">Monthly</th>
          <th>Period</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">AWS Cloud Hosting</td>
          <td><span class="badge" style="background:#e0f2fe;color:#0369a1">Infrastructure</span></td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0042</code></td>
          <td>✓ Monthly</td>
          <td>OpEx</td>
          <td class="text-right font-semibold">$240,000</td>
          <td class="text-right">$20,000</td>
          <td>Aug '25 – Ongoing</td>
          <td class="text-center"><button class="text-blue-500 budget-owner-only">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">Security Consulting (Deloitte)</td>
          <td><span class="badge" style="background:#f3e8ff;color:#6b21a8">Prof. Services</span></td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0018</code></td>
          <td>✓ Monthly</td>
          <td>CapEx</td>
          <td class="text-right font-semibold">$180,000</td>
          <td class="text-right">$15,000</td>
          <td>Sep '25 – Feb '26</td>
          <td class="text-center"><button class="text-blue-500 budget-owner-only">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">Team Offsite Q1</td>
          <td><span class="badge" style="background:#fce7f3;color:#be185d">Travel</span></td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0042</code></td>
          <td>One-time</td>
          <td>OpEx</td>
          <td class="text-right font-semibold">$45,000</td>
          <td class="text-right">—</td>
          <td>Nov 2025</td>
          <td class="text-center"><button class="text-blue-500 budget-owner-only">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">Cloud Certification Training</td>
          <td><span class="badge" style="background:#dcfce7;color:#166534">Training</span></td>
          <td><code class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">PRJ-0042</code></td>
          <td>✓ Quarterly</td>
          <td>OpEx</td>
          <td class="text-right font-semibold">$60,000</td>
          <td class="text-right">$5,000</td>
          <td>Aug '25 – Jul '26</td>
          <td class="text-center"><button class="text-blue-500 budget-owner-only">✏️</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`,

// ----- APPROVALS -----
approvals: () => `
<div class="page-enter">
  <div class="flex justify-between items-center mb-4">
    <div>
      <h1 class="text-lg font-bold">Approvals Queue</h1>
      <p class="text-xs text-gray-500 mt-0.5">Items awaiting your review or action</p>
    </div>
    <div class="flex gap-2">
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white">
        <option>All Types</option><option>Forecasts</option><option>AFEs</option><option>Resource Requests</option>
      </select>
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white">
        <option>Most Recent</option><option>Urgent First</option>
      </select>
    </div>
  </div>

  <div class="space-y-3">
    ${approvalCard('Forecast v3 — CC-4201 (Cloud Engineering)', 'John Smith', 'Submitted', 'Forecast', '$4.82M total · 2 blocking issues resolved', 'submitted')}
    ${approvalCard('AFE-2025-004 — Data Platform Migration', 'Sarah Chen', 'In Review', 'AFE', '$1.2M CapEx · AI memo generated', 'submitted')}
    ${approvalCard('Resource Request — 3× Data Analysts (India)', 'John Smith', 'Pending Finance', 'Resource', '$207K annual · Contractor · Start Oct 2025', 'warning')}
    ${approvalCard('Forecast v2 — CC-4305 (Security)', 'Mike Johnson', 'Ready for Approval', 'Forecast', '$2.1M total · No issues', 'approved')}
    ${approvalCard('Cross-Cost Estimate — CloudOps for PRJ-0042', 'Jane Davis', 'Estimated', 'Cross-Cost', '$340K · 4 FTEs allocated Q1-Q3', 'approved')}
  </div>
</div>
`,

// ----- CROSS COST CENTER -----
'cross-cost': () => `
<div class="page-enter">
  <div class="flex justify-between items-center mb-4">
    <div>
      <h1 class="text-lg font-bold">Cross-Cost Center Orchestration</h1>
      <p class="text-xs text-gray-500 mt-0.5">Track dependencies and estimates across cost centers for your projects</p>
    </div>
    <button class="btn-primary budget-owner-only" onclick="openModal('add-cross-cost')">+ New Cross-Cost Request</button>
  </div>

  <!-- Project selector -->
  <div class="bg-white border border-gray-200 rounded-xl p-4 mb-4">
    <div class="flex items-center gap-4">
      <div>
        <div class="text-[10px] text-gray-500 uppercase font-semibold">Project</div>
        <select class="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white mt-1 font-medium">
          <option>PRJ-0042 — Cloud Migration Platform</option>
          <option>PRJ-0018 — Security Modernization</option>
        </select>
      </div>
      <div class="ml-auto grid grid-cols-3 gap-6 text-center">
        <div><div class="text-[10px] text-gray-500">Total Deps</div><div class="text-lg font-bold">4</div></div>
        <div><div class="text-[10px] text-gray-500">Estimated</div><div class="text-lg font-bold text-green-600">2</div></div>
        <div><div class="text-[10px] text-gray-500">Pending</div><div class="text-lg font-bold text-amber-500">2</div></div>
      </div>
    </div>
  </div>

  <!-- Dependency Tracker -->
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th>Service / Team</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Estimated Cost</th>
          <th>FTEs</th>
          <th>Last Updated</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-medium">☁️ CloudOps / DevOps</td>
          <td>Jane Davis</td>
          <td><span class="badge badge-approved">✓ Estimated</span></td>
          <td class="font-semibold">$340,000</td>
          <td>4</td>
          <td>2 days ago</td>
          <td class="text-center"><button class="text-blue-500 text-xs hover:underline" onclick="openModal('view-estimate')">View</button></td>
        </tr>
        <tr>
          <td class="font-medium">🔒 Security</td>
          <td>Mike Torres</td>
          <td><span class="badge badge-approved">✓ Estimated</span></td>
          <td class="font-semibold">$180,000</td>
          <td>2</td>
          <td>5 days ago</td>
          <td class="text-center"><button class="text-blue-500 text-xs hover:underline" onclick="openModal('view-estimate')">View</button></td>
        </tr>
        <tr class="bg-amber-50/50">
          <td class="font-medium">📊 Data Engineering</td>
          <td>Sarah Chen</td>
          <td><span class="badge badge-warning">⏳ Requested</span></td>
          <td class="text-gray-400">Pending</td>
          <td class="text-gray-400">—</td>
          <td class="text-gray-500">Sent 3 days ago</td>
          <td class="text-center"><button class="text-xs text-gray-500">Remind</button></td>
        </tr>
        <tr class="bg-orange-50/50">
          <td class="font-medium">🛡️ Privacy & Compliance</td>
          <td>Alex Kim</td>
          <td><span class="badge" style="background:#fff7ed;color:#c2410c">🔄 Reconfirm Needed</span></td>
          <td class="text-gray-400 line-through">$95,000</td>
          <td class="text-gray-400">1</td>
          <td>Scope changed 1 day ago</td>
          <td class="text-center"><button class="text-xs text-orange-600 hover:underline">Nudge</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Legend -->
  <div class="flex gap-4 mt-3 text-[10px] text-gray-500">
    <span>🟢 <strong>Estimated</strong> — Cost center provided numbers</span>
    <span>⚪ <strong>Requested</strong> — Awaiting response</span>
    <span>🟠 <strong>Reconfirm Needed</strong> — Scope/timeline changed</span>
  </div>
</div>
`,

// ----- AFE -----
afe: () => `
<div class="page-enter">
  <div class="flex justify-between items-center mb-4">
    <div>
      <h1 class="text-lg font-bold">Authorization for Expenditure (AFE)</h1>
      <p class="text-xs text-gray-500 mt-0.5">Capital project authorization requests</p>
    </div>
    <button class="btn-primary budget-owner-only" onclick="openModal('create-afe')">+ Create New AFE</button>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th>AFE ID</th>
          <th>Project</th>
          <th>Description</th>
          <th class="text-right">Amount</th>
          <th>Status</th>
          <th>Submitted</th>
          <th>Approval Chain</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-mono font-medium text-blue-600">AFE-2025-004</td>
          <td>PRJ-0042</td>
          <td>Data Platform Migration</td>
          <td class="text-right font-semibold">$1,200,000</td>
          <td><span class="badge badge-submitted">In Review</span></td>
          <td>Apr 28, 2025</td>
          <td class="text-[10px]"><span class="text-green-600">VP ✓</span> → <span class="font-bold text-blue-600">L1 ●</span> → CIO → SVP</td>
          <td class="text-center"><button class="text-blue-500 text-xs hover:underline">View</button></td>
        </tr>
        <tr>
          <td class="font-mono font-medium text-blue-600">AFE-2025-003</td>
          <td>PRJ-0018</td>
          <td>Security Platform Upgrade</td>
          <td class="text-right font-semibold">$800,000</td>
          <td><span class="badge badge-approved">Approved</span></td>
          <td>Mar 15, 2025</td>
          <td class="text-[10px]"><span class="text-green-600">VP ✓</span> → <span class="text-green-600">L1 ✓</span> → <span class="text-green-600">CIO ✓</span> → <span class="text-green-600">SVP ✓</span></td>
          <td class="text-center"><button class="text-blue-500 text-xs hover:underline">Memo</button></td>
        </tr>
        <tr>
          <td class="font-mono font-medium text-blue-600">AFE-2025-005</td>
          <td>PRJ-0055</td>
          <td>AI/ML Infrastructure</td>
          <td class="text-right font-semibold">$2,400,000</td>
          <td><span class="badge badge-draft">Draft</span></td>
          <td>—</td>
          <td class="text-[10px] text-gray-400">Not submitted</td>
          <td class="text-center budget-owner-only"><button class="text-blue-500 text-xs hover:underline">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`,

// ----- CAPITAL TAB -----
capital: () => `
<div class="page-enter">
  ${forecastTabBar('capital')}
  ${subTabBar('capital', ['All Capital', 'SOW / Contracts', 'Monthly Grid'])}
  <div class="bg-white border border-gray-200 rounded-xl p-8 text-center mt-4">
    <div class="text-3xl mb-2">🏗️</div>
    <h3 class="font-semibold">Capital Expenses</h3>
    <p class="text-xs text-gray-500 mt-1">Capital expenditure tracking and SOW/Contract matching (Finance view)</p>
    <p class="text-xs text-gray-400 mt-3">Similar structure to Software tab — with CapEx-specific metadata and SOW matching sub-view for Finance operators.</p>
  </div>
</div>
`,

// ----- AUDIT TAB -----
audit: () => `
<div class="page-enter">
  ${forecastTabBar('audit')}
  <div class="flex justify-between items-center mb-4 mt-4">
    <h2 class="text-sm font-semibold">Version History — CC-4201</h2>
    <button class="btn-secondary text-xs">Compare Versions</button>
  </div>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead><tr><th>Version</th><th>Status</th><th>Created</th><th>Modified By</th><th>Total Forecast</th><th>Changes</th><th class="text-center">Actions</th></tr></thead>
      <tbody>
        <tr class="bg-blue-50/30"><td class="font-medium">v3 (Current)</td><td><span class="badge badge-submitted">Submitted</span></td><td>May 1, 2025</td><td>John Smith</td><td class="font-semibold">$4.82M</td><td class="text-xs">+2 hiring requests, rate override on 1 contractor</td><td class="text-center"><button class="text-blue-500 text-xs">View</button></td></tr>
        <tr><td class="font-medium">v2</td><td><span class="badge badge-approved">Approved</span></td><td>Apr 15, 2025</td><td>John Smith</td><td class="font-semibold">$4.67M</td><td class="text-xs">Added Snowflake license, adjusted Q3 ops</td><td class="text-center"><button class="text-blue-500 text-xs">View</button></td></tr>
        <tr><td class="font-medium">v1</td><td><span class="badge badge-approved">Approved</span></td><td>Mar 1, 2025</td><td>John Smith</td><td class="font-semibold">$4.20M</td><td class="text-xs">Initial FY26 forecast</td><td class="text-center"><button class="text-blue-500 text-xs">View</button></td></tr>
      </tbody>
    </table>
  </div>
</div>
`,

// ----- RESOURCE REQUESTS -----
'resource-requests': () => `
<div class="page-enter">
  <div class="flex justify-between items-center mb-4">
    <div><h1 class="text-lg font-bold">Resource Requests</h1><p class="text-xs text-gray-500 mt-0.5">Track and manage incremental headcount requests</p></div>
    <button class="btn-primary budget-owner-only">+ New Request</button>
  </div>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead><tr><th>Request</th><th>Role</th><th>Type</th><th>Country</th><th>HC</th><th>Funding</th><th>Start</th><th>Status</th><th>Decision</th></tr></thead>
      <tbody>
        <tr><td class="font-medium">RR-001</td><td>Sr. Cloud Engineer</td><td><span class="badge badge-draft">FTE</span></td><td>US</td><td>2</td><td>CapEx</td><td>Sep 2025</td><td><span class="badge badge-approved">Approved</span></td><td class="text-xs text-gray-500">Apr 20</td></tr>
        <tr><td class="font-medium">RR-002</td><td>Data Analyst</td><td><span class="badge badge-warning">Contractor</span></td><td>India</td><td>3</td><td>OpEx</td><td>Oct 2025</td><td><span class="badge badge-submitted">Pending Finance</span></td><td>—</td></tr>
        <tr><td class="font-medium">RR-003</td><td>Security Architect</td><td><span class="badge badge-draft">FTE</span></td><td>US</td><td>1</td><td>CapEx</td><td>Aug 2025</td><td><span class="badge badge-draft">Draft</span></td><td>—</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,

// ----- MEMOS -----
memos: () => `
<div class="page-enter">
  <div class="mb-4"><h1 class="text-lg font-bold">Executive Memos</h1><p class="text-xs text-gray-500 mt-0.5">Immutable executive memos generated post-AFE approval</p></div>
  <div class="space-y-3">
    <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-lg">📄</div>
        <div><div class="text-sm font-medium">AFE-2025-003 — Security Platform Upgrade</div><div class="text-xs text-gray-500">Approved Mar 22, 2025 · $800K · Generated by AI Writing Assist</div></div>
      </div>
      <button class="btn-secondary text-xs">View PDF</button>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-lg">📄</div>
        <div><div class="text-sm font-medium">AFE-2025-001 — Network Refresh Phase 2</div><div class="text-xs text-gray-500">Approved Jan 10, 2025 · $560K</div></div>
      </div>
      <button class="btn-secondary text-xs">View PDF</button>
    </div>
  </div>
</div>
`
};

// ===== HELPER TEMPLATES =====

function workflowBar() {
  return `
  <div class="bg-white border border-gray-200 rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3 text-xs">
        <span class="font-semibold">Forecast Version:</span>
        <span class="bg-gray-100 px-2 py-0.5 rounded">v3 (Draft → Submitted)</span>
        <span class="text-gray-400">|</span>
        <span class="text-gray-500">ForecastSet: FS-2025-CC4201</span>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary text-[10px] py-1 px-2">Recall to Draft</button>
        <button class="btn-secondary text-[10px] py-1 px-2">Compare with v2</button>
      </div>
    </div>
    <div class="flex items-center gap-0">
      <div class="workflow-step completed"><div class="step-label text-[10px] font-semibold">✓ Draft</div><div class="text-[9px] text-gray-500 mt-0.5">May 1</div></div>
      <div class="workflow-connector done"></div>
      <div class="workflow-step current"><div class="step-label text-[10px]">● Submitted</div><div class="text-[9px] mt-0.5">Current</div></div>
      <div class="workflow-connector"></div>
      <div class="workflow-step"><div class="step-label text-[10px]">Ready for Approval</div><div class="text-[9px] text-gray-400 mt-0.5">Dual confirm</div></div>
      <div class="workflow-connector"></div>
      <div class="workflow-step"><div class="step-label text-[10px]">🔒 Locked</div><div class="text-[9px] text-gray-400 mt-0.5">In chain</div></div>
      <div class="workflow-connector"></div>
      <div class="workflow-step"><div class="step-label text-[10px]">✓ Approved</div><div class="text-[9px] text-gray-400 mt-0.5">Immutable</div></div>
    </div>
    <div class="mt-3 bg-blue-50 rounded-lg p-2.5 flex items-center justify-between">
      <span class="text-[10px] text-blue-800"><strong>Next:</strong> Finance confirms readiness → moves to "Ready for Approval"</span>
    </div>
  </div>`;
}

function forecastTabBar(active) {
  const tabs = [
    { id: 'people', label: 'People', icon: '👥' },
    { id: 'software', label: 'Software', icon: '💻' },
    { id: 'operating', label: 'Operating', icon: '⚙️' },
    { id: 'capital', label: 'Capital', icon: '🏗️' },
    { id: 'audit', label: 'Audit', icon: '📋' },
  ];
  return `
  <div class="flex border-b border-gray-200 mb-0">
    ${tabs.map(t => `
      <button onclick="navigateTo('${t.id}')" class="px-4 py-2.5 text-xs font-medium transition ${t.id === active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}">
        ${t.icon} ${t.label}
      </button>
    `).join('')}
  </div>`;
}

function subTabBar(page, tabs) {
  const activeTab = currentSubTab[page] || 0;
  return `
  <div class="flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-b-lg mb-4">
    ${tabs.map((t, i) => `
      <button onclick="switchSubTab('${page}', ${i})" class="sub-tab ${i === activeTab ? 'active' : ''}">${t}</button>
    `).join('')}
    <div class="ml-auto flex items-center gap-2">
      <span class="badge badge-draft text-[9px]">Draft v3</span>
    </div>
  </div>`;
}

function approvalCard(title, author, status, type, details, badgeClass) {
  return `
  <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition cursor-pointer">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="badge badge-${badgeClass}">${status}</span>
          <span class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${type}</span>
        </div>
        <div class="text-sm font-medium mt-1">${title}</div>
        <div class="text-xs text-gray-500 mt-0.5">By ${author} · ${details}</div>
      </div>
      <div class="flex gap-1.5 ml-4">
        <button class="w-7 h-7 rounded-md bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 text-sm" title="Approve">✓</button>
        <button class="w-7 h-7 rounded-md bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 text-sm" title="Reject">✗</button>
        <button class="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 text-sm" title="Request Info">?</button>
      </div>
    </div>
  </div>`;
}

// ===== PEOPLE SUB-TAB CONTENT =====

function getPeopleSubContent() {
  const tab = currentSubTab['people'] || 0;
  if (tab === 0) return peopleHiringRequests();
  if (tab === 1) return peopleApprovedTeam();
  if (tab === 2) return peopleMonthlyGrid();
}

function peopleHiringRequests() {
  return `
  <!-- KPIs -->
  <div class="grid grid-cols-4 gap-3 mb-4">
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Total Headcount</div><div class="text-lg font-bold mt-1">24</div><div class="text-[10px] text-green-600">+3 pending</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Monthly Labor</div><div class="text-lg font-bold mt-1">$482K</div><div class="text-[10px] text-red-600">+$64K vs budget</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Incremental Requests</div><div class="text-lg font-bold mt-1">5</div><div class="text-[10px] text-amber-600">2 awaiting review</div></div>
    <div class="kpi-card"><div class="text-[10px] text-gray-500 uppercase">Avg Allocation</div><div class="text-lg font-bold mt-1">87%</div><div class="text-[10px] text-gray-500">Non-incremental</div></div>
  </div>
  <!-- Filters -->
  <div class="flex justify-between items-center mb-3">
    <div class="flex gap-2">
      <input class="text-xs border border-gray-200 rounded-md px-3 py-1.5 w-40" placeholder="Search roles...">
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white"><option>All Statuses</option></select>
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white"><option>FTE & Contractor</option></select>
    </div>
    <button class="btn-primary budget-owner-only" onclick="openModal('add-hiring')">+ New Hiring Request</button>
  </div>
  <!-- Table -->
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th class="finance-col">Cost Ctr</th>
          <th>Role</th>
          <th>Type</th>
          <th>Country</th>
          <th class="text-center">HC</th>
          <th>Rate</th>
          <th>Start Date</th>
          <th>Funding</th>
          <th>Status</th>
          <th class="finance-col">Override?</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">Sr. Cloud Engineer</td>
          <td><span class="badge badge-draft">FTE</span></td>
          <td>US</td>
          <td class="text-center">2</td>
          <td>$185/hr</td>
          <td>Sep 2025</td>
          <td>CapEx</td>
          <td><span class="badge badge-approved">Approved</span></td>
          <td class="finance-col">—</td>
          <td class="text-center"><span class="text-gray-400">👁️</span></td>
        </tr>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">Data Analyst</td>
          <td><span class="badge badge-warning">Contractor</span></td>
          <td>India</td>
          <td class="text-center">3</td>
          <td>$45/hr</td>
          <td>Oct 2025</td>
          <td>OpEx</td>
          <td><span class="badge badge-draft">Draft</span></td>
          <td class="finance-col">—</td>
          <td class="text-center budget-owner-only"><button class="text-blue-500">✏️</button></td>
        </tr>
        <tr class="bg-amber-50/50">
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">Security Architect</td>
          <td><span class="badge badge-draft">FTE</span></td>
          <td>US</td>
          <td class="text-center">1</td>
          <td>$210/hr</td>
          <td>Aug 2025</td>
          <td>CapEx</td>
          <td><span class="badge badge-warning">⚠️ Missing Project</span></td>
          <td class="finance-col">—</td>
          <td class="text-center budget-owner-only"><button class="text-blue-500">✏️</button></td>
        </tr>
        <tr>
          <td class="finance-col">CC-4201</td>
          <td class="font-medium">DevOps Engineer</td>
          <td><span class="badge badge-warning">Contractor</span></td>
          <td>UK</td>
          <td class="text-center">1</td>
          <td class="text-red-600 font-bold">$160/hr*</td>
          <td>Nov 2025</td>
          <td>OpEx</td>
          <td><span class="badge badge-submitted">Submitted</span></td>
          <td class="finance-col"><span class="text-amber-600 font-bold">⚠️ Manual</span></td>
          <td class="text-center"><span class="text-gray-400">👁️</span></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="text-[10px] text-gray-400 mt-2">* Rate override: default $95/hr (Vendor: Accenture). Manually set to $160/hr — visible to Finance.</div>
  <!-- Bottom actions -->
  <div class="flex justify-between items-center mt-4">
    <div class="text-xs text-gray-500">4 of 12 requests shown</div>
    <div class="flex gap-2 budget-owner-only">
      <button class="btn-secondary">Save Draft</button>
      <button class="btn-primary">Submit for Review →</button>
    </div>
  </div>`;
}

function peopleApprovedTeam() {
  return `
  <div class="bg-white border border-gray-200 rounded-xl p-4 mb-4">
    <h3 class="text-sm font-semibold mb-1">Non-Incremental Team (Allocation-based)</h3>
    <p class="text-xs text-gray-500">Current team members with their allocation percentages. Cost = Allocation × Rate.</p>
  </div>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="data-table">
      <thead><tr><th>Name</th><th>Role</th><th>Type</th><th>Country</th><th class="text-center">Allocation %</th><th>Rate</th><th class="text-right">Monthly Cost</th><th>Project</th></tr></thead>
      <tbody>
        <tr><td class="font-medium">John Smith</td><td>Sr. Engineer</td><td><span class="badge badge-draft">FTE</span></td><td>US</td><td class="text-center">100%</td><td>$185/hr</td><td class="text-right font-semibold">$32,000</td><td><code class="bg-gray-100 px-1 rounded text-[10px]">PRJ-0042</code></td></tr>
        <tr><td class="font-medium">Maria Chen</td><td>Architect</td><td><span class="badge badge-draft">FTE</span></td><td>US</td><td class="text-center">75%</td><td>$210/hr</td><td class="text-right font-semibold">$27,300</td><td><code class="bg-gray-100 px-1 rounded text-[10px]">PRJ-0042</code></td></tr>
        <tr><td class="font-medium">Raj Patel</td><td>Data Engineer</td><td><span class="badge badge-draft">FTE</span></td><td>India</td><td class="text-center">100%</td><td>$65/hr</td><td class="text-right font-semibold">$11,267</td><td><code class="bg-gray-100 px-1 rounded text-[10px]">PRJ-0018</code></td></tr>
        <tr><td class="font-medium">Lisa Park</td><td>QA Lead</td><td><span class="badge badge-draft">FTE</span></td><td>US</td><td class="text-center">50%</td><td>$140/hr</td><td class="text-right font-semibold">$12,133</td><td><code class="bg-gray-100 px-1 rounded text-[10px]">PRJ-0042</code></td></tr>
      </tbody>
    </table>
  </div>`;
}

function peopleMonthlyGrid() {
  const months = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'];
  return `
  <!-- Controls -->
  <div class="flex justify-between items-center mb-3">
    <div class="flex gap-2 items-center">
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white"><option>FY26 (Aug 2025 – Jul 2026)</option></select>
      <div class="flex border border-gray-200 rounded-md overflow-hidden">
        <button class="text-[10px] px-3 py-1 bg-blue-500 text-white font-medium">Monthly</button>
        <button class="text-[10px] px-3 py-1 bg-white text-gray-600 border-l">Quarterly</button>
        <button class="text-[10px] px-3 py-1 bg-white text-gray-600 border-l">Yearly</button>
      </div>
      <select class="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white"><option>All Labor</option><option>Non-Incremental</option><option>Incremental</option></select>
    </div>
    <div class="flex gap-2">
      <button class="btn-secondary text-[10px] py-1">↓ Export</button>
      <button class="btn-secondary text-[10px] py-1">↑ Import</button>
    </div>
  </div>
  <!-- Grid -->
  <div class="bg-white border border-gray-200 rounded-xl overflow-x-auto">
    <table class="data-table" style="min-width:900px">
      <thead>
        <tr>
          <th class="sticky left-0 bg-gray-50 min-w-[140px]">Resource / Role</th>
          <th class="text-center w-12">Type</th>
          <th class="text-center w-12">Alloc%</th>
          ${months.map(m => `<th class="text-center w-14">${m}</th>`).join('')}
          <th class="text-center w-16 font-bold">FY Total</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-green-50/50"><td colspan="${months.length + 4}" class="font-semibold text-green-800 text-[10px]">▾ Non-Incremental Labor</td></tr>
        <tr>
          <td class="sticky left-0 bg-white font-medium">J. Smith (Sr. Eng)</td>
          <td class="text-center"><span class="badge badge-draft text-[9px]">FTE</span></td>
          <td class="text-center"><input class="grid-input" value="100%"></td>
          ${months.map(() => `<td class="text-center"><input class="grid-input" value="$32K"></td>`).join('')}
          <td class="text-center font-bold">$384K</td>
        </tr>
        <tr class="bg-amber-50/50">
          <td class="sticky left-0 bg-amber-50/50 font-medium">M. Chen (Architect)</td>
          <td class="text-center"><span class="badge badge-draft text-[9px]">FTE</span></td>
          <td class="text-center"><input class="grid-input error" value="115%"></td>
          <td colspan="${months.length}" class="text-center text-red-600 font-semibold text-xs">⚠️ BLOCKING: Allocation exceeds 100%</td>
          <td class="text-center font-bold text-red-600">—</td>
        </tr>
        <tr class="bg-blue-50/50"><td colspan="${months.length + 4}" class="font-semibold text-blue-800 text-[10px]">▾ Incremental Labor</td></tr>
        <tr>
          <td class="sticky left-0 bg-white font-medium">Data Analyst ×3 (India)</td>
          <td class="text-center"><span class="badge badge-warning text-[9px]">Contr</span></td>
          <td class="text-center text-gray-400">—</td>
          <td class="text-center text-gray-400">—</td>
          <td class="text-center text-gray-400">—</td>
          ${months.slice(2).map(() => `<td class="text-center bg-green-50"><span class="text-[10px]">$23K</span></td>`).join('')}
          <td class="text-center font-bold">$230K</td>
        </tr>
        <!-- Totals -->
        <tr class="bg-gray-100 font-bold">
          <td class="sticky left-0 bg-gray-100" colspan="3">TOTAL</td>
          ${months.map(() => `<td class="text-center text-[10px]">$55K</td>`).join('')}
          <td class="text-center">$614K</td>
        </tr>
        <tr class="bg-purple-50/50">
          <td class="sticky left-0 bg-purple-50/50 italic text-purple-700" colspan="3">Actuals (Workday)</td>
          <td class="text-center text-purple-600 text-[10px]">$53K</td>
          <td class="text-center text-purple-600 text-[10px]">$54K</td>
          <td class="text-center text-purple-600 text-[10px]">$52K</td>
          ${months.slice(3).map(() => `<td class="text-center text-gray-300 text-[10px]">—</td>`).join('')}
          <td class="text-center text-purple-700 font-semibold">$159K</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex gap-4 mt-2 text-[9px] text-gray-500">
    <span>⬜ Editable cells (Draft only)</span>
    <span>🟡 Blocking error</span>
    <span>🟢 Auto-calculated</span>
    <span>🟣 Actuals (read-only)</span>
  </div>`;
}

// ===== MODALS =====

const modals = {
  'add-expense': () => `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div><h2 class="text-base font-bold">Add Operating Expense</h2><p class="text-xs text-gray-500 mt-0.5">Creates a new forecast line item</p></div>
        <button onclick="closeModal()" class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200">✕</button>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Expense Description *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="e.g., AWS Hosting"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Category *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>Select category...</option><option>Infrastructure</option><option>Travel</option><option>Training</option><option>Professional Services</option></select></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Project ID *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>Select project...</option><option>PRJ-0042 (Cloud Migration)</option><option>PRJ-0018 (Security Platform)</option></select></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Funding Type *</label><div class="flex gap-2 mt-1"><label class="flex items-center gap-1.5 px-3 py-1.5 border-2 border-blue-500 rounded-md bg-blue-50 cursor-pointer"><input type="radio" name="funding" checked><span class="text-[10px] font-medium">OpEx</span></label><label class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md cursor-pointer"><input type="radio" name="funding"><span class="text-[10px] font-medium">CapEx</span></label></div></div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Monthly Amount *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="$0.00"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Start Date *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="Aug 2025"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">End Date</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="Ongoing"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Recurrence</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>Monthly (recurring)</option><option>One-time</option><option>Quarterly</option><option>Annual</option></select></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Vendor (optional)</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="e.g., AWS"></div>
        </div>
        <!-- Preview -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
          <div class="text-[10px] font-semibold mb-1">Forecast Impact Preview</div>
          <div class="flex gap-4 text-xs text-gray-600">
            <span>Monthly: <strong class="text-gray-900">$20,000</strong></span>
            <span>FY26 Total: <strong class="text-gray-900">$240,000</strong></span>
            <span>Months: <strong class="text-gray-900">12</strong></span>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span class="text-[9px] text-red-500">* Required fields</span>
        <div class="flex gap-2">
          <button class="btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn-primary" onclick="closeModal()">Add to Forecast</button>
        </div>
      </div>
    </div>`,

  'add-hiring': () => `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div><h2 class="text-base font-bold">New Hiring Request</h2><p class="text-xs text-gray-500 mt-0.5">Request incremental headcount</p></div>
        <button onclick="closeModal()" class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200">✕</button>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Role *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="e.g., Sr. Data Engineer"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Labor Category *</label><div class="flex gap-2 mt-1"><label class="flex items-center gap-1.5 px-3 py-1.5 border-2 border-blue-500 rounded-md bg-blue-50 cursor-pointer"><input type="radio" name="labor" checked><span class="text-[10px] font-medium">FTE</span></label><label class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md cursor-pointer"><input type="radio" name="labor"><span class="text-[10px] font-medium">Contractor</span></label></div></div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Country *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>Select...</option><option>US</option><option>UK</option><option>India</option><option>Canada</option></select></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Headcount *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" type="number" value="1"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Funding *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>CapEx</option><option>OpEx</option></select></div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Start Date *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="Sep 2025"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">End Date</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="Ongoing"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Project ID *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>PRJ-0042</option><option>PRJ-0018</option></select></div>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="text-[10px] font-semibold text-blue-800 mb-1">💡 Rate Suggestion (AI)</div>
          <div class="text-xs text-blue-700">Default rate for <strong>Sr. Data Engineer</strong> in <strong>US</strong>: <strong>$175/hr</strong> (highest vendor rate: Cognizant)</div>
          <div class="text-[10px] text-blue-600 mt-1">You can override this — overrides are flagged for Finance review.</div>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="closeModal()">Submit Request</button>
      </div>
    </div>`,

  'add-cross-cost': () => `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div><h2 class="text-base font-bold">New Cross-Cost Center Request</h2><p class="text-xs text-gray-500 mt-0.5">Request estimate from another cost center</p></div>
        <button onclick="closeModal()" class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200">✕</button>
      </div>
      <div class="space-y-3">
        <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Target Cost Center *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>Select team...</option><option>CloudOps / DevOps</option><option>Security</option><option>Data Engineering</option><option>Privacy & Compliance</option><option>Network Operations</option></select></div>
        <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Project *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>PRJ-0042 — Cloud Migration Platform</option><option>PRJ-0018 — Security Modernization</option></select></div>
        <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Description of need</label><textarea class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 h-20" placeholder="Brief description of what you need from this team..."></textarea></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Expected Start</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="Sep 2025"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Expected Duration</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="6 months"></div>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="closeModal()">Send Request</button>
      </div>
    </div>`,

  'view-estimate': () => `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div><h2 class="text-base font-bold">Estimate — CloudOps for PRJ-0042</h2><p class="text-xs text-gray-500 mt-0.5">Submitted by Jane Davis · 2 days ago</p></div>
        <button onclick="closeModal()" class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200">✕</button>
      </div>
      <div class="space-y-3">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-[10px] font-semibold text-gray-700 mb-2">Project Summary (read-only)</div>
          <div class="grid grid-cols-2 gap-2 text-xs"><div><span class="text-gray-500">Project:</span> Cloud Migration Platform</div><div><span class="text-gray-500">PBO:</span> John Smith</div><div><span class="text-gray-500">Timeline:</span> Aug 2025 – Jul 2026</div><div><span class="text-gray-500">Total Budget:</span> $4.82M</div></div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-3">
          <div class="text-[10px] font-semibold text-gray-700 mb-2">Estimate Details</div>
          <table class="data-table"><thead><tr><th>Resource</th><th class="text-center">FTEs</th><th class="text-right">Monthly</th><th>Period</th></tr></thead>
          <tbody>
            <tr><td>DevOps Engineer</td><td class="text-center">2</td><td class="text-right">$36,000</td><td>Aug–Jul</td></tr>
            <tr><td>SRE</td><td class="text-center">1</td><td class="text-right">$19,500</td><td>Oct–Mar</td></tr>
            <tr><td>Cloud Architect</td><td class="text-center">1</td><td class="text-right">$28,000</td><td>Aug–Oct</td></tr>
            <tr class="font-bold"><td>Total</td><td class="text-center">4</td><td class="text-right">$340,000 (annual)</td><td></td></tr>
          </tbody></table>
        </div>
        <div><div class="text-[10px] font-semibold text-gray-700 mb-1">Assumptions</div><p class="text-xs text-gray-600 bg-gray-50 rounded p-2">Assumes existing CI/CD pipeline. Cloud Architect needed only for initial architecture phase. SRE starts after first deployment milestone.</p></div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button class="btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>`,

  'add-software': () => `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div><h2 class="text-base font-bold">Add Software Expense</h2><p class="text-xs text-gray-500 mt-0.5">Add a new software license or SaaS subscription</p></div>
        <button onclick="closeModal()" class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200">✕</button>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Software Name *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="e.g., Datadog"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Vendor *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="e.g., Datadog Inc"></div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Type</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>SaaS</option><option>License</option><option>Open Source (Support)</option></select></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Annual Cost *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="$0.00"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Renewal Date</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="Mar 2026"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Project ID *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>PRJ-0042</option><option>PRJ-0018</option></select></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Funding *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>OpEx</option><option>CapEx</option></select></div>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="closeModal()">Add to Forecast</button>
      </div>
    </div>`,

  'create-afe': () => `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div><h2 class="text-base font-bold">Create New AFE</h2><p class="text-xs text-gray-500 mt-0.5">Authorization for Expenditure — Capital project request</p></div>
        <button onclick="closeModal()" class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200">✕</button>
      </div>
      <div class="space-y-3">
        <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Project *</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>PRJ-0042 — Cloud Migration Platform</option><option>PRJ-0018 — Security Modernization</option><option>PRJ-0055 — AI/ML Infrastructure</option></select></div>
        <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Executive Summary *</label><textarea class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 h-20" placeholder="Brief business case..."></textarea></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Total Amount *</label><input class="w-full text-xs border border-gray-200 rounded-md px-3 py-2" placeholder="$0.00"></div>
          <div><label class="text-[10px] font-semibold text-gray-700 block mb-1">Risk Level</label><select class="w-full text-xs border border-gray-200 rounded-md px-3 py-2 bg-white"><option>Low</option><option>Medium</option><option>High</option></select></div>
        </div>
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div class="text-[10px] font-semibold text-purple-800 mb-1">🤖 AI Writing Assist Available</div>
          <div class="text-xs text-purple-700">After creating the draft, you can use AI to help craft the executive business case narrative.</div>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="closeModal()">Create Draft AFE</button>
      </div>
    </div>`
};

// ===== NAVIGATION & INTERACTION =====

function navigateTo(page) {
  currentPage = page;
  renderPage();
  updateNav();
  updateBreadcrumb();
}

function renderPage() {
  const content = document.getElementById('page-content');
  const renderer = pages[currentPage];
  if (renderer) {
    content.innerHTML = renderer();
    applyRoleVisibility();
  }
}

function updateNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });
}

function updateBreadcrumb() {
  const names = {
    dashboard: 'Overview',
    people: 'Forecast / People',
    software: 'Forecast / Software',
    operating: 'Forecast / Operating',
    capital: 'Forecast / Capital',
    audit: 'Forecast / Audit',
    afe: 'AFE Governance',
    memos: 'Executive Memos',
    'cross-cost': 'Cross-Cost Center',
    'resource-requests': 'Resource Requests',
    approvals: 'Approvals'
  };
  document.getElementById('breadcrumb').innerHTML = `Dashboard / <span class="text-gray-900 font-medium">${names[currentPage] || currentPage}</span>`;
}

function switchSubTab(page, index) {
  currentSubTab[page] = index;
  renderPage();
}

function setRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('role-' + role).classList.add('active');

  const labels = { 'budget-owner': 'Budget Owner · CC-4201', 'finance': 'Finance Operator', 'approver': 'Approver (VP)' };
  document.getElementById('user-role-label').textContent = labels[role];

  // Apply role class to body for CSS-based visibility
  document.body.className = document.body.className.replace(/role-\S+/g, '');
  document.body.classList.add('role-' + role);

  applyRoleVisibility();
}

function applyRoleVisibility() {
  // Show/hide budget-owner-only elements
  document.querySelectorAll('.budget-owner-only').forEach(el => {
    el.style.display = currentRole === 'budget-owner' ? '' : 'none';
  });
  // Show/hide finance-only columns
  document.querySelectorAll('.finance-col').forEach(el => {
    el.style.display = currentRole === 'finance' ? '' : 'none';
  });
}

function openModal(type) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const renderer = modals[type];
  if (renderer) {
    content.innerHTML = renderer();
    overlay.classList.remove('hidden');
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Nav link clicks
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// Role toggle clicks
document.getElementById('role-budget-owner').addEventListener('click', () => setRole('budget-owner'));
document.getElementById('role-finance').addEventListener('click', () => setRole('finance'));
document.getElementById('role-approver').addEventListener('click', () => setRole('approver'));

// Keyboard shortcut: Escape closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Initialize
renderPage();
setRole('budget-owner');
