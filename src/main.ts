import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import YAML from 'yamljs';

const port = 3001;

const apiSpecs = (await readdir(import.meta.dir))
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => ({
        fileName: file.split('.')[0],
        yaml: YAML.load(join(import.meta.dir, file)),
    }))
    .reduce(
        (acc, cur) => acc.set(cur.fileName, cur.yaml),
        new Map<string, unknown>()
    );

apiSpecs.forEach((_, fileName) => {
    console.log(`Swagger UI available at http://localhost:${port}/${fileName}`);
});

Bun.serve({
    port: port,
    fetch(req) {
        const fileName = new URL(req.url).pathname.replace(/\//g, '');
        if (apiSpecs.has(fileName)) {
            return new Response(swaggerPage(apiSpecs.get(fileName)), {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        }
        return new Response(`404! that doesn't match a file name`);
    },
});

function swaggerPage(apiSpec: unknown): string {
    return `<html>
    <head>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css" />
        <script src="//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script>
            function render() {
                var ui = SwaggerUIBundle({
                    spec:  ${JSON.stringify(apiSpec)},
                    dom_id: '#swagger-ui',
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIBundle.SwaggerUIStandalonePreset
                    ]
                });
            }
        </script>
    </head>

    <body onload="render()">
        <div id="swagger-ui"></div>
    </body>
</html>`;
}
