# Mars Viewer

A web application for viewing NASA's Mars rover photos with a Star Trek-inspired interface.

## Features

- View photos from four Mars rovers: Curiosity, Opportunity, Spirit, and Perseverance
- Filter photos by camera type, Earth date, and Sol (Mars day)
- Responsive design that works on desktop and mobile devices
- Light and dark theme options with preferences saved
- Detailed information about each photo and rover
- Dynamic loading of photos with error handling
- No server-side processing required - works entirely in the browser

## Live Demo

Visit the live application at: [https://housten.github.io/marsviewer/](https://housten.github.io/marsviewer/)

## How It Works

Mars Viewer uses NASA's Mars Photos API to fetch images taken by Mars rovers. The application is built with:

- Vanilla JavaScript (no frameworks)
- Custom CSS with a Star Trek-inspired UI
- Responsive design principles
- GitHub Pages for hosting

## API Usage

This project uses the [NASA Mars Rover Photos API](https://api.nasa.gov/). It currently uses NASA's DEMO_KEY for API access, which has rate limiting. For a production application, you should register for your own API key at [https://api.nasa.gov/](https://api.nasa.gov/).

## Browser Compatibility

Mars Viewer works in modern browsers that support:
- ES6+ features
- CSS Grid and Flexbox
- Fetch API

## Development

### Local Setup

1. Clone the repository:
   ```
   git clone https://github.com/housten/marsviewer.git
   ```
2. Open the project in your code editor
3. Launch with a local server (e.g., using VS Code's Live Server extension)

## Contribution Guidelines

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear messages.
4. Submit a pull request describing your changes.

Please ensure your code follows the project's style and includes relevant tests or documentation updates.

## Known Limitations

- The application uses NASA's DEMO_KEY, which has rate limits. For higher usage, register for your own API key.
- The app relies on client-side rendering, which may not perform well with a large number of photos.
- Limited support for older browsers that do not support ES6+ features or modern CSS.

## Deployment Workflow

This project is deployed using GitHub Pages. The deployment process is automated via a GitHub Actions workflow:

1. On every push to the `main` branch, the workflow builds and deploys the site to GitHub Pages.
2. The workflow configuration can be found in `.github/workflows/static.yml`.

To deploy manually:
1. Ensure your changes are committed and pushed to the `main` branch.
2. Verify the deployment at [https://housten.github.io/marsviewer/](https://housten.github.io/marsviewer/).

## License

MIT License - See LICENSE file for details.

## Credits

- Mars photos and data: [NASA/JPL](https://www.jpl.nasa.gov/)
- Created by: Heidi Housten