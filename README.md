<div align="center">
  <h3 align="center">PomoGrove 🌳</h3>
  <p align="center">
    Turn your focus sessions into a beautiful 3D productivity island
    <br />
    <a href="https://github.com/coquobxttr/pomogrove">View Demo</a>
    ·
    <a href="https://github.com/coquobxttr/pomogrove/issues">Report Bug</a>
    ·
    <a href="https://github.com/coquobxttr/pomogrove/issues">Request Feature</a>
  </p>
</div>

## About The Project

![PomoGrove Screenshot](/static/AppImg1.png)

**PomoGrove** is a gamified pomodoro timer that transforms your productivity into a visual 3D experience. Every focus session you complete adds a new block to your personal island - the longer you focus, the more beautiful elements you unlock.

### Features

- **Visual Growth**: Watch your island grow with every completed pomodoro session
- **Progressive Rewards**: Unlock grass, water, flowers, bushes, and trees based on session length
- **3D Interactive Island**: Rotate and explore your productivity landscape
- **Persistent Progress**: All your data is saved locally - your island grows with you
- **Ambient Audio**: Optional background music to help you focus (bring your own!)
- **Customizable Sessions**: Set any timer duration that works for you

### Built With

![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)
![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Getting Started

### Prerequisites

- **Node.js & npm** - [Download here](https://nodejs.org/)
- **Rust** - [Install here](https://www.rust-lang.org/tools/install)
- **Ambient audio file** (optional) - Add your own MP3 to `static/audio/ambient.mp3`

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/coquobxttr/pomogrove.git
   cd pomogrove
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Set up Tailwind CSS (if not already configured)
   ```sh
   # Follow the official SvelteKit guide
   # https://tailwindcss.com/docs/guides/sveltekit
   ```

4. Add your ambient audio (optional)
   ```sh
   # Place your audio file at:
   # static/audio/ambient.mp3
   ```

5. Run in development mode
   ```sh
   npm run tauri dev
   ```

6. Build for production
   ```sh
   npm run tauri build
   ```

## Usage

1. **Start a Session**: Click "Start" and set your desired focus time
2. **Stay Focused**: Work while the timer counts down
3. **Earn Rewards**: Complete the session to add a new block to your island
4. **Grow Your Grove**: Keep focusing to unlock better blocks and build your unique landscape

### Block Types & Unlock Requirements

- 🟩🟦 **Grass/Water**: Short sessions (< 5 minutes)
- 🌸 **Flowers**: Medium sessions (5-10 minutes)  
- 🌿 **Bushes**: Long sessions (10-15 minutes)
- 🌳 **Trees**: Deep focus sessions (15+ minutes)

## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Built for [***CS Girlies November Hackathon 2025***](https://cs-girlies-november.devpost.com)
- **3D Model Links**
  - [Flowers](https://sketchfab.com/3d-models/low-poly-flowers-857802babfd542e094e8ef2c396be360) - Anskar
  - [Bush](https://sketchfab.com/3d-models/low-poly-bushes-e109272b7ea34cc0a09cbd26e6fdc6d8) - Martin3DWork - Recoloured by me
  - [Tree](https://free3d.com/3d-model/low-poly-tree-449895.html) - medo_544 - Recoloured by me
- Ambient Audio - [The Guild of Ambience](https://www.youtube.com/watch?v=xNN7iTA57jM&t=5523s)