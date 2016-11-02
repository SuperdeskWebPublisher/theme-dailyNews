module.exports = function(grunt){

    grunt.config('uglify',{

        options : {
           sourceMap : true,
           sourceMapIncludeSources : true,
           sourceMapIn : 'public/dist/all.js.map'
         },
         build : {
           src  : 'public/dist/all.js',
           dest : 'public/dist/all.js'
         }


    });

};
