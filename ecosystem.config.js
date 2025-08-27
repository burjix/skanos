module.exports = {
  apps: [
    {
      name: 'skanos-api',
      script: './apps/api/dist/main.js',
      cwd: '/home/claude/projects/skanos',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3011,
        DATABASE_URL: 'postgresql://skanos:skanos123@localhost:5432/skanos_db',
        JWT_SECRET: 'skanos-super-secret-jwt-key-production-2024',
        REDIS_HOST: 'localhost',
        REDIS_PORT: '6379',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
        CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
        HARDCODED_EMAIL: 'skander@skanos.dev',
        HARDCODED_PASSWORD_HASH: '$argon2id$v=19$m=65536,t=3,p=4$7/7d8f9g+h/i+j/k+l/m$xGsW1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P'
      },
      error_file: '/home/claude/projects/skanos/logs/api-error.log',
      out_file: '/home/claude/projects/skanos/logs/api-out.log',
      log_file: '/home/claude/projects/skanos/logs/api.log',
      time: true
    },
    {
      name: 'skanos-web',
      script: 'npm',
      args: 'start',
      cwd: '/home/claude/projects/skanos/apps/web',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
        NEXT_PUBLIC_API_URL: 'https://s.g8nie.com'
      },
      error_file: '/home/claude/projects/skanos/logs/web-error.log',
      out_file: '/home/claude/projects/skanos/logs/web-out.log',
      log_file: '/home/claude/projects/skanos/logs/web.log',
      time: true
    }
  ]
};