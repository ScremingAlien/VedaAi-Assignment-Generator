import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Creating new module...');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

if (!args[0]) {
  console.error('❌ Please provide module name');
  process.exit(1);
}

const moduleName = args[0].toLowerCase();
const ModuleName = capitalize(moduleName);

const basePath = path.join(__dirname, '../src/services', moduleName);

// Prevent overwrite
if (fs.existsSync(basePath)) {
  console.error(`❌ Module "${moduleName}" already exists`);
  process.exit(1);
}

// Create folders
const folders = [
  'controller',
  'service',
  'repository',
  'routes',
  'dto',
  'events',
];

folders.forEach((folder) => {
  fs.mkdirSync(path.join(basePath, folder), { recursive: true });
});

// ================= FILE CONTENTS ================= //

const files = {
  // Controller
  controller: {
    [`${moduleName}.controller.ts`]: `

import { Request, Response } from "express";
import { ${ModuleName}Service } from "../service/${moduleName}.service.js";
import { asyncHandler } from "../../../middlewares/system/asyncHandler.js";

interface ${ModuleName}ControllerDeps {
  ${moduleName}Service: ${ModuleName}Service;
}

export class ${ModuleName}Controller {
  private service: ${ModuleName}Service;

  constructor({ ${moduleName}Service }: ${ModuleName}ControllerDeps) {
    this.service = ${moduleName}Service;
  }

  demoHandler = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.demoService();
    res.success({ data, message: "${ModuleName} Module is Running!" });
  })

 
}
`,
  },

  // Service
  service: {
    [`${moduleName}.service.ts`]: `
import { ${ModuleName}Repository } from "../repository/${moduleName}.repository.js";
 
interface ${ModuleName}ServiceDeps {
  ${moduleName}Repository: ${ModuleName}Repository; 
}

export class ${ModuleName}Service {
  private repo: ${ModuleName}Repository; 

  constructor({ ${moduleName}Repository }: ${ModuleName}ServiceDeps) {
    this.repo = ${moduleName}Repository;
  }
    
  async demoService() {
  
  }

}
 
 
`,
  },

  // Repository
  repository: {
    [`${moduleName}.repository.ts`]: `
export class ${ModuleName}Repository {
  /* 
        constructor(db) {
                 this.db = db;
          }
  */

    
  async findAll(): Promise<string[]> {
          return [];
  }

  
}
`,
  },

  // Routes
  routes: {
    [`${moduleName}.routes.ts`]: `
import { Router } from "express";
import { ${ModuleName}Controller } from "../controller/${moduleName}.controller.js";

interface RouteDeps {
  ${moduleName}Controller: ${ModuleName}Controller;
}

export default function create${ModuleName}Routes({ ${moduleName}Controller }: RouteDeps) {
  const router = Router();

  router.get("/", ${moduleName}Controller.demoHandler);

  return router;
}
`,
  },

  // DTO
  dto: {
    [`create-${moduleName}.dto.ts`]: `
    import { z } from "zod";

export const Create${ModuleName}DTO = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional().default(false),
});

export type Create${ModuleName}DTOType = z.infer<typeof Create${ModuleName}DTO>;

`,
    [`index.ts`]: `
export * from "./create-${moduleName}.dto.js";
`,
  },

  // Events
  events: {
    [`${moduleName}.events.ts`]: `
export const ${ModuleName.toUpperCase()}_EVENTS = {
  CREATED: "${moduleName}.created",
  UPDATED: "${moduleName}.updated",
} as const;
`,
    [`${moduleName}.listener.ts`]: `
 // setup events here
`,
  },

  // Container
  '': {
    [`${moduleName}.container.ts`]: `
import { ${ModuleName}Repository } from "./repository/${moduleName}.repository.js";
import { ${ModuleName}Service } from "./service/${moduleName}.service.js";
import { ${ModuleName}Controller } from "./controller/${moduleName}.controller.js";
import create${ModuleName}Routes from "./routes/${moduleName}.routes.js";
 
export class ${ModuleName}Container {
  static init() {

    const repositories = {
      ${moduleName}Repository: new ${ModuleName}Repository(),
    };

    const services = {
      ${moduleName}Service: new ${ModuleName}Service({
        ${moduleName}Repository: repositories.${moduleName}Repository 
      }),
    };

    const controllers = {
      ${moduleName}Controller: new ${ModuleName}Controller({
        ${moduleName}Service: services.${moduleName}Service,
      }),
    };

    const routes = {
      ${moduleName}Routes: create${ModuleName}Routes({
        ${moduleName}Controller: controllers.${moduleName}Controller,
      }),
    };

   
    return {
      repositories,
      services,
      controllers,
      routes,
    };
  }
}
 
`,
    [`index.ts`]: `
export { ${ModuleName}Container as default } from "./${moduleName}.container.js";
`,
  },
};

// ================= WRITE FILES ================= //

for (const [folder, fileGroup] of Object.entries(files)) {
  for (const [fileName, content] of Object.entries(fileGroup)) {
    const filePath = path.join(basePath, folder, fileName);
    fs.writeFileSync(filePath, content.trim());
  }
}

console.log(`✅ Module "${moduleName}" created successfully!`);

// ================= HELPER ================= //

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
