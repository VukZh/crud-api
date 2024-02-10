import * as path from 'path';
import {fileURLToPath} from 'url';

const wpc = (env = {}) => {
    const isProd = env.production;
    const isDev = env.development;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return {
        mode: isProd ? 'production' : isDev && 'development',
        resolve: {
            extensions: ['.ts', '.js'],
        },
        entry: path.resolve(__dirname, './src/index.ts'),
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: ['ts-loader'],
                },
            ]
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'bundle.js',
        },
    }
}

export default wpc;
