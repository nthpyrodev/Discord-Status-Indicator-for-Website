# Discord Presence Status API + Website Widget

A simple Node.js project that runs a Discord bot to monitor your Discord online/idle/offline status and serves it over an HTTP API for use on your personal website.

## Requirements

- Node.js 18 or higher
- Discord.JS, Express, dotenv
- Nginx

## Setup

### Clone the repository

```bash
git clone https://github.com/nthpyrodev/Discord-Status-Indicator-for-Website.git
cd Discord-Status-Indicator-for-Website
```

### Install dependencies

```bash
npm install discord.js express dotenv
```

### Configure your environment

Create a `.env` file in the root directory:

```env
BOT_TOKEN=your_bot_token_here
YOUR_DISCORD_USER_ID=your_user_id_here
```

**Getting your Discord User ID:** Enable Developer Mode in Discord settings, then right-click on your username and select "Copy ID".

### Run the application

```bash
node bot.js
```

This will start the Discord bot and Express server. The bot will monitor the target user's status, and the server will be available at `http://localhost:3005/status`.

The API returns:
- `online` if the user is online, idle, or do not disturb
- `offline` if the user is offline or invisible

## Adding the Status Widget to Your Website

Add this HTML where you want the status to appear:

```html
<div id="discord-status" style="display: flex; align-items: center; font-family: sans-serif;">
    <span id="status-dot" style="width: 12px; height: 12px; border-radius: 50%; background: gray; display: inline-block; margin-right: 8px;"></span>
    <span id="status-text">Checking status...</span>
</div>

<script>
    async function fetchStatus() {
        try {
            const res = await fetch('/status');
            const status = await res.text();

            const dot = document.getElementById('status-dot');
            const text = document.getElementById('status-text');

            if (status === 'online') {
                dot.style.background = 'limegreen';
                text.textContent = 'Online on Discord';
            } else {
                dot.style.background = 'gray';
                text.textContent = 'Offline on Discord';
            }
        } catch (err) {
            console.error('Failed to fetch Discord status:', err);
            document.getElementById('status-text').textContent = 'Status unavailable';
        }
    }

    fetchStatus();
    setInterval(fetchStatus, 10000); // Update every 10 seconds
</script>
```

## Solving CORS Issues with NGINX

### The Problem

If your website and the status API are on different domains or ports, browsers will block the request due to CORS (Cross-Origin Resource Sharing) policies:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource...
```

### The Solution: NGINX Reverse Proxy

Set up NGINX to proxy requests to your status API. Here's an example configuration, make sure to add to your existing server {} block:

```nginx
    location /status {
        proxy_pass http://localhost:3005/status;
        proxy_set_header Host $host;
    }
```

With this setup, your website can make requests to `/status` as if it's on the same domain, eliminating CORS issues entirely.

## Using with Static Site Hosting

1. Deploy the bot to your VPS
2. Configure your domain's web server (NGINX) to proxy `/status` requests to your deployed application (Nginx config example included)
3. Your static site can then fetch from `/status` without CORS problems

## Discord Bot Setup

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and add a bot to it
3. In the bot settings, enable these **Privileged Gateway Intents**:
   - Presence Intent
   - Server Members Intent
4. Copy the bot token and add it to your `.env` file
5. Copy your user id and add it to your `.env` file
6. Invite the bot to a Discord server that you are in

The bot needs to be in the same server as the user to detect their presence status.

## API Reference

| Endpoint | Method | Response | Description |
|----------|--------|----------|-------------|
| `/status` | GET | `online` or `offline` | Returns the current Discord status of the monitored user |

## Notes

- At the moment, all statuses beside the invisible status on Discord will appear as online

## Troubleshooting

If you're having issues:

1. **Bot not detecting status**: Verify that the bot has Presence Intent enabled and is in a shared server
2. **API not responding**: Check that the Express server is running on the correct port
3. **CORS errors**: Implement the NGINX reverse proxy solution described above
4. **Authentication errors**: Double-check your bot token and user ID in the `.env` file

## Contributing

Contributions are welcome! If you'd like to add features or fix bugs, please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For major changes, consider opening an issue first to discuss your ideas.
