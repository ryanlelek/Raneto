/*
Title: Production Notes
Sort: 3
*/

When running a live site you'll want to set the `PORT` env variable to `80` so you don't need to add `:3000` to the URL.
This requires root privileges and is not recommended.

Instead it is preferred to use a reverse proxy for security reasons.
Heroku and other services handle this aspect for you, but you can implement your own reverse proxy with Nginx or Apache.
**See [Related Projects](%base_url%/related-projects) for deployment scripts to use on your own servers**

You can change the port anytime by setting the environment variable in your shell's profile, or running in-line as below:
`$ PORT=1234 npm start`
