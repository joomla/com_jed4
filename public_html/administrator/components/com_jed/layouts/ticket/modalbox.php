<?php use Joomla\CMS\HTML\HTMLHelper;

echo HTMLHelper::_(
	'bootstrap.renderModal',
	'modal-box', // selector
	array( // options
		'modal-dialog-scrollable' => true,
		'title'  => 'Test Title',
		'footer' => '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" id="modal-save">Save</button>',
	),
		'<div id="modal-body">Content set by ajax.</div>'
);