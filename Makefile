install:
	yarn

clean:
	rm -rf lib

build: clean
	NODE_ENV=production ./node_modules/.bin/babel \
		--out-dir=lib \
		--stage=0 \
		--ignore=*.spec.js \
		src

test:
	NODE_ENV=test ./node_modules/.bin/mocha \
		--require babel-polyfill \
		--compilers js:babel-core/register \
		--colors \
		--reporter=spec \
		--timeout=5000 \
		--recursive \
		--sort \
		'src/**/*.spec.js'

watch-test:
	NODE_ENV=test ./node_modules/.bin/mocha \
		--require babel-polyfill \
		--compilers js:babel-core/register \
		--colors \
		--reporter=spec \
		--timeout=5000 \
		--recursive \
		--sort \
		--watch \
		'src/**/*.spec.js'
