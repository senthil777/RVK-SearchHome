import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleDestroy
{
  private readonly logger = new Logger('Prisma');

  constructor(private readonly configService: ConfigService) {
    const enableQueryLogs = configService.get<string>('DB_QUERY_LOGS') !== 'false';

    super({
      log: [
        ...(enableQueryLogs
          ? [{ emit: 'event', level: 'query' } as Prisma.LogDefinition]
          : []),
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    if (enableQueryLogs) {
      this.$on('query', (event) => {
        this.logger.debug(
          `QUERY ${event.duration}ms ${event.query} PARAMS ${event.params}`,
        );
      });
    }

    this.$on('info', (event) => {
      this.logger.log(event.message);
    });

    this.$on('warn', (event) => {
      this.logger.warn(event.message);
    });

    this.$on('error', (event) => {
      this.logger.error(event.message);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
