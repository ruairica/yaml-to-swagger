import express from 'express';
import fs from 'fs';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';

const app = express();
const port = 3001;

const srcDir = dirname(fileURLToPath(import.meta.url));

fs.readdirSync(srcDir)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => ({ yaml: YAML.load(join(srcDir, file)), fileName: file.split('.')[0] }))
    .forEach((x) => {
        app.use(`/${x.fileName}`, swaggerUi.serveFiles(x.yaml), swaggerUi.setup(x.yaml));
        console.log(`Swagger UI available at http://localhost:${port}/${x.fileName}`);
    });

app.listen(port, () => {
    console.log(`Server running`);
});
