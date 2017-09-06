(function () {
  'use strict';
  angular
    .module('projecthub.layout.directives')
    .directive('particlesDrv', ['$window', '$log', particlesDrv]);

  // var app = angular.module('particlesApp', []);
  // app.controller('particlesCtrl', ['$scope', particlesCtrl]);
  // app.directive('particles', ['$window', '$log', particlesDrv]);

  // function particlesCtrl($scope) {
  //   $scope.showParticles = true;
  // }

  function particlesDrv($window, $log) {
    return {
      restrict: 'A',
      template: '<div class="backdrop" id="particleJs"></div>',
      link: function(scope, element, attrs, fn) {
        $log.debug('test');
        $window.particlesJS('particleJs', {
          particles: {
            number: {
              value: 55,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: '#0277bd'
            },
            shape: {
              type: "circle",
              polygon: {
                nb_sides: 5
              }
            },
            opacity: {
              value: 0.1,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 1,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 275,
              color: '#0277bd',
              opacity: 0.25,
              width: 1
            },
            move: {
              enable: true,
              speed: 1.4,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: false,
                mode: 'grab'
              },
              onclick: {
                enable: false,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 300,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
              },
              repulse: {
                distance: 200,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        });
      }
    };
  }
})();