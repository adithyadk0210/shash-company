# Sri Shasha Prayathi Technologies Website

This guide explains how to run the website on your computer and share it with others using ngrok.

## Requirements

- Node.js installed
- ngrok installed
- Project folder: `C:\Users\hp\shash-company`
- Internet connection

## Step 1: Open The Project Folder

Open PowerShell or Command Prompt and run:

```powershell
cd C:\Users\hp\shash-company
```

## Step 2: Install Dependencies

Run this only the first time, or after dependencies change:

```powershell
npm install
```

## Step 3: Start The Website

Run:

```powershell
npm start
```

The website will start at:

```text
http://localhost:3000
```

Keep this terminal open while the website is running.

## Step 4: Open A Second Terminal

Open another PowerShell or Command Prompt window.

Run:

```powershell
ngrok http 3000
```

## Step 5: Copy The Public ngrok Link

After ngrok starts, it will show a public URL like:

```text
https://example-name.ngrok-free.dev
```

Copy the `https://` link and share it with others. They can open it on mobile, laptop, or any other device.

## Important Notes

- Keep both terminals open:
  - `npm start` terminal
  - `ngrok http 3000` terminal
- If you close either terminal, the public link will stop working.
- Free ngrok links change every time you restart ngrok.
- Visitors may see an ngrok warning page first. They can continue to visit the website.
- Contact and career form submissions need your local MySQL server running.

## Stop The Website

To stop the website, press:

```text
Ctrl + C
```

in both terminals.

If needed, you can also stop the running processes with:

```powershell
Stop-Process -Name ngrok
Stop-Process -Name node
```

## Quick Command Summary

Terminal 1:

```powershell
cd C:\Users\hp\shash-company
npm start
```

Terminal 2:

```powershell
ngrok http 3000
```
