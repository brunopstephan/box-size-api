# EX 1 - Box size API

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

# EX 2 - SQL Queries

- QUANTIDADE DE HORAS QUE CADA PROFESSOR TEM COMPROMETIDO EM AULAS

```sql
SELECT 
    p.id AS professor_id,
    p.title_id,
    t.name AS professor_name,
    COUNT(cs.id) AS total_classes,
    SUM(TIMESTAMPDIFF(HOUR, cs.start_time, cs.end_time)) AS total_hours_per_week
FROM PROFESSOR p
JOIN TITLE t ON p.title_id = t.id
JOIN SUBJECT s ON s.professor_id = p.id
LEFT JOIN CLASS c ON c.subject_id = s.id
LEFT JOIN CLASS_SCHEDULE cs ON cs.class_id = c.id
GROUP BY p.id, p.title_id, t.name
ORDER BY total_hours_per_week DESC;
```

- LISTA DE SALAS COM HORÁRIOS LIVRES E OCUPADOS

```sql
SELECT 
    r.id AS room_id,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    CASE 
        WHEN cs.id IS NOT NULL THEN 'OCUPADA'
        ELSE 'LIVRE'
    END AS status,
    COALESCE(s.name, 'Sem aula agendada') AS subject_name,
    COALESCE(t.name, 'Nenhum professor') AS professor_name
FROM ROOM r
LEFT JOIN CLASS_SCHEDULE cs ON cs.room_id = r.id
LEFT JOIN CLASS c ON cs.class_id = c.id
LEFT JOIN SUBJECT s ON c.subject_id = s.id
LEFT JOIN PROFESSOR p ON s.professor_id = p.id
LEFT JOIN TITLE t ON p.title_id = t.id
ORDER BY r.id, cs.day_of_week, cs.start_time;
```
