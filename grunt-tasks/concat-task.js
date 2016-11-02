module.exports = function(grunt){

    grunt.config('concat',{

        options : {
            sourceMap :true

          },

        js: {
            src: ['public/js/vendor/**/*.js', 'public/js/elements/*.js' ,'public/js/*.js'],
            dest: 'public/dist/all.js',
        }


    });

};
