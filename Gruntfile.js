module.exports = function (grunt) {

  "use strict";

  grunt.initConfig({
    dirs: {
      css: 'app/css',
      js: 'app/js',
      sass: 'app/sass',
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb',
        }
      }
    },
    concat: {
      options: {
        seperator: ';',
      },
      dist: {
        src: ['<%= dirs.js %>/modules/*.js', '<%= dirs.js %>/src/*.js'],
        dest: '<%= dirs.js %>/app.js'
      }
    },
    uglify: {
      options: {
        // mangle: false,
        debug: true,
      },
      target: {
        files: {
          '<%= dirs.js %>/app.min.js': ['<%= dirs.js %>/app.js']
        }
      }
    },
    watch: {
      css: {
        files: [
          '<%= dirs.sass %>/*.scss',
          '<%= dirs.sass %>/modules/*.scss',
          '<%= dirs.sass %>/partials/*.scss'
        ],
        tasks: ['css'],
        options: {
          spawn: false,
        }
      },
      js: {
        files: [
          '<%= dirs.js %>/modules/*.js',
          '<%= dirs.js %>/src/*.js'
        ],
        tasks: ['js'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['css', 'js']);
  grunt.registerTask('css', ['compass']);
  grunt.registerTask('js', ['concat', 'uglify']);
};
