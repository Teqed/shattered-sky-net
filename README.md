# shattered-sky-net

Repository for [shatteredsky.net](https://shatteredsky.net) website. Built with [Nuxt.js](https://nuxt.com/).

## Build

Clone the repository:

```bash
git clone https://github.com/Teqed/shattered-sky-net.git
```

Change into the project directory:

```bash
cd shattered-sky-net
```

Install dependencies using [Yarn](https://yarnpkg.com/):

```bash
yarn install
```

Build the application:

```bash
npm run build
```

## Deployment

This project uses PM2 to manage the application. PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks. See the [PM2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/) for more information.

After cloning the repository, installing dependencies, and building the application, you can start the application with PM2:

```bash
pm2 start
```

By default, this will start a cluster of 4 instances of the application that listen on port 3344. You can change the number of instances or listening port by editing the ecosystem.config.js file, which is used by PM2 to configure the application. It's recommended to use a reverse proxy like [Caddy](https://caddyserver.com/) to handle automatic HTTPS.

You can view the status of the application with:

```bash
pm2 status
```

![image](https://user-images.githubusercontent.com/5181964/221232265-dc0f18f8-7bdb-4b8a-81af-fe33e7839d79.png)

To keep the application running after you log out of the server, you can save the current PM2 process list:

```bash
pm2 save
```

## Pull latest changes, build, and redeploy

```bash
git pull && npm run build && pm2 restart all
```

## Development Server

The development server runs on [http://localhost:3000](http://localhost:3000) by default. You can change the port by editing the `nuxt.config.js` file.

```bash
npm run dev
```
