module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/**/*.spec.ts'
        ],
        preprocessors: {
            'src/**/*.spec.ts': ['typescript']
        },
        reporters: ['progress'],
        browsers: ['Chrome'],
        singleRun: true
    });
};