## Laravel React Mini Product Managenment System

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PHP (v8.2 or higher)
- Composer
- MySQL or any other supported database

## Setup Instructions

   ```sh
   git clone https://github.com/ahsanranga72/isharify_task.git
   ```

### Backend (Laravel)

1. **Navigate to the back_end directory:**

   ```sh
   cd backend
   ```

2. **Install PHP dependencies:**

   ```sh
   composer install
   ```

3. **Create a `.env` file:**

   ```sh
   cp .env.example .env
   ```

4. **Generate an application key:**

   ```sh
   php artisan key:generate
   ```

5. **Configure your database in the `.env` file:**

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   ```

6. **Run database migrations:**

   ```sh
   php artisan migrate
   ```

7. **Create a symbolic link for storage:**

   ```sh
   php artisan storage:link
   ```

8. **Start the Laravel development server:**

   ```sh
   php artisan serve
   ```

   The Laravel backend should now be running at `http://127.0.0.1:8000`.

### Frontend (React)

1. **Navigate to the front_end directory:**

   ```sh
   cd front_end
   ```

2. **Install JavaScript dependencies:**

   ```sh
   npm install
   ```

3. **Start the React development server:**

   ```sh
   npm run dev
   ```

   The React frontend should now be running at `http://localhost:5173`.

## API Endpoints

- `POST /api/products` - Add a new product with details like name, description, price, and images.
- `GET /api/products` - Retrieve a list of products with their details and images. Also it will work as a search product by adding input search
- `GET /api/products/{id}` - Retrieve a single product's details and images.
- `PUT /api/products/{id}` - Update an existing product's details and images.
- `DELETE /api/products/{id}` - Delete a product and its associated images.
- `POST /api/products/bulk-upload` - Bulk upload products via a CSV file. You can use example.csv placed in root as an example csv file.
