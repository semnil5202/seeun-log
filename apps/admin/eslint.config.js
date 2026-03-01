import baseConfig from '@eunmin-log/eslint-config/base';
import reactConfig from '@eunmin-log/eslint-config/react';
import nextjsConfig from '@eunmin-log/eslint-config/nextjs';

export default [...baseConfig, ...reactConfig, ...nextjsConfig, { ignores: ['next-env.d.ts'] }];
