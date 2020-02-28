const path = require('path');
const sass = require('node-sass');

module.exports = grunt => {
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		name: 'slide-out-panel',
		// ---------------------------------------------------- CLEAN //
		clean: {
			dist: {
				src: ['dist/*'],
			},
			temp: {
				src: ['_temp'],
			},
		},
		// ---------------------------------------------------- COPY //
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: '_temp/',
						src: '**',
						dest: 'dist/js/',
					},
				],
			},
			scss: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: '**/*.scss',
						dest: 'dist/scss/',
					},
				],
			},
		},
		// ==================================================== JAVASCRIPT TASKS //
		// ---------------------------------------------------- BABEL //
		babel: {
			options: {
				comments: false,
				presets: ['@babel/preset-env'],
			},
			dev: {
				options: {
					sourceMap: true,
				},
				files: {
					'_temp/<%= name %>.js': 'src/<%= name %>.js',
				},
			},
			dist: {
				options: {
					sourceMap: false,
				},
				files: {
					'_temp/<%= name %>.js': 'src/<%= name %>.js',
				},
			},
		},
		// ---------------------------------------------------- ESLINT - DONE //
		eslint: {
			options: {
				configFile: '.eslintrc.js',
				maxWarnings: 10,
				fix: grunt.option('fix'),
			},
			target: ['src/**/*.js'],
		},
		// ---------------------------------------------------- UGLIFY //
		uglify: {
			options: {
				beautify: false,
				mangle: true,
				sourceMap: false,
			},
			dist: {
				files: {
					'dist/js/<%= name %>.min.js': ['_temp/<%= name %>.js'],
				},
			},
		},
		// ==================================================== STYLE TASKS //
		// ---------------------------------------------------- SASS //
		sass: {
			options: {
				implementation: sass,
				precision: 10,
			},
			dev: {
				options: {
					outputStyle: 'expanded',
					sourceMap: true,
				},
				files: { 'dist/css/<%= name %>.css': 'src/<%= name %>.scss' },
			},
			dist: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false,
				},
				files: { 'dist/css/<%= name %>.min.css': 'src/<%= name %>.scss' },
			},
		},
		// ---------------------------------------------------- SASS-LINT //
		sasslint: {
			options: {
				configFile: '.sass-lint.yml',
				formatter: 'stylish',
			},
			target: ['src/**/*.scss'],
		},
		// ---------------------------------------------------- POSTCSS //
		postcss: {
			options: {
				processors: [
					require('autoprefixer')({
						config: '.browserslistrc',
					}),
				],
			},
			dev: {
				map: {
					inline: false,
					sourcesContent: true,
					prev: 'dist/css/<%= name %>.css.map',
					annotation: 'dist/css/',
				},
				src: 'dist/css/<%= name %>.css',
			},
			dist: {
				src: 'dist/css/<%= name %>.min.css',
			},
		},
		// ---------------------------------------------------- WATCH //
		watch: {
			options: {
				spawn: false,
			},
			javascript: {
				files: ['src/**/*.js'],
				tasks: ['eslint', 'clean:temp', 'babel', 'copy', 'uglify', 'clean:temp'],
			},
			scss: {
				files: ['src/**/*.scss'],
				tasks: ['sass', 'postcss', 'sasslint'],
			},
		},
		paths: {
			cssDist: 'dist/css',
			jsDist: 'dist/js',
			sassDist: 'dist/scss',
		},
	});

	// ---------------------------------------------------- LOAD TASKS //
	grunt.loadNpmTasks('gruntify-eslint');

	// ---------------------------------------------------- MAIN TASKS //
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['clean', 'babel', 'copy', 'uglify', 'sass', 'postcss', 'clean:temp']);
};
