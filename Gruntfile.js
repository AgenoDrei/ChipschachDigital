module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-run-node');
  grunt.loadNpmTasks('grunt-processhtml');

  var globalConfig = {
  };

  grunt.initConfig({
    globalConfig: globalConfig,

    clean: [
      'build/',
    ],
    // Start + Stop node.js automatically for test execution
    run_node: {
      start: {
        options: {
          stdio: ['pipe', 'pipe', 'pipe']
        },

        files: {
          src: ['bin/www']
        }
      }
    },

    stop_node: {
      stop: {}
    },

    /*less: {
      build: {
        files: {
          'build/app/css/style.min.css': 'public/app/css/*.css'
        }
      },
      compile: {
        files: {
          'build/app/css/style.min.css': 'public/app/css/*.css'
        },
        options: {
          compress: true
        }
      }
    },*/


  //  concat: {
  //     js: { //target
  //       src: ['./build/public/app/src/**/*.js'],
  //       dest: './build/app/src/app.min.js'
  //     }
  //   },

  //   uglify: {
  //     js: { //target
  //       src: ['./build/app/src/app.min.js'],
  //       dest: './build/app/src/app.min.js'
  //     }
  //   },

  //   copy: {
  //     js: {
  //       files: [
  //         { expand: true, cwd: './public/app/img', src: '*', dest: './build/app/img' },
  //         { expand: true, cwd: './public/app/partials', src: '*', dest: './build/app/partials' },
  //         { expand: true, cwd: './public/bower_components', src: '**/*', dest: './build/bower_components' },
  //         { expand: true, src: ['./public/app/index.html'], dest: './build/app', flatten: true }
  //       ]
  //     }
  //   },

  //   processhtml: {
  //     dist: {
  //       files: {
  //         'build/app/index.html': ['public/app/index.html']
  //       }
  //     }
  //   }
  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', [
    'clean'
  ]);

  // grunt.registerTask('test', [
  //   'run_node:start', 'setDemoData', 'karma:continuous', 'protractor:all', 'stop_node:stop'
  // ]);

};
