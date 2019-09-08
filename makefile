build:
	tsc

run: build
	node target/main.js

test: build
	npm test