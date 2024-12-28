# POS System FrontEnd

This project is a Point of Sale (POS) System FrontEnd built using a layered architecture. It manages items, orders, customers, place orders, deliveries, and other functionalities required for a POS system.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used
- JavaScript

## Project Structure

The project follows a layered architecture with the following structure:
- `components/`: Contains reusable React components.
- `pages/`: Contains page components for different routes.
- `store/`: Contains context providers and state management logic.
- `App.tsx`: Main application component.
- `index.tsx`: Entry point of the application.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/nethmiumaya/POS_system-FrontEnd-.git
    ```
2. Navigate to the project directory:
    ```sh
    cd pos-system-frontend
    ```
## Usage

1. Start the development server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Features

- **Item Management**: Add, update, delete, and view items.
- **Customer Management**: Add, update, delete, and view customers.
- **Order Management**: Place orders, view order details, and manage deliveries.
- **Dashboard**: Overview of the shop's activities and statistics.

## Database Schema

The MySQL database schema includes the following tables:

- `items`: Stores item details.
- `customers`: Stores customer details.
- `orders`: Stores order details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
