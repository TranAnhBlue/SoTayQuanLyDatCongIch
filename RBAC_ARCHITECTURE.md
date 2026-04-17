# Role-Based Access Control (RBAC) Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE (/)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Header: Shows Auth State                                 │   │
│  │ - Not Logged In: "Đăng nhập" button                      │   │
│  │ - Logged In: User name + Role + Dashboard + Logout       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      USER AUTHENTICATION                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuthContext (useAuth hook)                               │   │
│  │ - isAuthenticated: boolean                               │   │
│  │ - user: { id, name, email, role }                        │   │
│  │ - loading: boolean                                       │   │
│  │ - login(), logout(), updateUser()                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTE PROTECTION LAYER                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ RoleProtectedRoute Component                             │   │
│  │ Props: allowedRoles = ['admin', 'officer', ...]          │   │
│  │                                                          │   │
│  │ Logic:                                                   │   │
│  │ 1. Check if loading? → Show "Đang tải..."               │   │
│  │ 2. Check if authenticated? → Redirect to /login          │   │
│  │ 3. Check if role allowed? → Show Forbidden page          │   │
│  │ 4. Otherwise → Render component                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  ALLOWED ACCESS  │  │  DENIED ACCESS   │
        │  Render Route    │  │  Show 403 Page   │
        └──────────────────┘  └──────────────────┘
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  Dashboard       │  │  Forbidden Page  │
        │  - Admin         │  │  - Error Code    │
        │  - Officer       │  │  - User Info     │
        │  - Renter        │  │  - Go Back Btn   │
        │  - Finance       │  │  - Go Home Btn   │
        │  - Inspector     │  │  - Lock Icon     │
        └──────────────────┘  └──────────────────┘
```

---

## 🔐 Access Control Flow

```
User Request to Protected Route
        │
        ▼
┌─────────────────────────────────┐
│ RoleProtectedRoute Component    │
└─────────────────────────────────┘
        │
        ├─ Is loading?
        │  ├─ YES → Show "Đang tải..."
        │  └─ NO → Continue
        │
        ├─ Is authenticated?
        │  ├─ NO → Redirect to /login
        │  └─ YES → Continue
        │
        ├─ Does user have required role?
        │  ├─ NO → Show Forbidden (403) Page
        │  └─ YES → Render Protected Component
        │
        ▼
    Access Granted ✅
```

---

## 📊 Role Hierarchy & Permissions

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN (Quản trị viên)                    │
│  👤 Can access: /admin, /officer, /renter, /finance, /inspector │
│  Dashboard: /admin/dashboard                                    │
│  Permissions: Full system access                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   OFFICER (Cán bộ địa chính)                    │
│  📋 Can access: /admin, /officer                                │
│  Dashboard: /officer/dashboard                                  │
│  Permissions: Land management, approvals                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RENTER (Người thuê đất)                      │
│  🏠 Can access: /renter                                         │
│  Dashboard: /renter/dashboard                                   │
│  Permissions: View contracts, make payments                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     FINANCE (Tài chính)                         │
│  💰 Can access: /finance                                        │
│  Dashboard: /finance/dashboard                                  │
│  Permissions: Financial reports, debt management                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INSPECTOR (Thanh tra)                        │
│  🔍 Can access: /inspector                                      │
│  Dashboard: /inspector/dashboard                                │
│  Permissions: Inspections, violations, audits                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
frontend/src/
├── App.jsx (MODIFIED)
│   └── Uses RoleProtectedRoute for all protected routes
│
├── components/
│   └── ProtectedRoute/
│       └── RoleProtectedRoute.jsx (NEW)
│           └── Role-based route protection component
│
├── pages/
│   ├── Error/
│   │   ├── Forbidden.jsx (NEW)
│   │   │   └── 403 Forbidden error page
│   │   └── Forbidden.css (NEW)
│   │       └── Styling for Forbidden page
│   │
│   ├── LandingPage.jsx (VERIFIED)
│   │   └── Shows auth state in header
│   │
│   ├── Admin/
│   │   └── AdminDashboard.jsx
│   │       └── Protected by RoleProtectedRoute
│   │
│   ├── Officer/
│   │   └── OfficerDashboard.jsx
│   │       └── Protected by RoleProtectedRoute
│   │
│   ├── Renter/
│   │   └── Dashboard.jsx
│   │       └── Protected by RoleProtectedRoute
│   │
│   ├── Finance/
│   │   └── FinanceDashboard.jsx
│   │       └── Protected by RoleProtectedRoute
│   │
│   └── Inspector/
│       └── InspectorDashboard.jsx
│           └── Protected by RoleProtectedRoute
│
├── contexts/
│   └── AuthContext.jsx (VERIFIED)
│       └── Provides user auth state and role info
│
└── layouts/
    ├── AdminLayout.jsx
    ├── OfficerLayout.jsx
    ├── RenterLayout.jsx
    ├── FinanceLayout.jsx
    └── InspectorLayout.jsx
```

