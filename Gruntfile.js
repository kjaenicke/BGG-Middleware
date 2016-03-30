module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint:{
      all: ['Gruntfile.js', 'utils/*.js', 'routes/*.js', 'index.js', 'test/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 50000
        },
        src: [
        'test/**/*.test.js',
        '!test/**/user.*.test.js'
        ]
      }
    },
    complexity: {
        all: {
            src: ['Gruntfile.js', 'utils/*.js', 'routes/*.js', 'index.js', 'test/**/*.js'],
            options: {
                breakOnErrors: false,
                errorsOnly: false,
                cyclomatic: [3, 7, 12],
                maintainability: 80,
                hideComplexFunctions: true
            }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-connect');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'complexity', 'mochaTest']);
};
