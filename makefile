build:
	tsc

run: build
	node target/main.js