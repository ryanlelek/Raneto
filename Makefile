#!/usr/bin/make

# The first command listed is the default
.PHONY: default
default: clean install build;

.PHONY: clean
clean:

	# Remove Temporary Files
	rm -rf ./node_modules/;

.PHONY: install
install:

	# Install Node.js Modules
	npm install;

.PHONY: test
test: delint mocha

.PHONY: delint
delint:

	# ESLint
	./node_modules/.bin/eslint \
		./app/**/*.js      \
		./bin/*            \
		./example/**/*.js  \
		./test/*.js;

.PHONY: mocha
mocha:
	npm test;

.PHONY: build
build:
	echo "REMOVED";

.PHONY: start
start:

	# Start HTTP Server
	node example/server.js

.PHONY: deploy
deploy:

	# Install Node.js Modules (Production)
	npm install --production; true;

.PHONY: d_build
d_build:

	docker build -t raneto-local:latest .;

.PHONT: d_run
d_run:

	docker run --rm -it -p 3000:3000 raneto-local:latest;
