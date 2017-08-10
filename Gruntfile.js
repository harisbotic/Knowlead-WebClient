/*global module:false*/
module.exports = function(grunt) {

  let pug_plugin_ng = require('pug-plugin-ng');

  // Project configuration.
  grunt.initConfig({
    watch: {
      pugs: {
        files: 'src/**/*.pug',
        tasks: ['pug', 'clean']
      },
      options: {
        atBegin: true
      }
    },
    pug: {
      compile: {
        files: [{
          src: 'src/**/*.pug',
          dest: '',
          expand: true,
          ext: '.component.html'
        }],
        options: {
          doctype: 'html',
          pretty: true,
          plugins: [pug_plugin_ng]
        }
      }
    },
    clean: {
      partials: ['src/**/_*.html']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', ['watch']);

};
