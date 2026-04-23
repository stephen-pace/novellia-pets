# Novellia Pets

Novellia Pets is a small Expo React Native app for managing a pet's medical information.

## What it does

- Create a username
- Add a pet
- View and manage pets
- Add, edit, and delete medical records for:
  - vaccines
  - allergies
  - medications
- View a pet profile with medical history
- Add an image of a pet from the Photo Library
- Add dates using the native Date Picker
- Persist data locally on device
- Share medical records with the iOS native share sheet

## Tech stack

- Expo
- React Native
- TypeScript
- React Navigation
- AsyncStorage

## Running the app

Install dependencies:

npm install

Start the app:

npx expo start

Then run it in the iOS simulator by pressing "i" for iOS. 

## Notes

- App data is stored locally with AsyncStorage
- No backend is used
- No authentication is implemented beyond a simple username entry
- It has not been tested on Android
- AI tools used: Codex, ChatGPT
  -	Used to brainstorm architecture and UI tradeoffs
  -	Helped scaffold some component-level code and refactors
  -	Used for debugging, TypeScript questions, and React Native API lookup
  -	All final code was reviewed, adjusted, and understood before submission

