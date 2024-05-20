import express from 'express';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';

const app = express();
const port = 3001;

const swaggerDocument = YAML.load(join(dirname(fileURLToPath(import.meta.url)), 'schema.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});