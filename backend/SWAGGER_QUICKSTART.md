# Swagger/OpenAPI Quick Start Guide

## 🎯 Quick Access

**Interactive API Documentation**: http://localhost:3001/docs

**OpenAPI Specification**: http://localhost:3001/swagger.json

## 🚀 Getting Started (3 Steps)

### 1. Start the Server

```bash
cd backend
npm run dev
```

You should see:
```
White Cross API Server running on http://localhost:3001
Environment: development
API Documentation available at http://localhost:3001/docs
```

### 2. Open Swagger UI

Navigate to http://localhost:3001/docs in your browser.

### 3. Authenticate

1. **Register a test user** (if you don't have one):
   - Click on `POST /api/auth/register`
   - Click "Try it out"
   - Fill in the request body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "firstName": "Test",
       "lastName": "User",
       "role": "NURSE"
     }
     ```
   - Click "Execute"

2. **Login to get a token**:
   - Click on `POST /api/auth/login`
   - Click "Try it out"
   - Fill in credentials:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - Copy the `token` value from the response

3. **Authorize in Swagger**:
   - Click the green "Authorize" button at the top
   - In the "Value" field, enter: `Bearer <your-token>`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Click "Authorize"
   - Click "Close"

4. **You're ready!** All authenticated endpoints will now work.

## 📚 Understanding the Documentation

### Endpoint Tags (Categories)

The API is organized into the following categories:

- **Authentication** - Login, register, token management
- **Students** - Student profile management (PHI protected)
- **Medications** - Medication tracking and administration (PHI protected)
- **Health Records** - Medical records and history (HIGHLY SENSITIVE PHI)
- **Appointments** - Scheduling and appointment management
- **Emergency Contacts** - Emergency contact information
- **Incident Reports** - Incident tracking and reporting
- **Users** - User account management
- **Inventory** - Medical supplies inventory
- **Vendors** - Vendor management
- **Purchase Orders** - Purchase order tracking
- **Budget** - Budget management
- **Communication** - Messaging and notifications
- And more...

### Security Badges

Look for these security indicators in endpoint descriptions:

- 🔓 **No lock icon** - No authentication required
- 🔒 **Lock icon** - Authentication required
- **PHI Protected Endpoint** - Contains protected health information
- **HIGHLY SENSITIVE PHI** - Medical records, diagnoses, treatments
- **HIGHLY CONFIDENTIAL** - Mental health, counseling records

### Testing Endpoints

For any endpoint:

1. Click on the endpoint to expand it
2. Click "Try it out"
3. Fill in required parameters (highlighted with a red asterisk *)
4. Click "Execute"
5. View the response below

### Response Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad request (validation error)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found
- **409** - Conflict (duplicate resource)
- **500** - Internal server error

## 🎨 Features

### Try It Out

Every endpoint can be tested directly:
- Real requests to your local server
- Live responses
- Request/response headers visible
- Error handling demonstration

### Request Body Examples

Click "Example Value" to auto-fill request bodies with sample data.

### Schema Documentation

Every request and response includes:
- Field names
- Data types
- Descriptions
- Required vs optional fields
- Validation rules

### Download Specification

You can download the complete OpenAPI spec:
- Click "swagger.json" link at the top
- Or visit: http://localhost:3001/swagger.json
- Import into Postman, Insomnia, or other tools

## 💡 Tips & Tricks

### 1. Use the Search Bar
Type keywords to quickly find endpoints (e.g., "medication", "student", "login")

### 2. Collapse/Expand Sections
Click tag headers to collapse entire sections for easier navigation

### 3. Model Schemas
Scroll to the bottom to see all data model schemas

### 4. Copy cURL Commands
After executing a request, copy the generated cURL command for use in scripts

### 5. Bookmark Common Endpoints
Swagger UI URL supports deep linking to specific endpoints

## 🔧 Customization

### Changing the Host

If running on a different host/port, update `backend/src/config/swagger.ts`:

```typescript
host: process.env.SWAGGER_HOST || 'localhost:3001',
schemes: ['http', 'https']
```

### Customizing Appearance

Modify the `customCss` in `backend/src/config/swagger.ts`:

```typescript
customCss: `
  .swagger-ui .topbar {
    background-color: #2c5282;
  }
  .swagger-ui .info .title {
    color: #2c5282;
  }
`
```

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Ensure the backend server is running (`npm run dev`)
- Check that you're using the correct URL (http://localhost:3001)
- Verify CORS settings if accessing from a different domain

### "Unauthorized" responses
- Click the "Authorize" button and enter your Bearer token
- Make sure your token hasn't expired (24-hour lifetime)
- Re-login to get a fresh token if needed

### Missing endpoints
- Check that all route files are imported in `backend/src/index.ts`
- Verify route definitions include proper Swagger annotations
- Restart the server after code changes

### Validation errors
- Check the schema requirements (red asterisks indicate required fields)
- Verify data types match (string, number, date, etc.)
- Ensure date formats are ISO 8601 (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)

## 📖 Next Steps

1. **Explore the API**: Browse through different endpoint categories
2. **Test workflows**: Try complete workflows (register → login → create student → add medication)
3. **Review schemas**: Check the Models section for data structures
4. **Read full docs**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for comprehensive details
5. **Integrate**: Use the API in your frontend application

## 🔐 Security Reminders

- **Never commit JWT tokens** to version control
- **Use HTTPS in production** (not HTTP)
- **Rotate JWT secrets** regularly
- **Respect PHI protection** - This is healthcare data
- **Follow HIPAA guidelines** when accessing patient information
- **Log all PHI access** for compliance auditing

## 📞 Need Help?

- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed information
- Review [CLAUDE.md](../CLAUDE.md) for project context
- Contact: support@whitecross.health

---

**Happy API Testing! 🎉**
