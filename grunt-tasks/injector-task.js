



module.exports = function(grunt){

  grunt.config('injector',{

   sass: {
    options: {
      transform: function(filePath) {
        filePath = filePath.replace('/public/css/','../css/');
        // filePath = filePath.replace('/client/components/', '');
        grunt.log.writeln(filePath);
        return '@import \'' + filePath + '\';';

      },
      starttag: '// injector',
      endtag: '// endinjector'
    },
    files: {
      'public/dist/style.scss': [
      'public/css/**/*.{css,scss,sass}'
      ]
    }
  }

});

};
