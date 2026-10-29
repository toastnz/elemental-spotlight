const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const SRC = path.resolve(__dirname, 'client/src');
const DIST = path.resolve(__dirname, 'client/dist');

/*
 * Built the same way as the rest of this project rather than through
 * @silverstripe/webpack-config - see the note at the top of the flavours
 * module's config for why.
 */

/*
 * silverstripe/admin puts React and its own libraries on the page as globals,
 * and a module bundle reaches for those rather than carrying its own. Only the
 * two the CMS half imports are here; the preview half imports nothing at all,
 * because it runs on the site rather than in the CMS.
 */
const externals = {
    react: 'React',
    'lib/Injector': 'Injector',
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            cms: `${SRC}/js/cms.js`,
            preview: `${SRC}/js/preview.js`,
        },
        output: {
            path: DIST,
            filename: 'js/[name].js',
            clean: true,
        },
        devtool: isProduction ? false : 'source-map',
        externals,
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                // Stated here so babel cannot pick up a config
                                // belonging to whatever project this module is
                                // installed into.
                                babelrc: false,
                                configFile: false,
                                presets: [
                                    '@babel/preset-env',
                                    // Classic, not babel 8's automatic default,
                                    // which compiles JSX to imports from
                                    // react/jsx-runtime - not a global admin
                                    // exposes, so webpack would bundle a second
                                    // React to satisfy it.
                                    ['@babel/preset-react', { runtime: 'classic' }],
                                ],
                                cacheDirectory: !isProduction,
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimizer: [new TerserPlugin({ extractComments: false })],
        },
    };
};
