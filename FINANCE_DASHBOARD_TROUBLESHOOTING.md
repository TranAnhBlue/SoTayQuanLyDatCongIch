# Finance Dashboard Troubleshooting Guide

## Problem
Finance Dashboard showing "0" values and "No data" despite having real data in the database.

## Root Cause Analysis
✅ **Backend API**: Working correctly - returns real data (1.9 tỷ VNĐ revenue, 0.1 tỷ VNĐ debt, 75% completion rate)
✅ **Database**: Contains real transaction and contract data
✅ **Server**: Running on port 5000 and responding
❓ **Frontend**: Authentication or API call issues

## Backend Verification (PASSED)
```bash
# Test 1: Server running
curl http://localhost:5000/
# Result: ✅ "API is running..."

# Test 2: Finance login
node backend/scripts/testFinanceLogin.js
# Result: ✅ Login successful, token generated

# Test 3: Dashboard API
# Result: ✅ Returns real data: 1.9 tỷ VNĐ revenue, 0.1 tỷ VNĐ debt, 75% completion
```

## Frontend Issues to Check

### 1. Authentication Problems
**Symptoms**: 401 Unauthorized errors
**Solutions**:
- Clear browser cache and localStorage
- Login again with Finance credentials: `finance@datviet.vn` / `123456`
- Check if user role is 'finance' or 'admin'

### 2. Network Issues
**Symptoms**: Network errors, CORS issues
**Solutions**:
- Verify backend server is running on port 5000
- Check browser Network tab for failed API calls
- Ensure no firewall blocking localhost:5000

### 3. Token Issues
**Symptoms**: Invalid token errors
**Solutions**:
- Check if token exists in localStorage
- Verify token format (should start with "eyJ...")
- Login again to get fresh token

## Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open Finance Dashboard
2. Open Developer Tools (F12)
3. Check Console tab for error messages
4. Look for detailed debug logs starting with 🔍, ✅, ❌

### Step 2: Check Network Tab
1. Open Network tab in Developer Tools
2. Refresh Finance Dashboard
3. Look for API call to `/api/finance/dashboard`
4. Check if it returns 200 OK or error status

### Step 3: Check Authentication
1. Open Application/Storage tab
2. Check localStorage for 'token' and 'user'
3. Verify user role is 'finance' or 'admin'

### Step 4: Manual Login Test
1. Go to Login page
2. Login with: `finance@datviet.vn` / `123456`
3. Navigate to Finance Dashboard
4. Check if data loads correctly

## Expected Results After Fix
- **Total Revenue**: 1.9 tỷ VNĐ
- **Total Debt**: 0.1 tỷ VNĐ  
- **Completion Rate**: 75%
- **Monthly Chart**: 12 data points
- **Urgent Items**: 4 debt items

## Recent Changes Made
1. ✅ Enhanced error handling and debugging in FinanceDashboard.jsx
2. ✅ Added detailed console logging for troubleshooting
3. ✅ Added user role validation
4. ✅ Added loading states and better error messages
5. ✅ Fixed navigation links and data display

## Test Credentials
- **Finance User**: finance@datviet.vn / 123456
- **Admin User**: admin@datviet.vn / 123456 (also has finance access)

## Next Steps for User
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Login with Finance credentials**
3. **Check browser console** for debug logs
4. **Verify Network tab** shows successful API calls
5. **Report specific error messages** if still not working