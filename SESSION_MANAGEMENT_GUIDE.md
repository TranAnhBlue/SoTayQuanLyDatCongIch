# 🔐 HƯỚNG DẪN SỬ DỤNG SESSION MANAGEMENT

## 📋 Tổng quan

Hệ thống session management giúp quản lý token, thông tin người dùng và phiên đăng nhập một cách an toàn và hiệu quả.

---

## 🏗️ Kiến trúc

### **1. Auth Utilities (`frontend/src/utils/auth.js`)**
- Các hàm tiện ích để quản lý token, user, session
- Lưu trữ trong localStorage
- Kiểm tra quyền và role

### **2. Auth Context (`frontend/src/contexts/AuthContext.jsx`)**
- React Context để quản lý state authentication toàn ứng dụng
- Cung cấp hooks `useAuth()` để truy cập từ bất kỳ component nào

### **3. Custom Hook (`frontend/src/hooks/useSession.js`)**
- Hook để theo dõi và quản lý session
- Tự động cập nhật thời gian còn lại
- Tính toán thời gian hoạt động

### **4. Components**
- `ProtectedRoute`: Bảo vệ routes theo role
- `SessionInfo`: Hiển thị thông tin session

---

## 🚀 Cách sử dụng

### **1. Sử dụng AuthContext trong Component**

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { 
    user,           // Thông tin user hiện tại
    token,          // JWT token
    isAuthenticated, // Đã đăng nhập chưa
    login,          // Hàm đăng nhập
    logout,         // Hàm đăng xuất
    isAdmin,        // Có phải admin không
    isRenter,       // Có phải renter không
    hasRole,        // Kiểm tra role cụ thể
  } = useAuth();

  return (
    <div>
      <h1>Xin chào, {user?.name}</h1>
      {isAdmin && <p>Bạn là quản trị viên</p>}
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### **2. Đăng nhập (Login)**

```jsx
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('/api/auth/login', values);
      const { token, user } = response.data;
      
      // Lưu session
      login(token, user);
      
      // Redirect theo role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/renter/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### **3. Đăng xuất (Logout)**

```jsx
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Đăng xuất</button>;
}
```

### **4. Bảo vệ Routes**

```jsx
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes - chỉ admin */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'officer']}>
            <AdminLayout />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected routes - chỉ renter */}
      <Route 
        path="/renter/*" 
        element={
          <ProtectedRoute allowedRoles={['renter']}>
            <RenterLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### **5. Sử dụng Session Hook**

```jsx
import { useSession } from '../hooks/useSession';

function SessionStatus() {
  const { 
    session,          // Thông tin session đầy đủ
    isValid,          // Session còn hợp lệ không
    timeRemaining,    // Thời gian còn lại
    sessionDuration,  // Thời gian đã hoạt động
    refresh,          // Làm mới session
  } = useSession();

  return (
    <div>
      <p>Đăng nhập lúc: {new Date(session?.loginTime).toLocaleString()}</p>
      <p>Còn lại: {timeRemaining?.days} ngày {timeRemaining?.hours} giờ</p>
      <p>Đã hoạt động: {sessionDuration?.hours} giờ {sessionDuration?.minutes} phút</p>
      <button onClick={refresh}>Gia hạn session</button>
    </div>
  );
}
```

### **6. Hiển thị thông tin Session**

```jsx
import SessionInfo from '../components/Auth/SessionInfo';

function ProfilePage() {
  return (
    <div>
      <h1>Thông tin tài khoản</h1>
      <SessionInfo />
    </div>
  );
}
```

---

## 📦 API Reference

### **Auth Utilities (`auth.js`)**

#### Token Management
```javascript
setToken(token)           // Lưu token
getToken()                // Lấy token
removeToken()             // Xóa token
hasToken()                // Kiểm tra có token không
```

#### User Management
```javascript
setUser(user)             // Lưu user
getUser()                 // Lấy user
removeUser()              // Xóa user
isAuthenticated()         // Kiểm tra đã đăng nhập
```

#### Session Management
```javascript
createSession(token, user)  // Tạo session mới
getSession()                // Lấy session hiện tại
isSessionValid()            // Kiểm tra session hợp lệ
clearSession()              // Xóa session (logout)
refreshSession()            // Làm mới session
updateUserInSession(data)   // Cập nhật user trong session
```

#### Role Checks
```javascript
getUserRole()             // Lấy role hiện tại
hasRole(role)             // Kiểm tra role cụ thể
hasAnyRole([roles])       // Kiểm tra nhiều roles
isAdmin()                 // Có phải admin không
isOfficer()               // Có phải officer không
isRenter()                // Có phải renter không
isAdminOrOfficer()        // Có phải admin hoặc officer không
```

#### User Info
```javascript
getUserName()             // Lấy tên user
getUserEmail()            // Lấy email user
getUserId()               // Lấy ID user
getUserInfo()             // Lấy thông tin đầy đủ
```

#### Redirect Helpers
```javascript
getDefaultRedirectUrl()   // Lấy URL redirect mặc định theo role
canAccessRoute(roles)     // Kiểm tra quyền truy cập route
```

---

### **Auth Context (`useAuth` hook)**

```javascript
const {
  // State
  user,              // Object: Thông tin user hiện tại
  token,             // String: JWT token
  loading,           // Boolean: Đang load session
  isAuthenticated,   // Boolean: Đã đăng nhập chưa
  
  // Methods
  login(token, user),      // Function: Đăng nhập
  logout(),                // Function: Đăng xuất
  updateUser(data),        // Function: Cập nhật user
  hasRole(role),           // Function: Kiểm tra role
  hasAnyRole([roles]),     // Function: Kiểm tra nhiều roles
  getCurrentUser(),        // Function: Lấy user info
  
  // Computed
  isAdmin,           // Boolean: Có phải admin
  isOfficer,         // Boolean: Có phải officer
  isRenter,          // Boolean: Có phải renter
  isAdminOrOfficer,  // Boolean: Có phải admin/officer
} = useAuth();
```

---

### **Session Hook (`useSession`)**

```javascript
const {
  session,           // Object: Session đầy đủ
  isValid,           // Boolean: Session hợp lệ
  timeRemaining,     // Object: { days, hours, minutes, total }
  sessionDuration,   // Object: { hours, minutes, total }
  refresh(),         // Function: Làm mới session
  user,              // Object: User info
  token,             // String: Token
  isAuthenticated,   // Boolean: Đã đăng nhập
} = useSession();
```

---

## 🔒 Cấu trúc Session trong localStorage

### **Token**
```
Key: "token"
Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **User**
```json
Key: "user"
Value: {
  "id": "507f1f77bcf86cd799439011",
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "role": "admin",
  "phone": "0901234567",
  "department": "Phòng TN&MT",
  "position": "Trưởng phòng"
}
```

### **Session**
```json
Key: "session"
Value: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* user object */ },
  "loginTime": "2024-01-15T08:30:00.000Z",
  "expiresAt": "2024-02-14T08:30:00.000Z"
}
```

---

## 🛡️ Bảo mật

### **1. Token được lưu trong localStorage**
- ✅ Dễ truy cập từ mọi component
- ⚠️ Có thể bị XSS attack
- 💡 Nên implement Content Security Policy (CSP)

### **2. Session tự động hết hạn sau 30 ngày**
```javascript
expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
```

### **3. Kiểm tra session validity**
```javascript
if (!isSessionValid()) {
  clearSession();
  navigate('/login');
}
```

### **4. Protected Routes**
- Tự động redirect nếu chưa đăng nhập
- Kiểm tra role trước khi cho phép truy cập

---

## 📊 Flow Diagram

### **Login Flow**
```
User nhập credentials
    ↓
