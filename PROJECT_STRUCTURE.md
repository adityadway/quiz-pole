# Live Polling System - Project Structure

## Overview
A real-time polling system using Socket.IO for bidirectional communication between teachers and students.

## Architecture

```
quiz-pole/
├── server/                 # Backend (Node.js + Express + Socket.IO)
│   ├── index.js           # Server setup and initialization
│   ├── socket.js          # Socket.IO event handlers
│   └── poll.js            # Poll management logic & data storage
│
└── client/                 # Frontend (React + Vite)
    ├── src/
    │   ├── pages/         # Main views
    │   │   ├── RoleSelection.jsx    # Entry point (Student/Teacher choice)
    │   │   ├── Student.jsx          # Student interface
    │   │   └── Teacher.jsx          # Teacher interface
    │   │
    │   ├── components/    # Reusable components
    │   │   ├── PollResults.jsx      # Animated results bars
    │   │   ├── Chat.jsx             # Chat interface
    │   │   ├── ParticipantsList.jsx # Participants panel
    │   │   └── Timer.jsx            # Countdown timer
    │   │
    │   ├── socket.js      # Socket.IO client instance
    │   ├── App.jsx        # Main app with routing
    │   └── main.jsx       # Entry point
    │
    └── index.html
```

## Backend Structure

### `poll.js` - Data Management
**State:**
- `poll` - Current active poll
- `pollHistory` - Array of completed polls
- `chatMessages` - All chat messages
- `participants` - Connected users with roles

**Functions:**
- Poll CRUD: `createPoll()`, `endPoll()`, `getPoll()`, `getPollHistory()`
- Answers: `submitAnswer()`, `calculateResults()`
- Participants: `addParticipant()`, `removeParticipant()`, `getParticipants()`
- Chat: `addChatMessage()`, `getChatMessages()`

### `socket.js` - Event Handlers
**Events Handled:**
- `user:set_role` - Role assignment (student/teacher)
- `teacher:create_poll` - Create new poll
- `student:submit_answer` - Submit vote
- `chat:send` - Send chat message
- `teacher:kick_student` - Remove student
- `poll:get_history` - Retrieve past polls
- `disconnect` - Cleanup on disconnect

**Events Emitted:**
- `state:initial` - Send full state to new user
- `poll:started` - Broadcast new poll
- `poll:update` - Broadcast live results
- `poll:ended` - Broadcast final results
- `participants:update` - Broadcast participant list
- `chat:message` - Broadcast chat message
- `student:kicked` - Notify kicked student

## Frontend Structure (To Be Implemented)

### Pages

#### `RoleSelection.jsx`
- Welcome screen
- "I'm a Student" / "I'm a Teacher" buttons
- Name input
- Emits `user:set_role` on continue

#### `Student.jsx`
**States:**
- Waiting (no active poll)
- Active poll (with timer and options)
- Results view (after answering or poll ends)

**Features:**
- Display question and options
- Submit answer (one-time only)
- View live results
- Chat panel
- Participants list
- Handle kick-out

#### `Teacher.jsx`
**Features:**
- Create poll form (question, options, duration)
- Live results dashboard
- Participants panel with kick buttons
- Poll history view
- Chat monitoring
- "Ask Next Question" button

### Components

#### `PollResults.jsx`
- Props: `results` array
- Displays animated progress bars
- Shows percentages and vote counts

#### `Chat.jsx`
- Props: `messages`, `onSend`
- Message list with scrolling
- Input field and send button
- Displays sender name and role

#### `ParticipantsList.jsx`
- Props: `participants`, `isTeacher`, `onKick`
- Lists all connected users
- Shows role badges
- Kick button (teacher only)

#### `Timer.jsx`
- Props: `startTime`, `duration`, `onEnd`
- Countdown display
- Auto-calls `onEnd` when time expires

## Data Flow

### Poll Creation Flow
```
Teacher UI → teacher:create_poll → Server
Server → poll:started → All Clients
Server → setTimeout → Auto-end after duration
Server → poll:ended → All Clients
```

### Answer Submission Flow
```
Student UI → student:submit_answer → Server
Server → calculateResults() → poll:update → All Clients
All Clients → Update UI with new percentages
```

### Chat Flow
```
User UI → chat:send → Server
Server → addChatMessage() → chat:message → All Clients
All Clients → Append to chat history
```

### Kick Flow
```
Teacher UI → teacher:kick_student → Server
Server → Verify teacher role
Server → student:kicked → Target Student
Server → disconnect() → Target Student
Server → participants:update → All Clients
```

## Key Design Decisions

1. **In-Memory Storage**: All data stored in server memory (no database)
   - Pros: Simple, fast, no dependencies
   - Cons: Data lost on server restart
   - Rationale: Suitable for live sessions, enables static deployment

2. **Single Active Poll**: Only one poll can be active at a time
   - Prevents confusion and conflicts
   - Simplifies state management
   - Teacher must wait for poll to end before creating next

3. **Role-Based Access**: Teacher vs Student permissions
   - Only teachers can create polls and kick students
   - Students can only answer and chat
   - Enforced server-side for security

4. **Live Results**: Results visible to everyone in real-time
   - Encourages engagement
   - Transparent and interactive
   - Updates on every vote

5. **Auto-End Polls**: Timer-based automatic poll closure
   - Ensures polls don't run indefinitely
   - Consistent experience for all users
   - Server-side timer for accuracy

## Socket.IO Benefits

- **Real-time bidirectional communication**: Server can push updates to clients
- **Automatic reconnection**: Handles network issues gracefully
- **Room support**: Can be extended for multiple classrooms
- **Event-based**: Clean separation of concerns
- **Broadcast capability**: Send to all/specific clients efficiently

## Next Steps

1. Implement `RoleSelection.jsx` page
2. Build `Student.jsx` with all states
3. Enhance `Teacher.jsx` with full features
4. Create reusable components
5. Add styling and animations
6. Test multi-user scenarios
7. Deploy as static site

## Testing Strategy

1. **Single User**: Test role selection and UI flow
2. **Two Users**: Test teacher-student interaction
3. **Multiple Students**: Test concurrent voting and results
4. **Edge Cases**: Test kick, disconnect, rapid voting
5. **Performance**: Test with 50+ concurrent students
