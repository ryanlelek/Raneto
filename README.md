# Raneto [![Node.js CI](https://github.com/ryanlelek/Raneto/actions/workflows/nodejs.ci.yml/badge.svg)](https://github.com/ryanlelek/Raneto/actions/workflows/nodejs.ci.yml) [![FOSSA Status](https://app.fossa.com/api/projects/custom%2B44615%2Fgithub.com%2Fryanlelek%2FRaneto.svg?type=shield&issueType=license)](https://app.fossa.com/projects/custom%2B44615%2Fgithub.com%2Fryanlelek%2FRaneto?ref=badge_shield&issueType=license)

[![Raneto Logo](https://raw.githubusercontent.com/ryanlelek/Raneto/main/logo/logo_readme.png)](https://raneto.com/)

[Raneto](https://raneto.com) is a free, open, simple Markdown-powered knowledge base for Node.js.  
[Find out more &rarr;](https://docs.raneto.com/what-is-raneto)  
[Live Demo &rarr;](https://docs.raneto.com/)  
[Documentation &rarr;](https://docs.raneto.com/)

# Top Features

- All content is file-based
- Search file names and contents
- Markdown editor in the browser
- Login system for edit protection
- Simple and Lightweight

# Mailing List

[Click here to join the mailing list](https://23afbd9f.sibforms.com/serve/MUIFAG1rmxtMH-Y_r96h_E7js7A7nUKcvP1fTNlIvKTMIzh7wD3u9SVbCiBc-Wo9TkSBADb2e3PEvAHWuXPMyUe_dEcdJsUihGQwDBX79nvS9bm3JYqyWOPjxacnexONo5yxNgHtnQKKG3JYtPS1LL1oejZ0rTchHzphtZuEbUJ3Hg6CimV69nbqhGKoNj-sPNhpvjSqgSIv3Zu0) for project news and important security alerts!

# Environment Variables

Environment variables take the highest priority and override values set in `config/config.js`.

| Variable              | Config Key            | Type    | Description                                                                 |
| --------------------- | --------------------- | ------- | --------------------------------------------------------------------------- |
| `SESSION_SECRET`      | `session_secret`      | String  | Session signing secret. Min 32 chars. Generate: `openssl rand -base64 32`   |
| `ADMIN_USERNAME`      | `credentials[0]`      | String  | Admin username (must be set together with `ADMIN_PASSWORD`)                 |
| `ADMIN_PASSWORD`      | `credentials[0]`      | String  | Admin password (must be set together with `ADMIN_USERNAME`)                 |
| `CONTENT_DIR`         | `content_dir`         | String  | Path to content directory containing `.md` files (default: `content/pages`) |
| `BASE_URL`            | `base_url`            | String  | Base URL of the site (e.g. `https://docs.example.com`)                      |
| `SITE_TITLE`          | `site_title`          | String  | Site title shown in the browser and header                                  |
| `GOOGLE_ANALYTICS_ID` | `google_analytics_id` | String  | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`)                     |
| `LOCALE`              | `locale`              | String  | Locale code for UI translations (e.g. `en`, `fr`)                           |
| `AUTHENTICATION`      | `authentication`      | Boolean | Set to `true` to enable authentication                                      |
| `ALLOW_EDITING`       | `allow_editing`       | Boolean | Set to `true` to enable the web editor                                      |
| `ADDRESS`             | _(server)_            | String  | IP address to listen on (default: `127.0.0.1`)                              |
| `PORT`                | _(server)_            | Number  | Port to listen on (default: `8080`)                                         |
| `HOST`                | _(server)_            | String  | Deprecated — use `ADDRESS` instead                                          |

# License Report

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B44615%2Fgithub.com%2Fryanlelek%2FRaneto.svg?type=large&issueType=license)](https://app.fossa.com/projects/custom%2B44615%2Fgithub.com%2Fryanlelek%2FRaneto?ref=badge_large&issueType=license)
