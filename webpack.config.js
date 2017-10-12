const { resolve, join  } = require("path");

const webpack = require("webpack");
const nsWebpack = require("nativescript-dev-webpack");
const target = require("nativescript-dev-webpack/nativescript-target");
const PlatformSuffixPlugin = require("nativescript-dev-webpack/PlatformSuffixPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { AotPlugin } = require("@ngtools/webpack");

function getPlatform(env) {
    if (env.android) return "android";
    if (env.ios) return "ios";
    throw new Error("You need to provide a target platform!");
}

module.exports = env => {
    const platform = getPlatform(env);
    const plugins = getPlugins(platform, env);
    const config = {
        context: resolve("./app"),
        target,
        entry: {
            bundle: `./${nsWebpack.getEntryModule()}`, // Discover entry module from package.json
            vendor: `./vendor` // Vendor entry with third-party libraries
        },
        output: {
            pathinfo: true,
            path: resolve(nsWebpack.getAppPath(platform)),
            libraryTarget: "commonjs2",
            filename: "[name].js",
        },
        resolve: {
            extensions: [ ".aot.ts", ".ts", ".js", ".css" ],
            plugins: [new PlatformSuffixPlugin(platform)],

            // Resolve {N} system modules from tns-core-modules
            modules: [
                "node_modules/tns-core-modules",
                "node_modules",
            ],

            alias: {
                '~': resolve("./app")
            },

            symlinks: false
        },
        resolveLoader: {
            symlinks: false
        },
        node: {
            // Disable node shims that conflict with NativeScript
            "http": false,
            "timers": false,
            "setImmediate": false,
            "fs": "empty",
        },
        module: {
            rules: [
                { test: /\.(html|xml|css)$/, use: "raw-loader" },
                { test: /\.(scss)$/, use: [ "raw-loader", "sass-loader" ] },
                { test: /\.(ts)$/, use: [ "nativescript-dev-webpack/tns-aot-loader", "@ngtools/webpack", ] }
            ]
        },
        plugins,
    };

    if (env.snapshot) {
        plugins.push(new nsWebpack.NativeScriptSnapshotPlugin({
            chunk: "vendor",
            projectRoot: __dirname,
            webpackConfig: config,
            targetArchs: ["arm", "arm64", "ia32"],
            tnsJavaClassesOptions: { packages: ["tns-core-modules" ] },
            useLibs: false
        }));
    }

    return config;
};

function getPlugins(platform, env) {
    let plugins = [
        // Vendor libs go to the vendor.js chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor"],
        }),

        // Define useful constants like TNS_WEBPACK
        new webpack.DefinePlugin({
            "global.TNS_WEBPACK": "true",
        }),

        // Copy assets to out dir. Add your own globs as needed.
        new CopyWebpackPlugin([
            { from: "fonts/**" },
            { from: "**/*.jpg" },
            { from: "**/*.png" },
            { from: "**/*.xml" },
        ], { ignore: ["App_Resources/**"] }),

        // Generate a bundle starter script and activate it in package.json
        new nsWebpack.GenerateBundleStarterPlugin([
            "./vendor",
            "./bundle",
        ]),

        // Generate report files for bundles content
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            generateStatsFile: true,
            reportFilename: join(__dirname, "report", `${platform}-report.html`),
            statsFilename: join(__dirname, "report", `${platform}-stats.json`),
        }),

        // Angular AOT compiler
        new AotPlugin({
            tsConfigPath: "tsconfig.aot.json",
            entryModule: resolve(__dirname, "app/app.module#AppModule"),
            typeChecking: false
        }),

        // Resolve .ios.css and .android.css component stylesheets, and .ios.html and .android component views
        new nsWebpack.UrlResolvePlugin({
            platform: platform,
            resolveStylesUrls: true,
            resolveTemplateUrl: true
        })
    ];

    if (env.uglify) {
        plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));

        // Work around an Android issue by setting compress = false
        const compress = platform !== "android";
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: { except: nsWebpack.uglifyMangleExcludes },
            compress,
        }));
    }

    return plugins;
}
