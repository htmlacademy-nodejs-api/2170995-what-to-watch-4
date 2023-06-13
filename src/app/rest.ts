import { ConfigInterface } from './../core/config/config.interface.js';
import { LoggerInterface } from './../core/logger/logger.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../types/app-component.enum.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import { getURI } from '../core/helpers/index.js';
import express, { Express } from 'express';
import { ControllerInterface } from '../core/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';


@injectable()
export default class RestApplication {
  private expressApplication: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.FilmController) private readonly filmController: ControllerInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.CommentController) private readonly commentController: ControllerInterface,
  ) {
    this.expressApplication = express();
  }

  private async initRoutes() {
    this.expressApplication.use('/films', this.filmController.router);
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/comments', this.commentController.router);
  }

  private async initMiddleware() {
    this.expressApplication.use(express.json());
    this.expressApplication.use('/upload',express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  private async initExceptionFilters() {
    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApplication.listen(this.config.get('PORT'));
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
