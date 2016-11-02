module.exports = function(grunt) {

    grunt.initConfig({
        pkg: require('./package.json')
    });

    grunt.loadTasks('grunt-tasks');
    require('load-grunt-tasks')(grunt);



    grunt.registerTask('dev', ['watch']);

    grunt.registerTask('build', ['injector:sass','sass:build', 'autoprefixer', 'css-include-combine', 'concat:js', 'uglify']);


};


