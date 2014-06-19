module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Sources and Dest directories
    dirs : {
      js : {
        src : 'src/public/js',
        dist : 'dist/public/js',
      },
      css : {
        src : 'src/public/less',
        dist : 'dist/public/css',
      },
      html : {
        src : 'src/public/views',
        dist : 'dist/public/views',
      },
      font : {
        src : 'src/public/fonts',
        dist : 'dist/public/fonts',
      },
      server : {
        src : 'src/',
        dist : 'dist/',
      }
    },
    // Clean dist
    clean : ['dist/'],
    // Copy src files (only html)
    copy : {
      dist : {
        files : [{
          expand : true, flatten : true,
          src : '<%= dirs.html.src %>/*.{html,ico}',
          dest : '<%= dirs.html.dist %>/',
        },{
          expand : true, flatten : true,
          src : '<%= dirs.js.src %>/lib/*.js',
          dest : '<%= dirs.js.dist %>/lib/',
        },{
          expand : true, flatten : true,
          src : '<%= dirs.font.src %>/*',
          dest : '<%= dirs.font.dist %>/',
        },{
          expand : true, flatten : true,
          src : '<%= dirs.css.src %>/*.{png,jpg,jpeg,ico}',
          dest : '<%= dirs.css.dist %>/',
        },{
          expand : true, flatten : true,
          src : '<%= dirs.server.src %>/*.{js,json}',
          dest : '<%= dirs.server.dist %>/',
        },]
      }
    },
    // JS Concat in a single file
    concat : {
      options : {
        stripBanners : true,
        banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + 
        '<%= grunt.template.today("yyyy-mm-dd") %> */' +
        '<%= pkg.license %>',
      },
      dist : {
        src : '<%= dirs.js.src %>/*.js',
        dest : '<%= dirs.js.dist %>/<%= pkg.name %>.js'
      }
    },
    // Uglify the previous concatened file
    uglify : {
     options : {
      mangle : false,
      preserveComments : 'some',
    },
    dist : {
      src : '<%= dirs.js.dist %>/<%= pkg.name %>.js',
      dest : '<%= dirs.js.dist %>/<%= pkg.name %>.min.js'
    }
  },
    // Less => CSS generation
    less : {
      options : {
        compress : true,
      },
      dist: {
        src : '<%= dirs.css.src %>/stylezZ.less',
        dest : '<%= dirs.css.dist %>/stylezZ.css',
      }
    },
    // Replace old path to news in index.html
    "string-replace": {
      dist: {
        files: {
          '<%= dirs.html.dist %>/index.html': '<%= dirs.html.dist %>/index.html'
        },
        options: {
          replacements: [
          { // Less JS
            pattern: /(<script src="js\/lib\/[a-z0-9-]*)(.js".*\n?<\/script>\n?)/gm,
            replacement: '$1.min$2'
          },
          { // Less CSS Stylesheet
            pattern: '<link rel="stylesheet/less" type="text/css" href="less/stylezZ.less" />',
            replacement: '<link rel="stylesheet" type="text/css" href="css/stylezZ.css" />'
          },
          { // Less JS
            pattern: /<script src=".*less.*js".*\n?<\/script>\n?/gm,
            replacement: ''
          },
          { // Every JS who's not a library
            pattern: /<script src="js\/[a-z]*.js".*\n?<\/script>\n?/gm,
            replacement: ''
          },
          { // Add concatenate JS script link
            pattern: /(<!-- include-js -->)/gm,
            replacement: '<script src="js/<%= pkg.name %>.min.js"></script>\n'
          },
          { // Comments
            pattern: /<!--[\s\S\n]*?-->\n?/gm,
            replacement: ''
          }]
        }
      }
    },
    // Watch changes and execute associated tasks
    watch : {
      css : {
        files : '<%= dirs.css.src %>/stylezZ.less',
        tasks : ['less'],
      },
      scripts : {
        files : '<%= dirs.js.src %>/*.js',
        tasks : ['copy', 'concat', 'uglify'],
      },
    },
  });

  // Load plugins for tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default tasks.
  grunt.registerTask('default', ['copy', 'concat', 'uglify', 'less', 'string-replace']);

  // Test

  // Minify
  grunt.registerTask('minify', ['concat', 'uglify']);

  // All
  grunt.registerTask('all', ['clean', 'default']);

};