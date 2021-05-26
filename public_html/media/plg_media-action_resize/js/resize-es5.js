(function () {
  'use strict';

  /**
   * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
   * @license    GNU General Public License version 2 or later; see LICENSE.txt
   */
  Joomla = window.Joomla || {};
  Joomla.MediaManager = Joomla.MediaManager || {};
  Joomla.MediaManager.Edit = Joomla.MediaManager.Edit || {};

  (function () {
    var resize = function resize(width, height) {
      // The image element
      var image = document.getElementById('image-source'); // The canvas where we will resize the image

      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height); // The format

      var format = Joomla.MediaManager.Edit.original.extension === 'jpg' ? 'jpeg' : Joomla.MediaManager.Edit.original.extension; // The quality

      var quality = document.getElementById('jform_resize_quality').value; // Creating the data from the canvas

      Joomla.MediaManager.Edit.current.contents = canvas.toDataURL("image/" + format, quality); // Updating the preview element

      var preview = document.getElementById('image-preview');
      preview.width = width;
      preview.height = height;
      preview.src = Joomla.MediaManager.Edit.current.contents; // Update the width input box

      document.getElementById('jform_resize_width').value = parseInt(width, 10); // Update the height input box

      document.getElementById('jform_resize_height').value = parseInt(height, 10); // Notify the app that a change has been made

      window.dispatchEvent(new Event('mediaManager.history.point'));
    };

    var initResize = function initResize() {
      var funct = function funct() {
        var image = document.getElementById('image-source');
        var resizeWidthInputBox = document.getElementById('jform_resize_width');
        var resizeHeightInputBox = document.getElementById('jform_resize_height'); // Update the input boxes

        resizeWidthInputBox.value = image.width;
        resizeHeightInputBox.value = image.height; // The listeners

        resizeWidthInputBox.addEventListener('change', function (_ref) {
          var target = _ref.target;
          resize(parseInt(target.value, 10), parseInt(target.value, 10) / (image.width / image.height));
        });
        resizeHeightInputBox.addEventListener('change', function (_ref2) {
          var target = _ref2.target;
          resize(parseInt(target.value, 10) * (image.width / image.height), parseInt(target.value, 10));
        });
      };

      setTimeout(funct, 1000);
    }; // Register the Events


    Joomla.MediaManager.Edit.resize = {
      Activate: function Activate(mediaData) {
        // Initialize
        initResize();
      },
      Deactivate: function Deactivate() {}
    };
  })();

}());
