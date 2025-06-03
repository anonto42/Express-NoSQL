import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface TemplateMap {
  [key: string]: (name: string) => string;
}

const templates: TemplateMap = {
  controller: (name: string) => `import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ${capitalize(name)}Service } from './${name}.service';

const defaultController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { ...verifyData } = req.body;
  const result = await ${capitalize(name)}Service.defaultFunction(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result.data,
  });
});

export const ${capitalize(name)}Controller = { defaultController };
`,

  interface: (name: string) => `import { Model, Types } from 'mongoose';

export type I${capitalize(name)} = {

};

export type ResetTokenModel = {
  isArray(token: string): any;
} & Model<I${capitalize(name)}>;
`,

  service: (name: string) => `import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

const defaultFunction = async (payload: any) => {
  const { email, password } = payload;
  if (false) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return { };
};

export const ${capitalize(name)}Service = {
  defaultFunction,
};
`,

  validation: (name: string) => `import { z } from 'zod';

const defaultZodSchema = z.object({
  body: z.object({
    somthing: z.string({ required_error: '' })
  }),
});


export const ${capitalize(name)}Validation = {
  defaultZodSchema,
};
`,

  route: (name: string) => `import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ${capitalize(name)}Controller } from './${name}.controller';
import { ${capitalize(name)}Validation } from './${name}.validation';

const router = express.Router();

router.post(
  '/${capitalize(name)}',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(${capitalize(name)}Validation.defaultZodSchema),
  ${capitalize(name)}Controller.defaultFunction
);

export const ${capitalize(name)}Routes = router;
`,
};

async function main() {
  const moduleName = process.argv[2];
  if (!moduleName) {
    console.error('Usage: npm run create-module <module-name>');
    process.exit(1);
  }

  const modulePath = path.join(process.cwd(), 'src', 'app', 'modules', moduleName);
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
    console.log(`Created module folder: ${modulePath}`);
  } else {
    console.log(`Module folder already exists: ${modulePath}`);
  }

  const filesToAsk: { key: keyof TemplateMap; filename: string }[] = [
    { key: 'controller', filename: `${moduleName}.controller.ts` },
    { key: 'service', filename: `${moduleName}.service.ts` },
    { key: 'route', filename: `${moduleName}.route.ts` },
    { key: 'model', filename: `${moduleName}.model.ts` },
    { key: 'interface', filename: `${moduleName}.interface.ts` },
    { key: 'validation', filename: `${moduleName}.validation.ts` },
  ];

  for (const file of filesToAsk) {
    const answer = await askQuestion(
      `Do you want to create ${file.filename}? (y/n) `,
    );
    if (answer === 'y' || answer === 'yes') {
      const filePath = path.join(modulePath, file.filename);
      if (fs.existsSync(filePath)) {
        console.log(`${file.filename} already exists. Skipping...`);
        continue;
      }
      const content = templates[file.key]
        ? templates[file.key](moduleName)
        : '';
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Created ${file.filename}`);
    } else if (answer === 'n' || answer === 'no') {
      console.log(`Skipped ${file.filename}`);
    } else {
        console.log(`Invalid answer: ${answer}`);
        process.exit(1);
    }
  }
 

  rl.close();
}

main();
