"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function ($, window) {
  var pluginName = 'SlideOutPanel';
  var defaults = {
    bodyPush: false,
    breakpoint: '768px',
    closeBtn: '&#10005;',
    closeBtnSize: '',
    enableEscapeKey: false,
    offsetTop: 0,
    screenClose: true,
    screenOpacity: '0.5',
    screenZindex: '9998',
    showScreen: true,
    slideFrom: 'right',
    transition: 'ease',
    transitionDuration: '0.35s',
    width: '350px',
    afterClosed: function afterClosed() {},
    afterOpen: function afterOpen() {},
    beforeClosed: function beforeClosed() {},
    beforeOpen: function beforeOpen() {},
    rendered: function rendered() {}
  };
  var globalSettings;
  var pluginLoaded = false;

  $.fn[pluginName] = function (options) {
    var _this = this;

    var componentElm;
    var headerElm;
    var contentElm;
    var footerElm;
    var screenSize;

    if (typeof $(this).attr('id') === 'undefined') {
      console.error("".concat(pluginName, ": Element not found. Element options:"), options);
      return false;
    }

    function SlideOutPanel(element, soOptions) {
      componentElm = $("#".concat(element.id));
      headerElm = $("#".concat(element.id, " header"));
      contentElm = $("#".concat(element.id, " section"));
      footerElm = $("#".concat(element.id, " footer"));

      if (!componentElm.hasClass('slide-out-panel')) {
        componentElm.addClass('slide-out-panel');
      }

      if (typeof $(contentElm).html() === 'undefined') {
        destroyPanel(element.id, "#".concat(element.id, " <section> missing."));
        return false;
      }

      globalSettings = globalSettings || {};
      globalSettings[element.id] = element;
      globalSettings[element.id] = $.extend({}, defaults, soOptions);
      var transitionDuration = globalSettings[element.id].transitionDuration;
      transitionDuration = transitionDuration.replace('s', '');
      globalSettings[element.id].transitionDuration = parseFloat(transitionDuration);
      orientationChange();
      this._defaults = defaults;
      this._name = pluginName;
      init(element.id, globalSettings[element.id]);
      return false;
    }

    var init = function init(elmId, settings) {
      component(elmId, settings);

      if (typeof $(headerElm).html() !== 'undefined') {
        header(elmId, settings);
      }

      content(elmId, settings);
      footer();

      if (settings.showScreen) {
        screen(elmId, settings);
      }

      settings.rendered();
      return false;
    };

    var component = function component(elmId, settings) {
      var openHorizontal = settings.slideFrom === 'left' || settings.slideFrom === 'right';
      componentElm.addClass("slide-out-panel-container ".concat(settings.slideFrom)).css({
        display: 'block',
        height: settings.offsetTop === 0 ? 'initial' : "calc(100vh - ".concat(settings.offsetTop, ")"),
        top: settings.slideFrom === 'bottom' ? 'initial' : settings.offsetTop,
        transitionTimingFunction: "".concat(settings.transition),
        transitionDuration: "".concat(settings.transitionDuration, "s"),
        width: settings.width
      }).attr('data-id', elmId);

      if (settings.bodyPush && openHorizontal) {
        $('html').css({
          transition: "width ".concat(settings.transitionDuration, "s ").concat(settings.transition)
        });
      }

      if (openHorizontal) {
        var measure = settings.width.match(/[a-zA-Z]+/);
        var num = settings.width.match(/(\d+)/);
        num = parseInt(num) + 10;
        componentElm.addClass("slide-out-panel-container ".concat(settings.slideFrom)).css({
          left: settings.slideFrom !== 'left' ? 'initial' : "-".concat(num).concat(measure),
          right: settings.slideFrom !== 'right' ? 'initial' : "-".concat(num).concat(measure)
        });
      } else {
        componentElm.addClass("slide-out-panel-container ".concat(settings.slideFrom)).css({
          bottom: settings.slideFrom !== 'bottom' ? 'initial' : '-100%',
          top: settings.slideFrom !== 'top' ? 'initial' : '-100%',
          width: '100vw'
        });
      }
    };

    var header = function header(elmId, settings) {
      if (typeof headerElm.html() !== 'undefined') {
        headerElm.addClass('slide-out-header').append(closeBtn(elmId, settings));
      }
    };

    var content = function content(elmId, settings) {
      contentElm.addClass('slide-out-content');

      if (typeof headerElm.html() === 'undefined') {
        contentElm.append(closeBtn(elmId, settings));
      }
    };

    var footer = function footer() {
      footerElm.addClass('slide-out-footer');
    };

    var closeBtn = function closeBtn(elmId, settings) {
      var btnHtml = '';
      btnHtml += "<span class=\"close-slide-out-panel\" data-id=\"".concat(elmId, "\" ").concat(settings.closeBtnSize ? "style=\"font-size: ".concat(settings.closeBtnSize, "; display: block;\"") : '', ">");
      btnHtml += settings.closeBtn;
      btnHtml += '</span>';
      return btnHtml;
    };

    var screen = function screen(elmId, settings) {
      var screenHtml = '';
      screenHtml += '<div ';
      screenHtml += "id=\"slide-out-panel-screen-".concat(elmId, "\"");
      screenHtml += 'class="slide-out-panel-screen" ';
      screenHtml += "data-id=\"".concat(elmId, "\" ");
      screenHtml += 'style="';
      screenHtml += "background-color: rgba(0, 0, 0, ".concat(settings.screenOpacity, ");");
      screenHtml += "transition-timing-function: ".concat(settings.transition, ";");
      screenHtml += "transition-duration: ".concat(settings.transitionDuration, "s;");
      screenHtml += "z-index: -".concat(settings.screenZindex, ";");
      screenHtml += '">';
      screenHtml += '</div>';
      $('body').append(screenHtml);

      if (settings.screenClose) {
        var touchScreen = document.getElementById("slide-out-panel-screen-".concat(elmId));
        touchScreen.addEventListener('touchend', function (e) {
          e.preventDefault();
          var closeBtnElemId = $(_this).attr('data-id');
          closePanel(closeBtnElemId, globalSettings[closeBtnElemId], _this);
          return false;
        }, false);
      }
    };

    var panelPositions = function panelPositions(elmId, settings, action) {
      var openHorizontal = settings.slideFrom === 'left' || settings.slideFrom === 'right';
      var positionVal;
      var css;

      if (action === 'open') {
        positionVal = '0';
      } else {
        var measure = settings.width.match(/[a-zA-Z]+/);
        var num = settings.width.match(/(\d+)/);
        num = parseInt(num) + 10;
        positionVal = openHorizontal ? "-".concat(num).concat(measure) : '-100%';
      }

      if (openHorizontal) {
        css = {
          left: settings.slideFrom === 'right' ? 'initial' : positionVal,
          right: settings.slideFrom === 'left' ? 'initial' : positionVal
        };
      } else {
        css = {
          top: settings.slideFrom === 'bottom' ? 'initial' : positionVal,
          bottom: settings.slideFrom === 'top' ? 'initial' : positionVal
        };
      }

      if (action === 'open') {
        $("#".concat(elmId)).addClass('open');
      } else {
        $("#".concat(elmId)).removeClass('open');
      }

      $("#".concat(elmId)).css(css);
      return false;
    };

    var closePanel = function closePanel() {
      var elmId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var elm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (typeof settings === 'undefined') {
        destroyPanel(elmId, "#".concat(elmId, " doesn't exist."));
        return false;
      } else if ($(elm).hasClass('slide-out-panel-screen') && !settings.screenClose) {
        return false;
      }

      if (!elmId && !settings && !elm) {
        Object.entries(globalSettings).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          if (globalSettings[key].enableEscapeKey) {
            closePanel(key, globalSettings[key]);
          }
        });
        return false;
      }

      settings.beforeClosed();
      panelPositions(elmId, settings, 'close');
      $("#slide-out-panel-screen-".concat(elmId)).removeClass('open').css({
        opacity: 0,
        transitionDuration: "".concat(settings.transitionDuration, "s")
      });

      if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
        $('html').css({
          width: '100%'
        });
      }

      setTimeout(function () {
        $("#slide-out-panel-screen-".concat(elmId)).css({
          zIndex: '-9999'
        });

        if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
          $('html').removeClass("slide-out-".concat(settings.slideFrom)).css('position', 'initial');
        }

        settings.afterClosed();
      }, settings.transitionDuration * 1000);
      return false;
    };

    var destroyPanel = function destroyPanel(elmId) {
      var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      $("#".concat(elmId, ", .slide-out-panel-screen[data-id=\"").concat(elmId, "\"]")).remove();

      if (msg) {
        console.error("".concat(pluginName, ": ").concat(msg));
      }

      return false;
    };

    var openPanel = function openPanel() {
      var elmId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var settings = arguments.length > 1 ? arguments[1] : undefined;

      if (typeof settings === 'undefined') {
        destroyPanel(elmId, "#".concat(elmId, " doesn't exist."));
        return false;
      }

      if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
        $('html').addClass("slide-out-".concat(settings.slideFrom));
      }

      settings.beforeOpen();
      panelPositions(elmId, settings, 'open');
      $("#slide-out-panel-screen-".concat(elmId)).addClass('open').css({
        opacity: 1,
        transitionDuration: "".concat(settings.transitionDuration, "s"),
        zIndex: "".concat(settings.screenZindex)
      });

      if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
        $('html').css({
          position: 'absolute',
          width: "calc(".concat($('body').width(), "px - ").concat(settings.width)
        });
      }

      setTimeout(function () {
        settings.afterOpen();
      }, settings.transitionDuration * 1000);
      return false;
    };

    var togglePanel = function togglePanel() {
      var elmId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if ($("#".concat(elmId)).hasClass('open')) {
        closePanel(elmId, globalSettings[elmId]);
      } else {
        openPanel(elmId, globalSettings[elmId]);
      }

      return false;
    };

    var orientationChange = function orientationChange() {
      var screenWidth = $(window).width();

      for (var i = 0; i < Object.values(globalSettings).length; i += 1) {
        var settings = Object.values(globalSettings)[i];
        var breakpoint = settings.breakpoint.match(/(\d+)/);

        if (screenWidth < breakpoint[0] && settings.bodyPush) {
          $('html').addClass('slide-out-panel-static');
          break;
        } else {
          $('html').removeClass('slide-out-panel-static');

          if (settings.bodyPush && $(".slide-out-panel-container.".concat(settings.slideFrom)).hasClass('open')) {
            $('html').css({
              width: "calc(".concat(screenWidth, "px - ").concat(settings.width)
            });
          }
        }
      }
    };

    var resizeTimer;
    $(window).on('resize', function (e) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        orientationChange();
      }, 250);
    });

    this.close = function () {
      var closeElemId = $(this).attr('id');
      closePanel(closeElemId, globalSettings[closeElemId]);
    };

    if (!pluginLoaded) {
      $('body').on('click', '.close-slide-out-panel, .slide-out-panel-screen', function () {
        var closeBtnElemId = $(this).attr('data-id');
        closePanel(closeBtnElemId, globalSettings[closeBtnElemId], this);
        return false;
      });
      pluginLoaded = true;
    }

    $('body').on('keyup', function (e) {
      if (e.keyCode === 27) {
        closePanel();
      }
    });

    this.destroy = function () {
      var destroyElemId = $(_this).attr('id');
      destroyPanel(destroyElemId);
    };

    this.open = function () {
      var openElemId = $(this).attr('id');

      if (!$("#".concat(openElemId)).hasClass('open')) {
        openPanel(openElemId, globalSettings[openElemId]);
      }
    };

    this.toggle = function () {
      var openElemId = $(this).attr('id');
      togglePanel(openElemId, globalSettings[openElemId]);
    };

    return this.each(function () {
      $.data(this, "plugin-".concat(pluginName, "-").concat($(this).attr('id')), new SlideOutPanel(this, options));
    });
  };
})(jQuery, window);
