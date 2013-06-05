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
			client: {
				src: [
					'<%= pkg.src.js %>/*.js'
				],
				dest: '<%= pkg.dest.js %>/<%= pkg.name %>.min.js'
			},
			server: {
				src: '<%= pkg.src.server %>/app.js',
				dest: '<%= pkg.dest.server %>/app.js'
			}
		},
		sass: {
			build: {
				files: {
					'<% = pkg.dest.css %>/<%= pkg.name %>.min.css': [
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
					'<%= pkg.dest.html %>/index.html': '<%= pkg.src.html %>/index.hmtl'
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
				files: '<%= pkg.src.js %>/*.js',
				tasks: ['uglify', 'jshint', 'uglify', 'jsduck']
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

};
