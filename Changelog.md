# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-16

### Added

- Better lighting & shadows
- Block appear animation
- To do list appears when timer starts
- Changed grass texture
- Ability to pause the timer
- Enter key press now triggers timer to start
- Long hover over blocks to get info about them

### Changes

- App name in config
- Left and right arrow key detection is no longer in svelte:window
- Minor UI changes - timer select and timer menu
- Swapped a & d keys for camera

### Fixes

- Audio now plays on launch
- Camera rotation is no longer inverted

### Issues

- Visual glitches with tooltips

-README

## [0.6.0] - 2025-11-15

### Added

- Ambient sound that can be toggled on & off
- Press left/a or right/d to rotate the view
- Tips in the menu

### Fixes

- Can now override numbers in timer input
- Numbers are only allowed in timer input

## [0.6.0] - 2025-11-15

### Added

- Flowers Block
- Handled the event when the timer ends
- Added stats view in settings

---

## [0.5.1] - 2025-11-15

### Fixes

- Text alignment in settings ui

---

## [0.5.0] - 2025-11-15

### Added

- Settings Menu
    - Reset data button
    - Button to open README
- Bush Block
- Tree Block

### Changes

- Lowered hances of a grass block appearing if the user only does a short pomodoro session

---

## [0.4.0] - 2025-11-15

### Added

- Local peristant storage of User XP & Blocks
- Added Water Blocks
- Long hover over blocks for more info about them

### Changes

- Autosave logic

### Fixed

- No longer passing full pomodoro session time, now its the duration the user studied for

---

## [0.3.0] - 2025-11-15

### Added

- Xp now accumulates with each pomodoro session
- New window when a pomodoro session ends
- Made scene camera more sensitive to cursor

### Changes

- Camera position
- UI and scene colours

### Fixed

- Inverted camera movement with cursor on y axis
- Spelling Mistake in title in menu

---

## [0.2.0] - 2025-11-15

### Added

- Added Lighting
- Upgraded timer input
- After each pomodoro session a grass block is added

---

## [0.1.0] - 2025-11-14

### Added

- Added grid system for blocks

### Changes

- Menu camera position

---

## [0.0.1] - 2025-11-14

### Added

- Menu with title and buttons (no functionality yet).
- Added movable camera
- Added single grass block
