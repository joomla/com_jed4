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
                        msg.notice[0] = Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_SEND_EMAIL')
                        Joomla.renderMessages(msg);
                        jQuery('#system-message').fadeOut(5000);
                    }

                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_SEND_EMAIL') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        return false;
    };

    /**
     * Send the composed email
     */
    jed.sendMessage = () => {
        const messageId = document.getElementById('jform_template').value,
            developerId = document.getElementById('jform_created_by_id').value,
            extensionId = document.getElementById('jform_id').value;

        if (isNaN(parseInt(messageId)) === true) {
            renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_MISSING_MESSAGE_ID'), 'error');
            return false;
        }

        if (isNaN(parseInt(developerId)) === true) {
            renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_MISSING_DEVELOPER_ID'), 'error');
            return false;
        }

        if (isNaN(parseInt(extensionId)) === true) {
            renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_MISSING_EXTENSION_ID'), 'error');
            return false;
        }

        let data = new FormData();
        data.append('option', 'com_jed');
        data.append('task', 'ajax.sendMessage');
        data.append('body', tinyMCE.activeEditor.getContent());
        data.append('messageId', messageId);
        data.append('developerId', developerId);
        data.append('extensionId', extensionId);
        data.append('userId', Joomla.getOptions('joomla.userId'));
        data.append('format', 'json');

        jQuery.ajax({
            async: true,
            url: 'index.php',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': Joomla.getOptions('csrf.token')
            },
            success: function (data) {
                if (data) {
                    if (data.success === true) {
                        renderMessage(data.message, 'info');
                    } else {
                        let message = Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_SEND_EMAIL');

                        if (data.message.length > 0) {
                            message = data.message;
                        }

                        renderMessage(message, 'error');
                    }
                }
                else {
                    renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_SEND_EMAIL'), 'error');
                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_SEND_EMAIL') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        // Scroll to top
        jQuery('html,body').scrollTop(0);

        return false;
    };

    /**
     * Store an internal note
     */
    jed.storeNote = () => {
        const developerId = document.getElementById('jform_created_by_id').value,
            extensionId = document.getElementById('jform_id').value;

        if (isNaN(parseInt(developerId)) === true) {
            renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_MISSING_DEVELOPER_ID'), 'error');
            return false;
        }

        if (isNaN(parseInt(extensionId)) === true) {
            renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_MISSING_EXTENSION_ID'), 'error');
            return false;
        }

        let data = new FormData();
        data.append('option', 'com_jed');
        data.append('task', 'ajax.storeNote');
        data.append('body', tinyMCE.activeEditor.getContent());
        data.append('developerId', developerId);
        data.append('extensionId', extensionId);
        data.append('userId', Joomla.getOptions('joomla.userId'));
        data.append('format', 'json');

        jQuery.ajax({
            async: true,
            url: 'index.php',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': Joomla.getOptions('csrf.token')
            },
            success: function (data) {
                if (data) {
                    if (data.success === true) {
                        renderMessage(data.message, 'info');
                    } else {
                        let message = Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_STORE_NOTE');

                        if (data.message.length > 0) {
                            message = data.message;
                        }

                        renderMessage(message, 'error');
                    }
                }
                else {
                    renderMessage(Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_STORE_NOTE'), 'error');
                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_EXTENSIONS_ERROR_DURING_STORE_NOTE') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        // Scroll to top
        jQuery('html,body').scrollTop(0);

        return false;
    };

    /**
     * Store the approved state
     *
     * @param extensionId
     * @returns {boolean}
     */
    jed.submitApprovedState = function (extensionId) {
        document.getElementById('js-approve-error').innerHTML = '';
        const approve = Array.from(document.querySelectorAll("[name^=\"jform[approve]\"]"));

        if (parseInt(approve[0].value) === 3 && approve[1].value.length === 0) {
            document.getElementById('js-approve-error').innerHTML = Joomla.JText._('COM_JED_EXTENSIONS_EXTENSION_APPROVED_REASON_REQUIRED', 'At least one reason must be given');

            return false;
        }

        let data = new FormData();
        data.append('option', 'com_jed');
        data.append('task', 'ajax.approveExtension');
        data.append('format', 'json');
        data.append('jform[id]', extensionId);

        approve.forEach(el => {
            data.append(el.name, el.value);
        });

        jQuery.ajax({
            async: true,
            url: 'index.php',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': Joomla.getOptions('csrf.token')
            },
            success: function (data) {
                if (data) {
                    if (data.success) {
                        const msg = {};

                        msg.info = [];
                        msg.info[0] = data.message;
                        Joomla.renderMessages(msg);
                        jQuery('#approveModal').modal('hide');
                    } else {
                        const msg = {};

                        msg.notice = [];
                        msg.notice[0] = data.message
                        Joomla.renderMessages(msg);
                        jQuery('#system-message').fadeOut(5000);
                    }

                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_EXTENSIONS_ERROR_SAVING_APPROVE') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        return false;
    };

    /**
     * Store the approved state
     *
     * @param extensionId
     * @returns {boolean}
     */
    jed.submitPublishedState = function (extensionId) {
        document.getElementById('js-published-error').innerHTML = '';
        const publish = Array.from(document.querySelectorAll("[name^=\"jform[publish]\"]"));

        if (parseInt(publish[0].value) === 0 && publish[1].value.length === 0) {
            document.getElementById('js-published-error').innerHTML = Joomla.JText._('COM_JED_EXTENSIONS_EXTENSION_PUBLISHED_REASON_REQUIRED', 'At least one reason must be given');

            return false;
        }

        let data = new FormData();
        data.append('option', 'com_jed');
        data.append('task', 'ajax.publishExtension');
        data.append('format', 'json');
        data.append('jform[id]', extensionId);

        publish.forEach(el => {
            data.append(el.name, el.value);
        });

        jQuery.ajax({
            async: true,
            url: 'index.php',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': Joomla.getOptions('csrf.token')
            },
            success: function (data) {
                if (data) {
                    if (data.success) {
                        const msg = {};

                        msg.info = [];
                        msg.info[0] = data.message;
                        Joomla.renderMessages(msg);
                        jQuery('#publishModal').modal('hide');
                    } else {
                        const msg = {};

                        msg.notice = [];
                        msg.notice[0] = data.message
                        Joomla.renderMessages(msg);
                        jQuery('#system-message').fadeOut(5000);
                    }

                }
            },
            error: function (request, status, error) {
                jQuery('<div>' + Joomla.JText._('COM_JED_EXTENSIONS_ERROR_SAVING_PUBLISH') + "\n\n" + 'Status error: ' + request.status + "\n" + 'Status message: ' + request.statusText + "\n" + jQuery.trim(request.responseText) + '</div>');
            }
        });

        return false;
    };

    jed.setMessageType = (type) => {
        jQuery('.js-messageType').hide();

        switch (type) {
            case 'email':
                jQuery('.js-sendMessage').show();
                break;
            case 'note':
                jQuery('.js-storeNote').show();
                break;
        }
    };

    /**
     * Render a system message
     *
     * @param message The message to render
     * @param type Which message type to render
     */
    function renderMessage(message, type) {
        jQuery('#system-message-container').hide();

        const msg = {};

        switch (type) {
            case 'info':
                msg.info = [];
                msg.info[0] = message;
                break;
            case 'error':
                msg.error = [];
                msg.error[0] = message;
                break;
            case 'notice':
                msg.notice = [];
                msg.notice[0] = message;
                break;
        }

        Joomla.renderMessages(msg);
    }

    // Return the public parts
    return jed;
}());
