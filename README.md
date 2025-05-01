<div align="center">
<img src="frontend/public/logo.png" alt="CompleteExpenseTracker Logo" width="400"/>
</div>

# exp - CompleteExpenseTracker

CompleteExpenseTracker is a full-stack expense tracking web application that allows users to manage up to four financial accounts, automatically logs transactions, and provides charts for visualizing spending and income. The application is deployed with Netlify (frontend) and Render (backend).

Live Application:
### https://harmonious-cascaron-35fd5b.netlify.app

------------------------------------------------------------------------------------------------

### Features:

* User authentication using JWT and secure cookies
* Manage up to 4 accounts per user
* Automatically creates transactions when funds are added or spent
* Dashboard includes pie and line charts for income and expenses (via Recharts)
* Frontend state managed using Zustand

  ------------------------------------------------------------------------------------------------

### Technologies Used:

### Frontend

* React
* Tailwind CSS
* Zustand
* Axios
* Recharts
  
### Backend

* Express.js
* PostgreSQL
* JWT for authentication
* Bcrypt for password hashing
* Deployed on Render

------------------------------------------------------------------------------------------------

 ### Database Overview (PostgreSQL):

The application uses a relational database with three main tables:

### `tbluser`
Stores user-related information.
- `id`: Primary key
- `email`: Unique user email
- `firstName`, `lastName`, `contact`: Personal details
- `accounts`: Array of account names
- `password`: Hashed password
- `country`, `currency`: User location and preferred currency (default `'USD'`)
- `createdAt`, `updatedAt`: Timestamps for tracking user record history

### `tblaccount`
Represents user accounts.
- `id`: Primary key
- `user_id`: Foreign key referencing `tbluser`
- `account_name`: Name of the account
- `account_number`: Identifier for the account
- `account_balance`: Current balance
- `createdAt`, `updatedAt`: Timestamps for record tracking

### `tbltransaction`
Logs financial transactions.
- `id`: Primary key
- `user_id`: Foreign key referencing `tbluser`
- `description`: Details about the transaction
- `status`: Status of the transaction (default `'Pending'`)
- `source`: Origin of the transaction
- `amount`: Value of the transaction
- `type`: `'Income'` or `'Expense'` (default `'Income'`)
- `createdAt`, `updatedAt`: Timestamps for record history

------------------------------------------------------------------------------------------------

### .env file

### Server Port
PORT=5000

### JWT Secret Key for authentication
JWT_SECRET=your_jwt_secret_key

### PostgreSQL Database URL
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
