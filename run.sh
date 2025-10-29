#!/bin/bash

echo "Starting Campus Lost & Found Application..."
echo "=========================================="

# Start backend
cd backend
echo "Starting backend server..."
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
cd frontend
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "Application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "=========================================="
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
