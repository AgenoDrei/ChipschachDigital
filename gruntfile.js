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

		clean: {
			all: ['.tscache/', 'frontend/build'],
			assets: ['.tscache/', 'frontend/build/**/*', '!frontend/build/app/**'],	// all except .js & .map in app (assets will be overwritten)
			compiled: ['.tscache/', 'frontend/build/**/*.js', 'frontend/build/**/*.map', '!frontend/build/*.js'],		//deletes all JS-files + maps (compiled from TS ...) except the ones on top-level
			second_build_dir: ['frontend/build/build']
		},

		copy: {
			main: {
				files: [
					{ expand: true,  cwd: './frontend', src: ['**', '!**/*.ts'], dest: './frontend/build'}
				]
			}
		},

		ts: {
			build: {
				src: ["frotend/app/**/*.ts"],
				dest: 'frontend/build/app',
              	tsconfig: 'tsconfig.json'
			}
		},

		//watch Frontend Files for change
		watch: {
			main: {
				files: ['frontend/**', '!frontend/build/**'],
				tasks: ['build'],
				options: {
      				debounceDelay: 4200,
      				spawn: false
    			}
			},
			ts: {
				files: ['frontend/app/**/*.ts', '!frontend/build/**'],
				tasks: ['build_ts'],
				options: {
      				debounceDelay: 4200,
      				spawn: false
    			}
			},
			assets: {
				files: ['frontend/**', '!frontend/app/**/*.ts', '!frontend/build/**'],
				tasks: ['build_copy'],
				options: {
      				debounceDelay: 4200,
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
        		tasks: ['nodemon', 'watch:assets', 'watch:ts'],
        		options: {
            		logConcurrentOutput: true
        		}
    		}
		}
	});

	//Define Tasks
	grunt.registerTask('build_copy', ['clean:assets', 'copy', 'clean:second_build_dir']);
	grunt.registerTask('build_ts', ['clean:compiled', 'ts:build']);
	grunt.registerTask('build', ['clean:all', 'copy', 'ts:build']);
	grunt.registerTask('serve', ["concurrent:watchers"]);
	grunt.registerTask('default', ['build', 'serve']);

};