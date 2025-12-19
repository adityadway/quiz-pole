# Testing with Multiple Localhost Instances

## Quick Start

### Method 1: Manual (Recommended for Control)

**Step 1: Start Backend (only once)**
```bash
cd server
node index.js
```

**Step 2: Start Multiple Frontends**

Open 4 separate terminals and run:

```bash
# Terminal 1
cd client && npm run dev

# Terminal 2  
cd client && npm run dev -- --port 5174

# Terminal 3
cd client && npm run dev -- --port 5175

# Terminal 4
cd client && npm run dev -- --port 5176
```

**Step 3: Open in Browser**
- `http://localhost:5173` → Teacher
- `http://localhost:5174` → Student (Alice)
- `http://localhost:5175` → Student (Bob)
- `http://localhost:5176` → Student (Charlie)

---

### Method 2: Using Script (Automated)

**Step 1: Start Backend**
```bash
cd server
node index.js
```

**Step 2: Run the script**
```bash
./start-multiple.sh
```

This will automatically start 4 frontend instances on ports 5173-5176.

---

## Why This Works

- **1 Backend Server** (port 5001) - Handles all the Socket.IO connections
- **Multiple Frontend Instances** (ports 5173, 5174, 5175, 5176) - Each is a separate client
- All frontends connect to the **same backend**, so they all see the same polls in real-time

---

## Testing Flow

1. **Backend running** on port 5001 ✅
2. **Frontend 1** (5173) → Select "Teacher" → Create poll
3. **Frontend 2** (5174) → Select "Student" → Enter "Alice" → Answer poll
4. **Frontend 3** (5175) → Select "Student" → Enter "Bob" → Answer poll  
5. **Frontend 4** (5176) → Select "Student" → Enter "Charlie" → Answer poll
6. **All browsers** → See live results update in real-time!

---

## Stopping All Instances

If using the script:
- Press `Ctrl+C` in the terminal running the script

If running manually:
- Press `Ctrl+C` in each terminal window

---

## Advantages of Multiple Localhost Instances

✅ No need for multiple devices  
✅ Easy to test on one computer  
✅ Can see all windows side-by-side  
✅ Fast switching between teacher/student views  
✅ Perfect for development and debugging  

---

## Tips

- **Arrange windows**: Use split screen to see all browser windows at once
- **Use different browsers**: Chrome for teacher, Firefox for students (easier to distinguish)
- **Bookmark the URLs**: Quick access to each instance
- **Name your students**: Use different names to track who's who
