/*globals module */

module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				strict: true,
				white: true
			},
			all: [
				'<%= pkg.src.js %>/*.js'
			]
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd/mm/yyyy") %> */\n',
				mangle: {
					except: ['jQuery']
				}
			},
			main_page: {
				src: [
					'<%= pkg.src.js %>/lib/*.js',
					'<%= pkg.src.js %>/main.js'
				],
				dest: '<%= pkg.dest.js %>/main.min.js'
			},
			interface_page: {
				src: [
					'<%= pkg.src.js %>/lib/*.js',
					'<%= pkg.src.js %>/interface.js'
				],
				dest: '<%= pkg.dest.js %>/interface.min.js'
			},
			server: {
				src: '<%= pkg.src.server %>/app.js',
				dest: '<%= pkg.dest.server %>/app.js'
			}
		},
		sass: {
			build: {
				files: {
					'<%= pkg.dest.css %>/<%= pkg.name %>.min.css': [
						'<%= pkg.src.css %>/*.css',
						'<%= pkg.src.css %>/*.scss'
					]
				}
			}
		},
		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'<%= pkg.dest.html %>/index.html': '<%= pkg.src.html %>/index.html',
					'<%= pkg.dest.html %>/client.html': '<%= pkg.src.html %>/client.html'
				}
			}
		},
		smushit: {
			compress: {
				src: [
					'<%= pkg.src.img %>/*.png',
					'<%= pkg.src.img %>/*.jpg'
				],
				dest: '<%= pkg.dest.assets %>/img'
			}
		},
		jsduck: {
			main: {
				src: [ '<%= pkg.src.js %>' ],
				dest: '<%= pkg.dest.docs %>'
			}
		},
		watch: {
			scripts: {
				files: [
					'<%= pkg.src.js %>/**/*.js',
					'<%= pkg.src.server %>/*.js'
				],
				tasks: ['jshint', 'uglify']
			},
			styles: {
				files: [
					'<%= pkg.src.css %>/*.css',
					'<%= pkg.src.css %>/*.scss'
				],
				tasks: ['sass']
			},
			html: {
				files: '<%= pkg.src.html %>/*.html',
				tasks: ['htmlmin']
			},
			images: {
				files: '<%= pkg.src.img =>/*',
				tasks: ['smushit']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-smushit');
	grunt.loadNpmTasks('grunt-jsduck');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('all', ['jshint', 'uglify', 'jsduck', 'sass', 'htmlmin', 'smushit']);

};
