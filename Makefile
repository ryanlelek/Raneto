#!/usr/bin/make

# The first command listed is the default
.PHONY: default
default: clean install;

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
		./app/**/*.js \
		./bin/*       \
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
	node ./server.js;

.PHONY: deploy
deploy:

	# Install Node.js Modules (Production)
	npm install --production; true;

.PHONY: d_build
d_build:
	docker build -t raneto-local:latest .;

.PHONY: d_run
d_run:
	docker run --rm -it -p 3000:3000 raneto-local:latest;

.PHONY: d_shell
d_shell:
	docker run --rm -it raneto-local:latest /bin/sh;
