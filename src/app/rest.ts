import { ConfigInterface } from './../core/config/config.interface.js';
import { LoggerInterface } from './../core/logger/logger.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../types/app-component.enum.js';


@injectable()
export default class RestApplication {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
  ) {}

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
