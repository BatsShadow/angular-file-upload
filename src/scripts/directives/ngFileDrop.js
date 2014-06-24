/**
 * The angular file upload module
 * @author: nerv
 * @version: 0.5.7, 2014-05-23
 */

// It is attached to an element that catches the event drop file
app.directive('ngFileDrop', ['$fileUploader', '$timeout', function ($fileUploader, $timeout) {
    'use strict';
    var dragdropCollection = $();

    return {
        // don't use drag-n-drop files in IE9, because not File API support
        link: !$fileUploader.isHTML5 ? angular.noop : function (scope, element, attributes) {
            element
                .bind('drop', function (event) {
                    var dataTransfer = event.dataTransfer ?
                        event.dataTransfer :
                        event.originalEvent.dataTransfer; // jQuery fix;
                    if (!dataTransfer) return;
                    event.preventDefault();
                    event.stopPropagation();
                    dragdropCollection = $();
                    scope.$broadcast('file:removeoverclass');
                    scope.$emit('file:add', dataTransfer.files, scope.$eval(attributes.ngFileDrop));
                })
                .bind('dragover', function (event) {
                    // Only start if collection is empty
                    if (0 == dragdropCollection.size()) {
                        var dataTransfer = event.dataTransfer ?
                            event.dataTransfer :
                            event.originalEvent.dataTransfer; // jQuery fix;

                        event.preventDefault();
                        event.stopPropagation();
                        dataTransfer.dropEffect = 'copy';
                        scope.$broadcast('file:addoverclass');
                    }
                    dragdropCollection = dragdropCollection.add(event.target);
                })
                .bind('dragleave', function (event) {
                    // We need a timeout because some browsers trigger dragleave before dragover
                    $timeout(function() {
                        dragdropCollection = dragdropCollection.not(event.target);
                        if (0 == dragdropCollection.size()) {
                            scope.$broadcast('file:removeoverclass');
                        }
                    }, 1);
                });
        }
    };
}])