POST /api/auth/login
    ↓
Server trả về { token, user }
    ↓
login(token, user)
    ↓
createSession(token, user)
    ↓
Lưu vào localStorage:
  - token
  - user
  - session
    ↓
Redirect theo role
```

### **Protected Route Flow**
```
User truy cập /admin/dashboard
    ↓
ProtectedRoute kiểm tra:
  - isAuthenticated?
  - isSessionValid?
  - hasRole(['admin', 'officer'])?
    ↓
✅ Cho phép truy cập
❌ Redirect về /login
```

### **Logout Flow**
```
User click "Đăng xuất"
    ↓
logout()
    ↓
clearSession()
    ↓
Xóa khỏi localStorage:
  - token
  - user
  - session
    ↓
Reset state:
  - user = null
  - token = null
  - isAuthenticated = false
    ↓
Redirect về /login
```

---

## 🎯 Best Practices

### **1. Luôn sử dụng useAuth() thay vì truy cập localStorage trực tiếp**
```javascript
// ❌ Không nên
const user = JSON.parse(localStorage.getItem('user'));

// ✅ Nên
const { user } = useAuth();
```

### **2. Kiểm tra authentication trước khi gọi API**
```javascript
const { isAuthenticated, token } = useAuth();

if (isAuthenticated) {
  axios.get('/api/data', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

### **3. Xử lý token expired**
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const { logout } = useAuth();
      logout();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);
```

### **4. Refresh session định kỳ**
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    if (isAuthenticated) {
      refreshSession();
    }
  }, 24 * 60 * 60 * 1000); // Mỗi 24 giờ
  
  return () => clearInterval(interval);
}, [isAuthenticated]);
```

---

## 🐛 Troubleshooting

### **Vấn đề: User bị logout tự động**
**Nguyên nhân**: Session hết hạn  
**Giải pháp**: Gọi `refreshSession()` định kỳ

### **Vấn đề: Token không được gửi trong API request**
**Nguyên nhân**: Chưa cấu hình axios interceptor  
**Giải pháp**: Thêm interceptor trong App.jsx
```javascript
axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Vấn đề: ProtectedRoute không hoạt động**
**Nguyên nhân**: Chưa wrap App trong AuthProvider  
**Giải pháp**: Kiểm tra main.jsx
```javascript
<AuthProvider>
  <App />
</AuthProvider>
```

---

## 📝 Ví dụ thực tế

### **Hiển thị tên user trong header**
```jsx
function Header() {
  const { user, isAdmin } = useAuth();
  
  return (
    <header>
      <h1>Xin chào, {user?.name}</h1>
      {isAdmin && <Badge>Admin</Badge>}
    </header>
  );
}
```

### **Kiểm tra quyền trước khi hiển thị button**
```jsx
function ActionButtons() {
  const { hasRole } = useAuth();
  
  return (
    <div>
      {hasRole('admin') && (
        <button>Xóa hồ sơ</button>
      )}
      {hasRole('renter') && (
        <button>Gửi phản hồi</button>
      )}
    </div>
  );
}
```

### **Tự động logout khi token expired**
```jsx
function App() {
  const { isAuthenticated, logout } = useAuth();
  
  useEffect(() => {
    const checkSession = () => {
      if (isAuthenticated && !isSessionValid()) {
        logout();
        message.warning('Phiên đăng nhập đã hết hạn');
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Mỗi phút
    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);
  
  return <Routes>...</Routes>;
}
```

---

**Phiên bản**: 1.0.0  
**Cập nhật**: 2024  
**Tác giả**: Đất Việt Core Development Team
