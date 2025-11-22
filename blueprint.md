# Project Blueprint

## Overview

This project is a web-based casino application featuring three mini-games: "Lucky Spin", "Sevens Heaven", and "Cup of Fortune". The application is built using modern, framework-less web technologies, including HTML, CSS, and JavaScript. The user interface is designed to be intuitive, responsive, and visually engaging, with a focus on providing a premium and accessible user experience.

## Style, Design, and Features

### General

*   **Layout:** A clean, centered layout that is responsive and adapts to various screen sizes.
*   **Color Palette:** A vibrant and energetic color palette is used to create a visually appealing experience. A rich, textured background and a green and gold color scheme create a "casino" feel.
*   **Typography:** The application now uses the elegant 'Playfair Display' for titles and 'Lora' for body text to enhance the premium casino theme.
*   **Iconography:** Icons are used to enhance the user's understanding and navigation of the application.
*   **Interactivity:** Interactive elements such as buttons and cards have a shadow and "glow" effect to provide a tactile feel and visual feedback.
*   **Animations:** Smooth animations are used to provide feedback to the user and enhance the overall experience.

### Sound and Visual Effects

*   **Sound Effects:** The application now includes placeholder sound effects for button clicks, game actions (spin, shuffle), wins, and losses, all generated via the Web Audio API.
*   **Particle Effects:** A dynamic "coin shower" particle effect is triggered upon winning a game, significantly enhancing the feeling of reward.

### Home Page

*   **Card-Based Navigation:** The game selection is presented as a set of visually appealing cards with enhanced styling.
*   **Hero Section:** A hero section with a welcoming title and subtitle has been added to the home page.

### Games

*   **Lucky Spin:** A wheel-of-fortune style game where the user spins a wheel to win prizes.
*   **Sevens Heaven:** A roulette-style game where the user bets on the outcome of a spinning wheel.
*   **Cup of Fortune:** A shell game where the user tries to find a prize hidden under one of five cups.
    *   **Jumpscare:** If the user selects a cup without a prize, a brief "jumpscare" image will appear on the screen.

### Balance and Dev Mode

*   **Player Balance:** The user starts with a balance of $100, which is updated as they play the games.
*   **Balance Persistence:** The player's balance is saved in the browser's local storage, so it will persist even after the page is refreshed.
*   **Developer Mode:** A developer mode is available that allows the user to play the games without any cost.
