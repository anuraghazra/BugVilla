import Express from 'express';

// This file for getting intelisense to work in external Controllers and middlewares
// https://stackoverflow.com/questions/51099835/how-to-get-intellisense-for-middleware-of-express-in-external-file-in-vscode
declare global {
  type RequestHandler = Express.RequestHandler;
}
