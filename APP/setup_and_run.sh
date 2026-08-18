#!/bin/bash
set -e

echo "========================================================"
echo "🎓 Student Management System — Setup & Runner"
echo "========================================================"

echo "\n🧹 Step 0: Cleaning Next.js build cache..."
rm -rf .next

echo "\n📦 Step 1: Installing dependencies..."
npm install

echo "\n⚡ Step 2: Generating Prisma Client & Pushing schema..."
npx prisma generate
npx prisma db push

echo "\n🌱 Step 3: Seeding database with sample demo data..."
npm run seed

echo "\n🧪 Step 4: Running business logic unit tests..."
node scripts/run-test.js

echo "\n🚀 Step 5: Starting Next.js Development Server..."
npm run dev
