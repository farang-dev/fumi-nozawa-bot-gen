// next.config.mjs
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    basePath: isGitHubActions ? '/fumi-nozawa-bot-gen' : '',
    images: {
        unoptimized: true,
    },
    output: 'export',
    basePath: isGitHubActions ? '/fumi-nozawa-bot-gen' : '',
    images: {
        unoptimized: true,
    },
  };
=======
    },
  };
=======
  };
=======
  };
=======
    output: 'export',
    basePath: '/fumi-nozawa-bot-gen',
    images: {
        unoptimized: true,
    },
  };
=======
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    basePath: '/fumi-nozawa-bot-gen',
    images: {
        unoptimized: true,
    },
  };
  
  export default nextConfig; // Use 'export default' instead of 'module.exports'