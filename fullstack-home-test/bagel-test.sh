#!/bin/bash

# Bagel Test - Super Simple Version
# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() {
    echo -e "${1}${2}${NC}"
}

banner() {
    echo ""
    log $CYAN "🥯 ============================================"
    log $CYAN "   $1"
    log $CYAN "============================================"
}

check_dependencies() {
    if ! command -v node &> /dev/null; then
        log $RED "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log $RED "❌ npm is not installed. Please install npm first."
        exit 1
    fi
}

start_services() {
    banner "Starting Bagel Test Environment"
    
    check_dependencies
    
    # Stop any existing processes
    log $YELLOW "🧹 Cleaning up existing processes..."
    pkill -f "node src/simple-server.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    
    # Start MongoDB if Docker is available
    log $BLUE "🐳 Starting MongoDB..."
    if command -v docker &> /dev/null; then
        docker stop mongo-test 2>/dev/null || true
        docker rm mongo-test 2>/dev/null || true
        if docker run -d --name mongo-test -p 27017:27017 mongo:7 &> /dev/null; then
            log $GREEN "✅ MongoDB started in Docker"
        else
            log $YELLOW "⚠️  Docker failed, backend will use in-memory storage"
        fi
    else
        log $YELLOW "⚠️  Docker not found, backend will use in-memory storage"
    fi
    
    # Install dependencies
    log $BLUE "📦 Installing dependencies..."
    cd "$PROJECT_ROOT/starter/backend"
    if [ ! -d "node_modules" ]; then
        npm install --silent
        log $GREEN "✅ Backend dependencies installed"
    else
        log $GREEN "✅ Backend dependencies already installed"
    fi
    
    cd "$PROJECT_ROOT/starter/frontend"
    if [ ! -d "node_modules" ]; then
        npm install --silent
        log $GREEN "✅ Frontend dependencies installed"
    else
        log $GREEN "✅ Frontend dependencies already installed"
    fi
    
    # Start backend
    log $BLUE "🚀 Starting backend server..."
    cd "$PROJECT_ROOT/starter/backend"
    nohup npm run dev > "$PROJECT_ROOT/backend.log" 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend
    log $YELLOW "⏳ Waiting for backend..."
    for i in {1..20}; do
        if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
            log $GREEN "✅ Backend ready at http://localhost:4000"
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
    
    # Start frontend
    log $BLUE "🚀 Starting frontend server..."
    cd "$PROJECT_ROOT/starter/frontend"
    nohup npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    
    # Wait a bit for frontend
    log $YELLOW "⏳ Starting frontend..."
    sleep 5
    
    # Show status
    banner "🎉 Bagel Test Ready!"
    log $GREEN "📍 Services:"
    log $GREEN "   Frontend:  http://localhost:5173"
    log $GREEN "   Backend:   http://localhost:4000/api"
    log $GREEN "   Health:    http://localhost:4000/api/health"
    log $GREEN "   MongoDB:   mongodb://localhost:27017 (or in-memory)"
    echo ""
    log $CYAN "📝 Instructions:"
    log $YELLOW "   1. Open http://localhost:5173 in your browser"
    log $YELLOW "   2. Start building your task management app!"
    log $YELLOW "   3. Use './bagel-test.sh stop' to stop all services"
    log $YELLOW "   4. Check logs: tail -f backend.log frontend.log"
    echo ""
    log $BLUE "🎯 What to build:"
    log $YELLOW "   - Task CRUD operations (create, read, update, delete)"
    log $YELLOW "   - React Query for data fetching"
    log $YELLOW "   - Optimistic updates"
    log $YELLOW "   - Loading and error states"
    log $YELLOW "   - Form validation"
    echo ""
    log $GREEN "Happy coding! 🥯✨"
}

stop_services() {
    banner "Stopping All Services"
    
    # Stop processes
    pkill -f "node src/simple-server.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    
    # Stop MongoDB
    docker stop mongo-test 2>/dev/null || true
    docker rm mongo-test 2>/dev/null || true
    
    log $GREEN "✅ All services stopped"
}

check_status() {
    banner "Service Status"
    
    # Check backend
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        log $GREEN "✅ Backend - Running on port 4000"
    else
        log $RED "❌ Backend - Not running"
    fi
    
    # Check frontend
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        log $GREEN "✅ Frontend - Running on port 5173"
    else
        log $RED "❌ Frontend - Not running"
    fi
    
    # Check MongoDB
    if docker ps 2>/dev/null | grep mongo-test > /dev/null; then
        log $GREEN "✅ MongoDB - Running in Docker"
    else
        log $YELLOW "⚠️  MongoDB - Not running (using in-memory storage)"
    fi
    
    echo ""
    log $CYAN "📊 Quick Links:"
    log $BLUE "   Frontend: http://localhost:5173"
    log $BLUE "   Backend:  http://localhost:4000/api/health"
    
    echo ""
    log $CYAN "📝 Logs:"
    log $YELLOW "   Backend:  tail -f backend.log"
    log $YELLOW "   Frontend: tail -f frontend.log"
}

show_help() {
    banner "Bagel Test CLI"
    echo ""
    log $CYAN "Commands:"
    log $GREEN "  ./bagel-test.sh up      - Start all services"
    log $RED "  ./bagel-test.sh stop    - Stop all services"
    log $BLUE "  ./bagel-test.sh status  - Check service status"
    log $YELLOW "  ./bagel-test.sh help    - Show this help"
    echo ""
    log $CYAN "Quick Start:"
    log $YELLOW "  ./bagel-test.sh up"
    log $YELLOW "  # Open http://localhost:5173"
    log $YELLOW "  # Start coding!"
    echo ""
}

# Handle commands
case "$1" in
    "up"|"start")
        start_services
        ;;
    "stop"|"down")
        stop_services
        ;;
    "status")
        check_status
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        log $RED "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac
