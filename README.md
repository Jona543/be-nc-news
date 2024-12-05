# Northcoders News API

Hosted version: https://northcoders-news-7th3.onrender.com/api

This project aims to access application data stored in this repo, and provide this data to front end architecture.

When cloning this repo, in order to connect to the required databases please add .env.development and .env.test files.
When running this project, create two files called .env.test and .env.development and set environment variables for test and devlopment in each respectively as follows: PGDATABASE=nc_news_test
PGDATABASE=nc_news

Dependencies required: 
dotenv: npm i dotenv
express: npm i express
jest-sorted: npm i jest-sorted
pg: npm i pg

devDependencies required:
husky: npm i husky
jest-extended: npm i jest-extended
pg-format: npm i pg-format
supertest: npm i supertest

To seed local database: npm run seed
To run tests: npm run test

Minimum version of Node.js required: 6.0.0
Minimum version of Postgres required: 14.13

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
