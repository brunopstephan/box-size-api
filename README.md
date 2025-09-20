# Box size API

A API thats receive a list of products and it's dimensions and return the better options of predeterminated boxes

This projects contains:
- Api key authorization;
- Swagger Documentation;
- Unit tests;
- CI/CD pipeline (for tests);

## Setup/Run

- Install dependencies:

```bash
yarn install
```
Or for npm:
```bash
npm install
```

- Rename the `.env.example` file to `.env`;
- Run the docker container:

```bash
docker compose up --build
```

Or in detatched mode

```bash
docker compose up -d --build
```

- If everything went well, you can access the [Documentation](http://localhost:9000/docs) 