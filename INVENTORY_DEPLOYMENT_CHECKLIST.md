# Inventory System Deployment Checklist

## Pre-Deployment

### Database Preparation

- [ ] **Run Prisma Migrations**
  ```bash
  cd backend
  npx prisma migrate deploy
  npx prisma generate
  ```

- [ ] **Verify Database Schema**
  - [ ] InventoryItem table exists with all fields
  - [ ] InventoryTransaction table exists
  - [ ] MaintenanceLog table exists
  - [ ] Indexes are created (category, supplier, isActive)

- [ ] **Create Initial Data (Optional)**
  ```bash
  cd backend
  npm run seed
  ```

### Backend Verification

- [ ] **Install Dependencies**
  ```bash
  cd backend
  npm install
  ```

- [ ] **Build Backend**
  ```bash
  npm run build
  ```

- [ ] **Test Service Methods**
  - [ ] InventoryService.getInventoryItems()
  - [ ] InventoryService.getInventoryItem(id)
  - [ ] InventoryService.createInventoryItem()
  - [ ] InventoryService.getInventoryAlerts()
  - [ ] InventoryService.getInventoryStats()
  - [ ] InventoryService.adjustStock()
  - [ ] InventoryService.getStockHistory()

- [ ] **Test API Endpoints**
  ```bash
  # Start backend server
  npm run dev:backend

  # Test endpoints (use Postman/curl)
  curl -H "Authorization: Bearer <token>" http://localhost:3001/api/inventory
  curl -H "Authorization: Bearer <token>" http://localhost:3001/api/inventory/alerts
  curl -H "Authorization: Bearer <token>" http://localhost:3001/api/inventory/stats
  ```

### Frontend Verification

- [ ] **Install Dependencies**
  ```bash
  cd frontend
  npm install
  ```

- [ ] **Build Frontend**
  ```bash
  npm run build
  ```

- [ ] **Test Hooks**
  - [ ] useInventory hook loads data
  - [ ] useInventoryAlerts hook loads alerts
  - [ ] useInventoryStats hook loads statistics
  - [ ] useInventoryItem hook loads single item
  - [ ] useStockHistory hook loads history
  - [ ] useStockAdjustment hook adjusts stock

- [ ] **Test UI Components**
  - [ ] Inventory page loads without errors
  - [ ] Items tab displays inventory items
  - [ ] Alerts section shows real alerts
  - [ ] Stats cards show real statistics
  - [ ] Search functionality works
  - [ ] Filtering works correctly

## Deployment

### Environment Variables

- [ ] **Backend Environment**
  ```env
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  NODE_ENV=production
  PORT=3001
  ```

- [ ] **Frontend Environment**
  ```env
  VITE_API_URL=https://api.yourdomain.com
  ```

### Backend Deployment

- [ ] **Build for Production**
  ```bash
  cd backend
  npm run build
  ```

- [ ] **Start Production Server**
  ```bash
  npm start
  # OR
  pm2 start dist/index.js --name white-cross-backend
  ```

- [ ] **Verify Server Running**
  ```bash
  curl https://api.yourdomain.com/health
  ```

### Frontend Deployment

- [ ] **Build for Production**
  ```bash
  cd frontend
  npm run build
  ```

- [ ] **Deploy Static Files**
  - [ ] Upload `dist/` folder to CDN/hosting
  - [ ] Configure HTTPS
  - [ ] Set up proper caching headers

- [ ] **Verify Frontend Loading**
  - Navigate to https://yourdomain.com
  - Check browser console for errors
  - Verify API calls succeed

## Post-Deployment Testing

### Functional Testing

- [ ] **Create Inventory Item**
  1. Navigate to Inventory page
  2. Click "Add Item" button
  3. Fill in form (name, category, reorder level, etc.)
  4. Submit form
  5. Verify item appears in list

- [ ] **View Item Details**
  1. Click on an inventory item
  2. Verify details display correctly
  3. Check transaction history
  4. Check maintenance logs

- [ ] **Adjust Stock**
  1. Navigate to item details
  2. Click "Adjust Stock"
  3. Enter quantity and reason
  4. Submit
  5. Verify stock updated
  6. Check transaction history

- [ ] **View Alerts**
  1. Navigate to Inventory page
  2. Verify alerts section displays
  3. Check alert categorization (Critical/High/Medium)
  4. Verify alert messages are accurate

- [ ] **View Statistics**
  1. Check stats cards at top of page
  2. Navigate to Analytics tab
  3. Verify statistics load correctly
  4. Check category breakdown
  5. Check recent activity
  6. Check top used items

- [ ] **Search and Filter**
  1. Use search box to find items
  2. Filter by category
  3. Filter by low stock
  4. Verify pagination works

### Performance Testing

- [ ] **Load Time**
  - [ ] Inventory list loads in < 2 seconds
  - [ ] Item details load in < 1 second
  - [ ] Alerts load in < 1 second
  - [ ] Stats load in < 2 seconds

