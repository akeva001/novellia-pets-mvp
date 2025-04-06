.PHONY: install clean start-ios setup ios-simulator start-server start-all stop-server

# Default target
all: setup start-all

# Install dependencies
install:
	npm install --legacy-peer-deps

# Install development dependencies
install-dev:
	npm install -g nodemon

# Clean installation
clean:
	rm -rf node_modules
	rm -rf ios/Pods
	rm -rf .expo
	watchman watch-del-all || true
	sudo rm -rf /tmp/metro-* || true
	sudo rm -rf /tmp/haste-map-* || true

# Setup everything (clean install)
setup: clean install

# Start Expo for iOS
start-ios:
	EXPO_USE_CUSTOM_PORTS=true npx expo start --tunnel --ios --clear

# Just start Expo (platform agnostic)
start:
	npx expo start --clear

# Open iOS simulator (requires Xcode)
ios-simulator:
	xcrun simctl boot "iPhone 15" 2>/dev/null || true
	open -a Simulator
	sleep 5  # Wait for simulator to fully boot

# Full iOS setup and launch
ios: ios-simulator start-ios

# Start the backend server
start-server:
	node server.js

# Stop the server
stop-server:
	kill `cat server.pid` && rm server.pid

# Start both frontend and backend (in separate terminals)
start-all:
	trap 'kill %1; kill %2' SIGINT; \
	node server.js & \
	EXPO_USE_CUSTOM_PORTS=true npx expo start --tunnel --ios --clear & \
	wait

# Help command
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make clean        - Clean project (remove node_modules, pods, etc.)"
	@echo "  make setup        - Clean and reinstall dependencies"
	@echo "  make start        - Start Expo (platform agnostic)"
	@echo "  make start-ios    - Start Expo specifically for iOS"
	@echo "  make ios-simulator - Open iOS simulator"
	@echo "  make ios          - Full iOS setup and launch"
	@echo "  make start-server - Start the backend server"
	@echo "  make start-all    - Start both frontend and backend"
	@echo "  make stop-server  - Stop the backend server"
	@echo "  make help         - Show this help message"
