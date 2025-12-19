# Multi-Host Testing Guide

## Quick Setup for Multiple Devices

### Step 1: Find Your IP Address

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Example output: `inet 192.168.1.100`

### Step 2: Create .env File (Optional)

If you want to connect from other devices, create a `.env` file in the `client` folder:

```bash
cd client
echo "VITE_SERVER_URL=http://192.168.1.100:5001" > .env
```

Replace `192.168.1.100` with your actual IP address.

### Step 3: Restart Servers

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 4: Access from Other Devices

**On your computer:**
- `http://localhost:5173`

**On other devices (phone, tablet, another computer):**
- `http://192.168.1.100:5173` (use your actual IP)

---

## Testing Scenarios

### Scenario 1: Teacher on Desktop, Students on Phones

1. **Desktop**: Open `http://localhost:5173` → Select "I'm a Teacher"
2. **Phone 1**: Open `http://192.168.1.100:5173` → Student → Enter name
3. **Phone 2**: Open `http://192.168.1.100:5173` → Student → Enter name
4. **Desktop**: Create poll
5. **Phones**: See poll instantly, submit answers
6. **All devices**: Watch live results

### Scenario 2: Multiple Computers

1. **Computer 1** (Teacher): `http://192.168.1.100:5173`
2. **Computer 2** (Student): `http://192.168.1.100:5173`
3. **Computer 3** (Student): `http://192.168.1.100:5173`

### Scenario 3: Classroom Setup

- **Teacher's laptop**: Connected to projector showing results
- **Students' phones/tablets**: All connected to same WiFi, accessing via IP

---

## Troubleshooting

### Can't connect from other devices?

1. **Check firewall**: Make sure ports 5001 and 5173 are allowed
2. **Same network**: All devices must be on the same WiFi network
3. **Use IP not localhost**: Other devices can't use `localhost`

### Find your IP on different systems:

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address"

**Linux:**
```bash
hostname -I
```

---

## Without .env File

If you don't create a `.env` file, you can still test by:

1. Opening multiple browser windows on the same computer
2. Using incognito/private windows
3. Using different browsers

The app will default to `localhost:5001` for the backend.
