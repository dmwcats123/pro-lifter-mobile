# Pro Lifter

## Overview

Pro Lifter is a React Native app designed to help fitness enthusiasts track their workouts effortlessly. Developed with Expo, this app offers a user-friendly interface to log various exercises, set goals, and monitor progress over time. Whether you're a beginner or a seasoned athlete, Pro Lifter is your go-to gym companion.

## Features

- **Workout Logging**: Easily record every detail of your workout, from exercises and sets to reps and weights.
- **Progress Tracking**: Visualize your progress with intuitive graphs and statistics.
- **Goal Setting**: Set and achieve your fitness goals with personalized plans.

## Getting Started

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
- Install Expo CLI by running `npm install -g expo-cli`.

### Installation

1. Clone the repository:
git clone https://github.com/dmwcats123/pro-lifter-mobile.git
cd pro-lifter-mobile


2. Set up the backend server:
- Navigate to the backend directory:
  ```
  cd pro-lifter-mobile-backend
  ```
- Install dependencies:
  ```
  npm install
  ```
- Start the server (ensure you have your environment variables configured for your database and any other services):
  ```
  npm start
  ```

3. Set up the React Native frontend:
- Open a new terminal and navigate to the frontend directory from the root of your repository:
  ```
  cd pro-lifter-mobile/pro-lifter-mobile-frontend
  ```
- Install dependencies:
  ```
  npm install
  ```
- Start the Expo project:
  ```
  expo start
  ```

## Usage

After starting the frontend app with `expo start`, you can run it on a physical device using the Expo Go app or on an emulator/simulator.

1. **Expo Go App**: Scan the QR code displayed in the terminal or Expo Developer Tools with the Expo Go app on your iOS or Android device.
2. **iOS Simulator/Android Emulator**: Press `i` for iOS or `a` for Android in the terminal or use the Expo Developer Tools to open the app in the respective simulator/emulator.

## Backend API

The backend API for Pro Lifter is hosted on AWS Elastic Beanstalk, providing a scalable and reliable environment for our application's server-side logic. This setup allows for efficient handling of requests to and from the MongoDB database, ensuring a seamless user experience.

## Built With

- [React Native](https://reactnative.dev/) - A framework for building native apps using React.
- [Expo](https://expo.dev/) - An open-source platform for making universal native apps for Android and iOS with JavaScript and React.
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [MongoDB](https://www.mongodb.com/) - NoSQL database for modern applications.
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) - An easy-to-use service for deploying applications which automates the setup, scaling, and maintenance of your infrastructure.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact davematthews0705@gmail.com