---

## 🔄 Component Interaction Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         App.jsx                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ <Router>                                                   │  │
│  │   <Routes>                                                 │  │
│  │     <Route path="/admin" element={                         │  │
│  │       <RoleProtectedRoute allowedRoles={['admin']}>        │  │
│  │         <AdminLayout />                                    │  │
│  │       </RoleProtectedRoute>                                │  │
│  │     } />                                                   │  │
│  │   </Routes>                                                │  │
│  │ </Router>                                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                  RoleProtectedRoute.jsx                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ const { isAuthenticated, user, loading } = useAuth()       │  │
│  │                                                            │  │
│  │ if (loading) return <div>Đang tải...</div>                │  │
│  │ if (!isAuthenticated) return <Navigate to="/login" />      │  │
│  │ if (!allowedRoles.includes(user.role))                    │  │
│  │   return <Forbidden />                                     │  │
│  │ return children                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  AdminLayout     │  │  Forbidden.jsx   │
        │  ├─ Header       │  │  ├─ 403 Code     │
        │  ├─ Sidebar      │  │  ├─ User Info    │
        │  ├─ Content      │  │  ├─ Buttons      │
        │  └─ Footer       │  │  └─ Lock Icon    │
        └──────────────────┘  └──────────────────┘
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGIN PROCESS                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Login Page      │
                    │  Email + Password│
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Backend Auth    │
                    │  Verify Creds    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ✅ Valid              ❌ Invalid
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ Return Token +   │  │ Show Error       │
        │ User Object      │  │ Message          │
        │ {id, name, email,│  └──────────────────┘
        │  role}           │
        └──────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ AuthContext.login()      │
        │ - Save token to storage  │
        │ - Save user to storage   │
        │ - Update state           │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Redirect to Dashboard    │
        │ Based on user.role       │
        └──────────────────────────┘
```

---

## 🛡️ Security Layers

```
Layer 1: Authentication
├─ Token validation
├─ Session management
└─ Automatic logout on expiry

Layer 2: Authorization (RBAC)
├─ Role verification
├─ Route protection
└─ Component access control

Layer 3: Error Handling
├─ 403 Forbidden page
├─ User information display
└─ Audit trail (System ID, timestamp)

Layer 4: Session Management
├─ localStorage for token
├─ localStorage for user object
└─ Session validation on app load
```

---

## 📱 User Experience Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNAUTHENTICATED USER                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Landing Page    │
                    │  "Đăng nhập" btn │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Login Page      │
                    │  Enter Creds     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Authenticate    │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED USER                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Landing Page    │
                    │  User Info +     │
                    │  Dashboard Btn   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Dashboard       │
                    │  (Role-based)    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  Allowed Route   │  │  Denied Route    │
        │  ✅ Access       │  │  ❌ 403 Page     │
        │  Granted         │  │  "Go Home" Btn   │
        └──────────────────┘  └──────────────────┘
```

---

## 🎯 Route Protection Matrix

