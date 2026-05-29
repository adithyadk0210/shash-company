# Form Backend Setup

This website now uses a Node.js backend and MySQL database for the Contact Us and Careers forms.

## 1. Install MySQL

Install MySQL Server on your computer, then remember your MySQL username and password.

## 2. Create the database tables

Open MySQL Workbench or MySQL command line and run:

```sql
SOURCE C:/Users/hp/shash-company/database/schema.sql;
```

If `SOURCE` does not work in your tool, open `database/schema.sql`, copy the SQL, and run it.

## 3. Install Node packages

From this project folder, run:

```bash
npm install
```

## 4. Create your environment file

Copy `.env.example` to `.env`, then update the database password:

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shash_company
```

On this computer, MySQL Workbench is using port `3307`, so keep:

```env
DB_PORT=3307
```

## 5. Start the website

Run:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Important: use `http://localhost:3000`, not direct file opening, because the forms need the backend server.

## 6. Check stored form data

In MySQL, run:

```sql
USE shash_company;
SELECT * FROM contact_messages ORDER BY created_at DESC;
SELECT * FROM career_applications ORDER BY created_at DESC;
```

## Optional email notifications

Submissions are stored in MySQL by default. To also receive email notifications, fill these values in `.env`:

```env
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_app_password
NOTIFY_FROM=your_email@example.com
NOTIFY_TO=ceo@shashaprayathi.com
```
