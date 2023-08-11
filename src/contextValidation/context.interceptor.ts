import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { ContextAwareDto } from './context.aware.dto';

export abstract class ContextInterceptor<Body, Query>
  implements NestInterceptor
{
  protected context: ContextAwareDto<Body, Query>;
  protected setContext(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.context = {
      body: request.body as Body,
      query: request.params as Query,
      user: request.user,
    } as ContextAwareDto<Body, Query>;
  }
  abstract intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>>;
}

export abstract class ContextTransactionInteceptor<
  Body,
  Query,
> extends ContextInterceptor<Body, Query> {
  @Inject()
  protected readonly dataSource: DataSource;
  constructor() {
    super();
  }
  protected setContext(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.context = {
      body: request.body as Body,
      query: request.query as Query,
      user: request.user,
    } as ContextAwareDto<Body, Query>;
  }
  abstract intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>>;
}
