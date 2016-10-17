module.exports = function(grunt) {
	//Load Grunt Plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks("grunt-concurrent");

	//Grunt Plugin Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ['frontend/build'],

		copy: {
			main: {
				files: [
					{ expand: true,  cwd: './frontend', src: ['**', '!**/*.ts'], dest: './frontend/build'}
				]
			}
		},

		ts: {
			build: {
				src: ["frotend/**/*.ts"],
				dest: 'frontend/build/app',
              	tsconfig: 'tsconfig.json',
			}
		},

		//watch Frontend Files for change
		watch: {
			main: {
				files: ['frontend/**', '!frontend/build/**'],
				tasks: ['build'],
				options: {
      				debounceDelay: 5000,
      				spawn: false
    			}
			}
		},
		//watch Server files for change
		nodemon: {
  			dev: {
    			script: 'bin/www',
    			ignore: ['node_modules/**', 'frontend/**']
  			}
		},
		//start watch for Server and Frontend in parallel
		concurrent: {
   			watchers: {
        		tasks: ['nodemon', 'watch'],
        		options: {
            		logConcurrentOutput: true
        		}
    		}
		}
	});

	//Define Tasks
	grunt.registerTask('build', ['clean', 'copy', 'ts:build']);
	grunt.registerTask("serve", ["concurrent:watchers"]);
	grunt.registerTask('default', ['build', 'serve']);

};