const jed = (function () {
    const jed = {};

    jed.searchForm = () => {
        window.addEventListener('DOMContentLoaded', () => {
            let button = document.getElementsByClassName("js-extensionsForm-button-reset")[0];

            button.addEventListener("click", () => {
                const form = document.getElementById("extensionForm");

                [...form.elements].forEach((input) => {
                    if (input.type !== "button") {
                        input.value = '';
                    }
                });
            });
        });
    };

    /**
     * Insert a selected message into the editor
     *
     * @param messageId
     * @returns {boolean}
     */
    jed.insertMessage = function (messageId) {
        jQuery.ajax({
            async: true,
            url: 'index.php',
            dataType: 'json',
            cache: false,
            data: 'option=com_jed&task=ajax.getMessage&id=' + messageId + '&format=json',
            success: function (data) {
                if (data) {
                    if (data.data) {
                        tinyMCE.activeEditor.setContent(data.data);
                    } else {
                        const msg = {};

                        msg.notice = [];
                        msg.notice[0] = Joomla.JText._('COM_JED_ERROR_DURING_PROCESS')
                        Joomla.renderMessages(msg);
                        jQuery('#system-message').fadeOut(5000);
                    }

                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_ERROR_DURING_PROCESS') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        return false;
    };

    /**
     * Send the composed email
     */
    jed.sendMessage = () => {
        let data = new FormData();
        data.append('option', 'com_jed');
        data.append('task', 'ajax.sendMessage');
        data.append('body', JSON.encode(tinyMCE.activeEditor.getContent()));
        data.append('format', 'json');

        jQuery.ajax({
            async: true,
            url: 'index.php?option=com_jed&task=ajax.sendMessage&format=json',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: data,
            processData: false,
            success: function (data) {
                console.log(data);
                if (data) {
                    if (data.data) {
                    } else {
                        const msg = {};

                        msg.notice = [];
                        msg.notice[0] = Joomla.JText._('COM_JED_ERROR_DURING_PROCESS')
                        Joomla.renderMessages(msg);
                        jQuery('#system-message').fadeOut(5000);
                    }

                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_ERROR_DURING_PROCESS') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        return false;
    };

    // Return the public parts
    return jed;
}());