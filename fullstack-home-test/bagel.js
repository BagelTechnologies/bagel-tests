#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = __dirname;
const BACKEND_DIR = path.join(PROJECT_ROOT, 'starter', 'backend');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'starter', 'frontend');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(`🥯 ${title}`, 'cyan');
  log(`${'='.repeat(50)}`, 'cyan');
}

function checkCommand(command) {
  return new Promise((resolve) => {
    exec(`which ${command}`, (error) => {
      resolve(!error);
    });
  });
}

function runCommand(command, cwd = PROJECT_ROOT, detached = false) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command}`, 'yellow');
    const child = spawn(command, [], {
      shell: true,
      cwd,
      stdio: detached ? 'ignore' : 'inherit',
      detached
    });

    if (detached) {
      child.unref();
      resolve();
      return;
    }

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkHealth(url, maxRetries = 30, interval = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Service not ready yet
    }
    await sleep(interval);
  }
  return false;
}

async function startMongoDB() {
  logSection('Starting MongoDB');
  
  // Check if Docker is available
  const hasDocker = await checkCommand('docker');
  
  if (hasDocker) {
    try {
      // Check if mongo-test container already exists
      await runCommand('docker stop mongo-test 2>/dev/null || true');
      await runCommand('docker rm mongo-test 2>/dev/null || true');
      
      // Start MongoDB container
      await runCommand('docker run -d --name mongo-test -p 27017:27017 mongo:7');
      log('✅ MongoDB started with Docker', 'green');
      
      // Wait a bit for MongoDB to be ready
      log('⏳ Waiting for MongoDB to be ready...', 'yellow');
      await sleep(3000);
      return true;
    } catch (error) {
      log('❌ Failed to start MongoDB with Docker', 'red');
    }
  }
  
  // Check if MongoDB is already running locally
  try {
    const response = await fetch('mongodb://localhost:27017');
    log('✅ MongoDB is already running locally', 'green');
    return true;
  } catch (error) {
    // MongoDB not running
  }
  
  // Try to start local MongoDB
  const hasBrew = await checkCommand('brew');
  if (hasBrew) {
    try {
      await runCommand('brew services start mongodb/brew/mongodb-community');
      log('✅ MongoDB started with Homebrew', 'green');
      await sleep(2000);
      return true;
    } catch (error) {
      log('❌ Failed to start MongoDB with Homebrew', 'red');
    }
  }
  
  log('❌ Could not start MongoDB. Please start it manually:', 'red');
  log('   Option 1: docker run -d --name mongo-test -p 27017:27017 mongo:7', 'yellow');
  log('   Option 2: brew install mongodb-community && brew services start mongodb/brew/mongodb-community', 'yellow');
  log('   Option 3: Use MongoDB Atlas (cloud) and update MONGODB_URI in backend/.env', 'yellow');
  return false;
}

async function setupDependencies() {
  logSection('Setting up Dependencies');
  
  // Check if dependencies are already installed
  const backendNodeModules = path.join(BACKEND_DIR, 'node_modules');
  const frontendNodeModules = path.join(FRONTEND_DIR, 'node_modules');
  
  if (!fs.existsSync(backendNodeModules)) {
    log('📦 Installing backend dependencies...', 'blue');
    await runCommand('npm install', BACKEND_DIR);
  } else {
    log('✅ Backend dependencies already installed', 'green');
  }
  
  if (!fs.existsSync(frontendNodeModules)) {
    log('📦 Installing frontend dependencies...', 'blue');
    await runCommand('npm install', FRONTEND_DIR);
  } else {
    log('✅ Frontend dependencies already installed', 'green');
  }
}

async function startBackend() {
  logSection('Starting Backend');
  
  log('🚀 Starting backend server...', 'blue');
  
  // Start backend in background
  const child = spawn('npm', ['run', 'dev'], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    detached: true
  });
  
  child.unref();
  
  // Wait for backend to be ready
  log('⏳ Waiting for backend to be ready...', 'yellow');
  const backendReady = await checkHealth('http://localhost:4000/api/health');
  
  if (backendReady) {
    log('✅ Backend is ready at http://localhost:4000', 'green');
    return true;
  } else {
    log('❌ Backend failed to start', 'red');
    return false;
  }
}

async function startFrontend() {
  logSection('Starting Frontend');
  
  log('🚀 Starting frontend server...', 'blue');
  
  // Start frontend in background
  const child = spawn('npm', ['run', 'dev'], {
    cwd: FRONTEND_DIR,
    stdio: 'inherit',
    detached: true
  });
  
  child.unref();
  
  // Wait for frontend to be ready
  log('⏳ Waiting for frontend to be ready...', 'yellow');
  await sleep(3000);
  
  try {
    const response = await fetch('http://localhost:5173');
    if (response.ok) {
      log('✅ Frontend is ready at http://localhost:5173', 'green');
      return true;
    }
  } catch (error) {
    // Still starting
  }
  
  log('⚠️  Frontend is starting... check http://localhost:5173', 'yellow');
  return true;
}

async function showStatus() {
  logSection('🎉 Bagel Test is Ready!');
  
  log('📍 Services:', 'bright');
  log('   Frontend:  http://localhost:5173', 'green');
  log('   Backend:   http://localhost:4000/api', 'green');
  log('   Health:    http://localhost:4000/api/health', 'green');
  log('   MongoDB:   mongodb://localhost:27017', 'green');
  
  log('\n🔧 Commands:', 'bright');
  log('   bagel test status  - Check service status', 'cyan');
  log('   bagel test stop    - Stop all services', 'cyan');
  log('   bagel test logs    - Show logs', 'cyan');
  log('   bagel test clean   - Clean and reset', 'cyan');
  
  log('\n💡 Tips:', 'bright');
  log('   - Press Ctrl+C to stop this script', 'yellow');
  log('   - Services will continue running in background', 'yellow');
  log('   - Use "bagel test stop" to stop all services', 'yellow');
}

async function stopServices() {
  logSection('Stopping Services');
  
  // Stop processes by port
  const ports = [4000, 5173];
  for (const port of ports) {
    try {
      await runCommand(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
      log(`✅ Stopped service on port ${port}`, 'green');
    } catch (error) {
      // Port might not be in use
    }
  }
  
  // Stop MongoDB container
  try {
    await runCommand('docker stop mongo-test 2>/dev/null || true');
    await runCommand('docker rm mongo-test 2>/dev/null || true');
    log('✅ Stopped MongoDB container', 'green');
  } catch (error) {
    // Container might not exist
  }
  
  log('✅ All services stopped', 'green');
}

async function showHelp() {
  log('\n🥯 Bagel Test CLI', 'cyan');
  log('\nCommands:', 'bright');
  log('  bagel test up      - Start all services', 'green');
  log('  bagel test stop    - Stop all services', 'red');
  log('  bagel test status  - Check service status', 'blue');
  log('  bagel test clean   - Clean dependencies and reset', 'yellow');
  log('  bagel test help    - Show this help', 'cyan');
  
  log('\nExamples:', 'bright');
  log('  bagel test up      # Start everything', 'yellow');
  log('  bagel test status  # Check if services are running', 'yellow');
  log('  bagel test stop    # Stop all services', 'yellow');
}

async function checkStatus() {
  logSection('Service Status');
  
  const services = [
    { name: 'Frontend', url: 'http://localhost:5173', port: 5173 },
    { name: 'Backend', url: 'http://localhost:4000/api/health', port: 4000 },
    { name: 'MongoDB', url: 'mongodb://localhost:27017', port: 27017 }
  ];
  
  for (const service of services) {
    try {
      if (service.name === 'MongoDB') {
        // Check MongoDB differently
        exec('docker ps | grep mongo-test', (error) => {
          if (error) {
            log(`❌ ${service.name} - Not running`, 'red');
          } else {
            log(`✅ ${service.name} - Running on port ${service.port}`, 'green');
          }
        });
      } else {
        const response = await fetch(service.url);
        if (response.ok) {
          log(`✅ ${service.name} - Running on port ${service.port}`, 'green');
        } else {
          log(`❌ ${service.name} - Not responding`, 'red');
        }
      }
    } catch (error) {
      log(`❌ ${service.name} - Not running`, 'red');
    }
  }
}

async function cleanProject() {
  logSection('Cleaning Project');
  
  await stopServices();
  
  // Clean dependencies
  try {
    await runCommand('rm -rf starter/backend/node_modules starter/frontend/node_modules');
    await runCommand('rm -f starter/backend/package-lock.json starter/frontend/package-lock.json');
    log('✅ Cleaned dependencies', 'green');
  } catch (error) {
    log('❌ Failed to clean dependencies', 'red');
  }
  
  log('✅ Project cleaned. Run "bagel test up" to start fresh', 'green');
}

async function main() {
  const command = process.argv[2];
  const subcommand = process.argv[3];
  
  if (command !== 'test') {
    await showHelp();
    return;
  }
  
  switch (subcommand) {
    case 'up':
      try {
        const mongoStarted = await startMongoDB();
        if (!mongoStarted) {
          log('\n⚠️  MongoDB setup failed. You can still continue with in-memory mode.', 'yellow');
        }
        
        await setupDependencies();
        const backendStarted = await startBackend();
        
        if (backendStarted) {
          await startFrontend();
          await showStatus();
        }
      } catch (error) {
        log(`❌ Failed to start services: ${error.message}`, 'red');
        process.exit(1);
      }
      break;
      
    case 'stop':
      await stopServices();
      break;
      
    case 'status':
      await checkStatus();
      break;
      
    case 'clean':
      await cleanProject();
      break;
      
    case 'help':
    default:
      await showHelp();
      break;
  }
}

async function setupFetch() {
  // Handle global fetch for Node.js versions < 18
  if (typeof fetch === 'undefined') {
    const nodeFetch = await import('node-fetch');
    global.fetch = nodeFetch.default;
  }
}

setupFetch().then(() => {
  main().catch(error => {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  });
});
