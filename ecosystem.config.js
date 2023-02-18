module.exports = {
	apps: [
	  {
		name: 'shattered-sky-net',
		port: '3000',
		exec_mode: 'cluster',
		instances: 'max',
		script: './.output/server/index.mjs'
	  }
	]
  }
