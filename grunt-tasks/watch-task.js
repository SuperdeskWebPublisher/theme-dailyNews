module.exports = function(grunt){

    grunt.config('watch',{
        css: {
            files: ['public/css/**/*.*'],
            tasks: ['injector:sass','sass:dev', 'autoprefixer'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        scripts: {
            files: ['public/js/**/*.js'],
            tasks: ['concat:js'],
            options: {
                spawn: false,
            }
        }

    });
};