```
Route              │ Admin │ Officer │ Renter │ Finance │ Inspector
─────────────────────────────────────────────────────────────────────
/                  │  ✅   │   ✅    │   ✅   │   ✅    │    ✅
/login             │  ✅   │   ✅    │   ✅   │   ✅    │    ✅
/register          │  ✅   │   ✅    │   ✅   │   ✅    │    ✅
/profile           │  ✅   │   ✅    │   ✅   │   ✅    │    ✅
/admin/*           │  ✅   │   ✅    │   ❌   │   ❌    │    ❌
/officer/*         │  ✅   │   ✅    │   ❌   │   ❌    │    ❌
/renter/*          │  ✅   │   ❌    │   ✅   │   ❌    │    ❌
/finance/*         │  ✅   │   ❌    │   ❌   │   ✅    │    ❌
/inspector/*       │  ✅   │   ❌    │   ❌   │   ❌    │    ✅
```

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      AuthContext State                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  user: {                                                        │
│    id: string,                                                  │
│    name: string,                                                │
│    email: string,                                               │
│    role: 'admin' | 'officer' | 'renter' | 'finance' | 'inspector'
│  }                                                              │
│                                                                 │
│  token: string (JWT)                                            │
│                                                                 │
│  isAuthenticated: boolean                                       │
│                                                                 │
│  loading: boolean                                               │
│                                                                 │
│  Methods:                                                       │
│  - login(token, userData)                                       │
│  - logout()                                                     │
│  - updateUser(updatedData)                                      │
│  - hasRole(role)                                                │
│  - hasAnyRole(roles)                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Dependency Graph

```
App.jsx
├── RoleProtectedRoute
│   ├── useAuth() → AuthContext
│   ├── Navigate (react-router-dom)
│   └── Forbidden
│       ├── useNavigate() → react-router-dom
│       ├── useAuth() → AuthContext
│       ├── Ant Design Components
│       │   ├── Button
│       │   ├── Typography
│       │   ├── Row, Col
│       │   ├── Card
│       │   └── Icons
│       └── Forbidden.css
│
├── LandingPage
│   ├── useAuth() → AuthContext
│   ├── useNavigate() → react-router-dom
│   ├── Ant Design Components
│   └── LandingPage.css
│
├── AdminLayout
│   ├── AdminDashboard
│   ├── AdminApprovals
│   ├── AdminReport
│   └── ... (other admin pages)
│
├── OfficerLayout
│   ├── OfficerDashboard
│   ├── OfficerLandRequestManagement
│   └── ... (other officer pages)
│
├── RenterLayout
│   ├── RenterDashboard
│   ├── ContractDetail
│   └── ... (other renter pages)
│
├── FinanceLayout
│   ├── FinanceDashboard
│   ├── DocumentManagement
│   └── ... (other finance pages)
│
└── InspectorLayout
    ├── InspectorDashboard
    ├── InspectionHistory
    └── ... (other inspector pages)
```

---

## 🎨 UI Component Hierarchy

```
App
├── Router
│   └── Routes
│       ├── Route: / → LandingPage
│       ├── Route: /login → Login
│       ├── Route: /register → Register
│       ├── Route: /profile → RoleProtectedRoute → ProfileSettings
│       ├── Route: /admin → RoleProtectedRoute → AdminLayout
│       │   ├── AdminDashboard
│       │   ├── AdminApprovals
│       │   ├── AdminReport
│       │   └── ...
│       ├── Route: /officer → RoleProtectedRoute → OfficerLayout
│       │   ├── OfficerDashboard
│       │   ├── OfficerLandRequestManagement
│       │   └── ...
│       ├── Route: /renter → RoleProtectedRoute → RenterLayout
│       │   ├── RenterDashboard
│       │   ├── ContractDetail
│       │   └── ...
│       ├── Route: /finance → RoleProtectedRoute → FinanceLayout
│       │   ├── FinanceDashboard
│       │   ├── DocumentManagement
│       │   └── ...
│       ├── Route: /inspector → RoleProtectedRoute → InspectorLayout
│       │   ├── InspectorDashboard
│       │   ├── InspectionHistory
│       │   └── ...
│       └── Route: * → Navigate to /
```

---

**Architecture Diagram Created**: April 17, 2026
**Status**: ✅ Complete and Verified
