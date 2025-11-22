# Project Blueprint

## Overview

This project is a web-based casino application featuring three mini-games: "Lucky Spin", "Sevens Heaven", and "Cup of Fortune". The application is built using modern, framework-less web technologies, including HTML, CSS, and JavaScript. The user interface is designed to be intuitive, responsive, and visually engaging, with a focus on providing a premium and accessible user experience.

## Style, Design, and Features

### General

*   **Layout:** A clean, centered layout that is responsive and adapts to various screen sizes.
*   **Color Palette:** A vibrant and energetic color palette is used to create a visually appealing experience.
*   **Typography:** Expressive and relevant typography is used to guide the user and emphasize important information.
*   **Iconography:** Icons are used to enhance the user's understanding and navigation of the application.
*   **Interactivity:** Interactive elements such as buttons and other controls have a shadow and glow effect to provide a tactile feel.
*   **Animations:** Smooth animations are used to provide feedback to the user and enhance the overall experience.

### Games

*   **Lucky Spin:** A wheel-of-fortune style game where the user spins a wheel to win prizes.
*   **Sevens Heaven:** A roulette-style game where the user bets on the outcome of a spinning wheel.
*   **Cup of Fortune:** A shell game where the user tries to find a prize hidden under one of five cups.

### Balance and Dev Mode

*   **Player Balance:** The user starts with a balance of $100, which is updated as they play the games.
*   **Developer Mode:** A developer mode is available that allows the user to play the games without any cost.

## Current Task: Change "Cup of Fortune" Cost

### Plan

1.  **Update `index.html`:**
    *   Change the display text for the cost of the "Cup of Fortune" game to "$7 per play".
    *   Update the button text to "Play ($7 Cost)".
2.  **Update `main.js`:**
    *   Change the cost of the "Cup of Fortune" game from 8 to 7 in the `startCupGame` function.
    *   Update the net gain/loss calculation in the `handleCupClick` function to reflect the new cost.

