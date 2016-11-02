  module.exports = function(grunt){

    grunt.config('sass',{

      dev:{
        options: {
          style: 'nested',
          sourcemap: 'auto',

          loadPath:'public/css'
        },
        files: {
          'public/dist/style.css' :  'public/dist/style.scss'
        }
      },

      build:{
        options: {
          style: 'compressed',
          sourcemap: 'auto',

          loadPath:'public/css'
        },
        files: {
          'public/dist/style.css' :  'public/dist/style.scss'
        }
      }

    });

  };
