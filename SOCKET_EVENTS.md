# Socket.IO Event Documentation

This document describes all socket events used in the Live Polling System.

## Client → Server Events

### `user:set_role`
**Emitted by:** Student or Teacher when joining
**Payload:**
```javascript
{
  name: string,    // User's display name
  role: string     // "student" or "teacher"
}
```
**Response:** Server sends `state:initial` and broadcasts `participants:update`

---

### `student:join` (Legacy)
**Emitted by:** Student
**Payload:** `string` (student name)
**Response:** Server broadcasts `poll:update` and `participants:update`

---

### `teacher:create_poll`
**Emitted by:** Teacher
**Payload:**
```javascript
{
  question: string,
  options: string[],
  duration: number  // in seconds
}
```
**Response:** Server broadcasts `poll:started`, then auto-broadcasts `poll:ended` after duration

---

### `student:submit_answer`
**Emitted by:** Student
**Payload:** `number` (option index, 0-based)
**Response:** Server broadcasts `poll:update` with live results

---

### `chat:send`
**Emitted by:** Student or Teacher
**Payload:** `string` (message text)
**Response:** Server broadcasts `chat:message`

---

### `teacher:kick_student`
**Emitted by:** Teacher
**Payload:** `string` (target socket ID)
**Response:** Target student receives `student:kicked` and is disconnected

---

### `poll:get_history`
**Emitted by:** Teacher
**Payload:** None
**Response:** Server sends `poll:history`

---

## Server → Client Events

### `state:initial`
**Sent to:** New user upon connection
**Payload:**
```javascript
{
  poll: Poll | null,
  participants: Participant[],
  chatMessages: ChatMessage[],
  pollHistory: Poll[]
}
```

---

### `poll:started`
**Broadcast to:** All users
**Payload:**
```javascript
{
  id: number,
  question: string,
  options: string[],
  duration: number,
  startTime: number,
  answers: {},
  students: {},
  status: "ACTIVE"
}
```

---

### `poll:update`
**Broadcast to:** All users (when answer submitted)
**Payload:**
```javascript
{
  ...poll,
  liveResults: [
    {
      option: string,
      count: number,
      percentage: string  // e.g., "45.5"
    }
  ]
}
```

---

### `poll:ended`
**Broadcast to:** All users (when timer expires)
**Payload:**
```javascript
{
  ...poll,
  status: "ENDED",
  endTime: number,
  results: [
    {
      option: string,
      count: number,
      percentage: string
    }
  ]
}
```

---

### `poll:history`
**Sent to:** Requesting teacher
**Payload:** `Poll[]` (array of ended polls)

---

### `participants:update`
**Broadcast to:** All users
**Payload:**
```javascript
[
  {
    socketId: string,
    name: string,
    role: "student" | "teacher"
  }
]
```

---

### `chat:message`
**Broadcast to:** All users
**Payload:**
```javascript
{
  id: number,
  socketId: string,
  name: string,
  role: "student" | "teacher",
  message: string,
  timestamp: number
}
```

---

### `student:kicked`
**Sent to:** Kicked student only
**Payload:** None
**Effect:** Student is disconnected immediately after

---

### `error`
**Sent to:** Individual user
**Payload:**
```javascript
{
  message: string
}
```

---

## Data Structures

### Poll
```javascript
{
  id: number,
  question: string,
  options: string[],
  duration: number,
  startTime: number,
  endTime?: number,
  answers: { [socketId]: optionIndex },
  students: { [socketId]: studentName },
  status: "ACTIVE" | "ENDED",
  results?: ResultItem[],
  liveResults?: ResultItem[]
}
```

### ResultItem
```javascript
{
  option: string,
  count: number,
  percentage: string  // "0.0" to "100.0"
}
```

### Participant
```javascript
{
  socketId: string,
  name: string,
  role: "student" | "teacher"
}
```

### ChatMessage
```javascript
{
  id: number,
  socketId: string,
  name: string,
  role: "student" | "teacher",
  message: string,
  timestamp: number
}
```

---

## Event Flow Examples

### Student Joins and Answers Poll

1. **Student connects**
   - Client emits: `user:set_role({ name: "Alice", role: "student" })`
   - Server sends: `state:initial` (with current poll if active)
   - Server broadcasts: `participants:update`

2. **Teacher creates poll**
   - Teacher emits: `teacher:create_poll({ question: "...", options: [...], duration: 60 })`
   - Server broadcasts: `poll:started`

3. **Student answers**
   - Student emits: `student:submit_answer(2)`
   - Server broadcasts: `poll:update` (with liveResults)

4. **Poll ends**
   - Server auto-broadcasts: `poll:ended` (after 60 seconds)

### Teacher Kicks Student

1. **Teacher clicks kick**
   - Teacher emits: `teacher:kick_student("socket-id-123")`
   - Server sends to target: `student:kicked`
   - Server disconnects target
   - Server broadcasts: `participants:update`

### Chat Message

1. **Student sends message**
   - Student emits: `chat:send("Hello everyone!")`
   - Server broadcasts: `chat:message({ name: "Alice", message: "Hello everyone!", ... })`
