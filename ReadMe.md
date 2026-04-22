# Create the Backend (NestJS)
    1. Install Nest CLI: npm i -g @nestjs/cli
    2. Create the project: nest new backend (Give npm as package manager)

# Create the Frontend (Next.js)
    1. Run the creator: npx create-next-app@latest frontend (Use Default)

# Run Backend
    npm run start:dev --> http://localhost:3000

# Run Frontend
    npm run dev --> http://localhost:3001


# To Remove git folders from backend and frontend 
    Remove-Item .\backend\.git -Recurse -Force
    Remove-Item .\frontend\.git -Recurse -Force

# Connect with PostgreSQL 
    1. Open pgAdmin 4 and create databse
    2. Configure  .env file --> postgresql://USER:PASSWORD@localhost:5432/clinic_db?schema=public
    3. Go to backend terminal and run below commands
        npm install prisma --save-dev
        npm install @prisma/client
        npx prisma init
    4. Define Clinic Data (The Schema)
        Open the file backend/prisma/schema.prisma and update
    5. Push the Schema to the Cloud
        npx prisma db push
    6. Adding "Seed" Data 
        Inside  backend/prisma/ folder, create a new file called seed.ts. and add code 
    7. Run the Seed
        -> Open backend/package.json.
            "prisma": {
                "seed": "ts-node prisma/seed.ts"
            }
        -> Enter npm install -D ts-node
        -> Enter npx prisma db seed
