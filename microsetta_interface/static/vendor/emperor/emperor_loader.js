
function loadEmperor(pcoa_url, emperor_root){
    // When running in the Jupyter notebook we've encountered version conflicts
    // with some dependencies. So instead of polluting the global require context,
    // we define a new context.
    var emperorRequire = require.config({
    'context': 'emperor',
    // the left side is the module name, and the right side is the path
    // relative to the baseUrl attribute, do NOT include the .js extension
    'paths': {
    /* jQuery */
    'jquery': emperor_root + '/vendor/js/jquery-2.1.4.min',
    'jqueryui': emperor_root + '/vendor/js/jquery-ui.min',
    'jquery_drag': emperor_root + '/vendor/js/jquery.event.drag-2.2.min',

    /* jQuery plugins */
    'chosen': emperor_root + '/vendor/js/chosen.jquery.min',
    'spectrum': emperor_root + '/vendor/js/spectrum.min',
    'position': emperor_root + '/vendor/js/jquery.ui.position.min',
    'contextmenu': emperor_root + '/vendor/js/jquery.contextMenu.min',

    /* other libraries */
    'underscore': emperor_root + '/vendor/js/underscore-min',
    'chroma': emperor_root + '/vendor/js/chroma.min',
    'filesaver': emperor_root + '/vendor/js/FileSaver.min',
    'blob': emperor_root + '/vendor/js/Blob',
    'canvastoblob': emperor_root + '/vendor/js/canvas-toBlob',
    'd3': emperor_root + '/vendor/js/d3.min',

    /* THREE.js and plugins */
    'three': emperor_root + '/vendor/js/three.min',
    'orbitcontrols': emperor_root + '/vendor/js/three.js-plugins/OrbitControls',
    'projector': emperor_root + '/vendor/js/three.js-plugins/Projector',
    'svgrenderer': emperor_root + '/vendor/js/three.js-plugins/SVGRenderer',
    'canvasrenderer': emperor_root + '/vendor/js/three.js-plugins/CanvasRenderer',

    /* SlickGrid */
    'slickcore': emperor_root + '/vendor/js/slick.core.min',
    'slickgrid': emperor_root + '/vendor/js/slick.grid.min',
    'slickformatters': emperor_root + '/vendor/js/slick.editors.min',
    'slickeditors': emperor_root + '/vendor/js/slick.formatters.min',
    'slickdataview': emperor_root + '/vendor/js/slick.dataview.min',

    /* Emperor's objects */
    'util': emperor_root + '/js/util',
    'model': emperor_root + '/js/model',
    'multi-model': emperor_root + '/js/multi-model',
    'view': emperor_root + '/js/view',
    'controller': emperor_root + '/js/controller',
    'draw': emperor_root + '/js/draw',
    'scene3d': emperor_root + '/js/sceneplotview3d',
    'shapes': emperor_root + '/js/shapes',
    'animationdirector': emperor_root + '/js/animate',
    'trajectory': emperor_root + '/js/trajectory',
    'uistate': emperor_root + '/js/ui-state',

    /* controllers */
    'abcviewcontroller': emperor_root + '/js/abc-view-controller',
    'viewcontroller': emperor_root + '/js/view-controller',
    'colorviewcontroller': emperor_root + '/js/color-view-controller',
    'visibilitycontroller': emperor_root + '/js/visibility-controller',
    'opacityviewcontroller': emperor_root + '/js/opacity-view-controller',
    'scaleviewcontroller': emperor_root + '/js/scale-view-controller',
    'shapecontroller': emperor_root + '/js/shape-controller',
    'axescontroller': emperor_root + '/js/axes-controller',
    'animationscontroller': emperor_root + '/js/animations-controller',
    'viewtype-controller': emperor_root + '/js/viewtype-controller',

    /* editors */
    'shape-editor': emperor_root + '/js/shape-editor',
    'color-editor': emperor_root + '/js/color-editor',
    'scale-editor': emperor_root + '/js/scale-editor'

    },
    /*
     Libraries that are not AMD compatible need shim to declare their
     dependencies.
    */
    'shim': {
    'jquery_drag': {
      'deps': ['jquery', 'jqueryui']
    },
    'chosen': {
      'deps': ['jquery'],
      'exports': 'jQuery.fn.chosen'
    },
    'contextmenu' : {
      'deps': ['jquery', 'jqueryui', 'position']
    },
    'filesaver' : {
      'deps': ['blob']
    },
    'canvastoblob' : {
      'deps': ['blob']
    },
    'slickcore': ['jqueryui'],
    'slickgrid': ['slickcore', 'jquery_drag', 'slickformatters', 'slickeditors',
                  'slickdataview']
    }
    });

    emperorRequire(
    ["jquery", "model", "controller"],
    function($, model, EmperorController) {
        var DecompositionModel = model.DecompositionModel;

        var div = $('#emperor-notebook-0x559558fb');

        $.get(
          pcoa_url,
          function (data) {
            data = {"plot": data}
            data["plot"]["settings"]={}
            console.log(data)
          var plot, biplot = null, ec;

          function init() {
            // Initialize the DecompositionModel for the scatter plot, and optionally
            // add one for the biplot arrows
            plot = new DecompositionModel(data.plot.decomposition,
                                          data.plot.metadata_headers,
                                          data.plot.metadata,
                                          data.plot.type);

            if (data.biplot) {
              biplot = new DecompositionModel(data.biplot.decomposition,
                                              data.biplot.metadata_headers,
                                              data.biplot.metadata,
                                              data.biplot.type);
            }

            ec = new EmperorController(plot, biplot, "emperor-notebook-0x559558fb");
          }

          function animate() {
            requestAnimationFrame(animate);
            ec.render();
          }
          $(window).resize(function() {
            ec.resize(div.innerWidth(), div.innerHeight());
          });

          $(function(){
            init();
            animate();

            ec.ready = function () {
              // any other code that needs to be executed when emperor is loaded should
              // go here
              ec.loadConfig(data.plot.settings);
            }
          });
        });
    }); // END REQUIRE.JS block
}