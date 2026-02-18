import baseConfig from '@seeun-log/eslint-config/base';
import reactConfig from '@seeun-log/eslint-config/react';
import nextjsConfig from '@seeun-log/eslint-config/nextjs';

export default [...baseConfig, ...reactConfig, ...nextjsConfig, { ignores: ['next-env.d.ts'] }];