- [ ] **Database Performance**
  ```sql
  -- Check slow queries in database logs
  -- Verify indexes are being used
  EXPLAIN ANALYZE SELECT ...
  ```

- [ ] **Memory Usage**
  - [ ] Backend memory stable under load
  - [ ] No memory leaks detected
  - [ ] Frontend memory usage reasonable

### Security Testing

- [ ] **Authentication**
  - [ ] All endpoints require JWT token
  - [ ] Invalid tokens are rejected
  - [ ] Expired tokens are rejected

- [ ] **Authorization**
  - [ ] Users can only see their own data
  - [ ] Role-based access works correctly
  - [ ] Admin features restricted to admins

- [ ] **Input Validation**
  - [ ] Invalid inputs are rejected
  - [ ] Error messages are informative
  - [ ] No SQL injection possible
  - [ ] No XSS vulnerabilities

- [ ] **Audit Trail**
  - [ ] All stock changes logged
  - [ ] User IDs recorded correctly
  - [ ] Timestamps accurate
  - [ ] Logs immutable

### Data Integrity Testing

- [ ] **Stock Calculations**
  1. Create item with initial stock
  2. Perform multiple transactions
  3. Verify final stock matches sum of transactions

- [ ] **Alerts Accuracy**
  1. Create item with low stock
  2. Verify low stock alert appears
  3. Restock item
  4. Verify alert disappears

- [ ] **Transaction History**
  1. Perform multiple stock adjustments
  2. Check history shows all transactions
  3. Verify running totals are correct
  4. Verify pagination works

## Rollback Plan

If issues are discovered:

- [ ] **Database Rollback**
  ```bash
  # Rollback last migration
  npx prisma migrate resolve --rolled-back <migration_name>
  ```

- [ ] **Code Rollback**
  ```bash
  # Revert to previous commit
  git revert <commit-hash>
  git push
  ```

- [ ] **Restore Previous Version**
  - [ ] Redeploy previous backend version
  - [ ] Redeploy previous frontend version
  - [ ] Restore database from backup if needed

## Monitoring

### Set Up Alerts

- [ ] **Backend Monitoring**
  - [ ] CPU usage alerts
  - [ ] Memory usage alerts
  - [ ] Error rate alerts
  - [ ] API response time alerts

- [ ] **Database Monitoring**
  - [ ] Connection pool alerts
  - [ ] Slow query alerts
  - [ ] Disk space alerts

- [ ] **Frontend Monitoring**
  - [ ] JavaScript error tracking (Sentry)
  - [ ] Performance monitoring
  - [ ] User session tracking

### Log Monitoring

- [ ] **Backend Logs**
  ```bash
  # Watch backend logs
  pm2 logs white-cross-backend

  # Check for errors
  grep ERROR /var/log/white-cross/backend.log
  ```

- [ ] **Database Logs**
  ```bash
  # Check PostgreSQL logs
  tail -f /var/log/postgresql/postgresql-*.log
  ```

- [ ] **Nginx/Apache Logs**
  ```bash
  # Check web server logs
  tail -f /var/log/nginx/access.log
  tail -f /var/log/nginx/error.log
  ```

## Documentation Review

- [ ] **Update Team Documentation**
  - [ ] Add inventory endpoints to API docs
  - [ ] Document new hooks for frontend team
  - [ ] Update user manual with inventory features

- [ ] **Code Review**
  - [ ] All code reviewed by team
  - [ ] Tests cover new functionality
  - [ ] Documentation comments complete

- [ ] **Training Materials**
  - [ ] Create training guide for nurses
  - [ ] Record demo video
  - [ ] Prepare FAQ document

## Sign-off

### Development Team
- [ ] Backend Developer: _________________ Date: _________
- [ ] Frontend Developer: ________________ Date: _________
- [ ] Database Administrator: ____________ Date: _________

### QA Team
- [ ] QA Lead: __________________________ Date: _________
- [ ] Security Tester: ___________________ Date: _________

### Management
- [ ] Project Manager: ___________________ Date: _________
- [ ] Technical Lead: ____________________ Date: _________

## Notes

Use this section to record any issues encountered during deployment:

```
Date: _________
Issue:
Resolution:

Date: _________
Issue:
Resolution:
```

---

## Emergency Contacts

**Backend Issues:**
- Name: _______________
- Phone: _______________
- Email: _______________

**Frontend Issues:**
- Name: _______________
- Phone: _______________
- Email: _______________

**Database Issues:**
- Name: _______________
- Phone: _______________
- Email: _______________

**Production Server:**
- Provider: _______________
- Support: _______________
- Account: _______________

---

**Deployment Date**: __________
**Deployed By**: __________
**Version**: 1.0
**Status**: [ ] Successful [ ] Issues (see notes)
