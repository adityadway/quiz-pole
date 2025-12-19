#!/bin/bash

# Launch multiple frontend instances for testing

echo "🚀 Starting multiple frontend instances..."
echo ""

# Start frontend on different ports
echo "Starting instance on port 5173..."
cd client && npm run dev -- --port 5173 &

sleep 2

echo "Starting instance on port 5174..."
cd client && npm run dev -- --port 5174 &

sleep 2

echo "Starting instance on port 5175..."
cd client && npm run dev -- --port 5175 &

sleep 2

echo "Starting instance on port 5176..."
cd client && npm run dev -- --port 5176 &

echo ""
echo "✅ All instances started!"
echo ""
echo "Access them at:"
echo "  - http://localhost:5173 (Teacher)"
echo "  - http://localhost:5174 (Student 1)"
echo "  - http://localhost:5175 (Student 2)"
echo "  - http://localhost:5176 (Student 3)"
echo ""
echo "Press Ctrl+C to stop all instances"

# Wait for user to stop
wait
