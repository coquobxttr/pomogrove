# Changelog

All notable changes to this project will be documented in this file.

## [alpha-beta-1.1.0] - 2025-11-20

### Added

- Added icon to audio button that toggles
- Version number to homescreen
- Animation to block tooltip
- To do list function for each pomodoro session
- Tooltip now indicates to the user which block is their first block
- Spotlight that syncs to time of day
- Random rotation to trees, bushes & flowers
- Loading screen on app launch
- Rotation island view with horizontal trackpad movement
- Breaks between pomodoro sessions

## Changes

- Reduced the chances of grass blocks appearing
- Multiple blocks are now added depending on how long the user studied
    - under 5 mins - grass/water block
    - under 10 mins - grass/water block + flower block
    - under 15 mins - 2x grass/water block + bush/flower block
    - under 20 mins - 2x grass/water block + bush block
    - under 25 mins - 3x grass/water block + tree block
    - over 25 mins - 3x grass/water block + 2x bush/flower block + tree
- Minor UI changes

### Fixes

- User can now pan the camera while in a pomodoro session
- Pomodoro end screen now displays the 'ok' and 'good' messages
- Tooltips now don't display after hovering on another block
- XP resets when the user resets their data

---

## [alpha-1.0.0] - 2025-11-16

### Added

- Better lighting & shadows
- Block appear animation
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

## [alpha-0.6.0] - 2025-11-15

### Added

- Ambient sound that can be toggled on & off
- Press left/a or right/d to rotate the view
- Tips in the menu

### Fixes

- Can now override numbers in timer input
- Numbers are only allowed in timer input

## [alpha-0.6.0] - 2025-11-15

### Added

- Flowers Block
- Handled the event when the timer ends
- Added stats view in settings

---

## [alpha-0.5.1] - 2025-11-15

### Fixes

- Text alignment in settings ui

---

## [alpha-0.5.0] - 2025-11-15

### Added

- Settings Menu
    - Reset data button
    - Button to open README
- Bush Block
- Tree Block

### Changes

- Lowered hances of a grass block appearing if the user only does a short pomodoro session
- UI text colours

---

## [alpha-0.4.0] - 2025-11-15

### Added

- Local peristant storage of User XP & Blocks
- Added Water Blocks
- Long hover over blocks for more info about them

### Changes

- Autosave logic

### Fixed

- No longer passing full pomodoro session time, now its the duration the user studied for

---

## [alpha-0.3.0] - 2025-11-15

### Added

- Xp now accumulates with each pomodoro session
- New window when a pomodoro session ends
- Made scene camera more sensitive to cursor
- Zoom mechanic by scrolling
- Random rotation to blocks

### Changes

- Camera position
- UI and scene colours
- Other block tooltips dont appear when the user hovers over other blocks 

### Fixed

- Inverted camera movement with cursor on y axis
- Spelling Mistake in title in menu

---

## [alpha-0.2.0] - 2025-11-15

### Added

- Added Lighting
- Upgraded timer input
- After each pomodoro session a grass block is added

---

## [alpha-0.1.0] - 2025-11-14

### Added

- Added grid system for blocks

### Changes

- Menu camera position

---

## [alpha-0.0.1] - 2025-11-14

### Added

- Menu with title and buttons (no functionality yet).
- Added movable camera
- Added single grass block
