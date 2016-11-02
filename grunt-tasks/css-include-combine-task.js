module.exports = function(grunt){

  grunt.config('css-include-combine',{

    all: {
      relativeDir: 'public/dist/',
      main: 'public/dist/style.css',
      out: 'public/dist/style.css'
    }
  });

};
