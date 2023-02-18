module.exports = {
	apps: [
	  {
		name: 'shattered-sky-net',
		port: '3344',
		exec_mode: 'cluster',
		instances: 'max',
		script: './.output/server/index.mjs'
	  }
	]
  }
