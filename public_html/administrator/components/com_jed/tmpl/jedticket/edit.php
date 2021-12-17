<?php
/**
 * @package       JED
 *
 * @subpackage    Tickets
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die;

use Jed\Component\Jed\Administrator\Helper\JedHelper;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;


HTMLHelper::addIncludePath(JPATH_COMPONENT . '/helpers/html');

$wa = $this->document->getWebAssetManager();

$wa->useStyle('com_jed.jedTickets');
$wa->useScript('keepalive')
	->useScript('form.validate')
	->useScript('com_jed.ticketGetmessagetemplate')
	->useScript('com_jed.ticketVELDeveloperUpdateActionButton');
HTMLHelper::_('bootstrap.tooltip');

$headerlabeloptions = array('hiddenLabel' => true);
$fieldhiddenoptions = array('hidden' => true);
?>
    

    <form
            action="<?php echo Route::_('index.php?option=com_jed&layout=edit&id=' . (int) $this->item->id); ?>"
            method="post" enctype="multipart/form-data" name="adminForm" id="jedticket-form"
            class="form-validate form-horizontal">


        <div class="com_jed_ticket">
            <div class="row-fluid">
                <!-- header boxes -->
				<?php echo LayoutHelper::render('ticket.header', $this->form); ?>

            </div>

        </div> <!-- end div class  com_jed_ticket -->


        <br/>

		<?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', array('active' => 'ticket')); ?>

		<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'ticket', Text::_('COM_JED_TAB_TICKET', true)); ?>
        <!-- Ticket Summary Tab -->
        <div class="row">
            <div class="col-8">
                <div class="widget">
                    <h1>Ticket</h1>
                    <div class="container">

						<?php echo $this->form->renderField('ticket_text', null, null, $headerlabeloptions); ?>
                    </div>


                </div>
                <div class="widget">
                    <h1>Message History</h1>
                    <div class="container">
                        <div class="row">
							<?php
							$slidesOptions = array(//"active" => "slide0" // It is the ID of the active tab.
							);
							echo HTMLHelper::_('bootstrap.startAccordion', 'ticket_messages_group', $slidesOptions);

							$slideid = 0;
							foreach ($this->ticket_messages as $ticketMessage)
							{
								if ($ticketMessage->message_direction == 0)
								{
									$inout = "jed-ticket-message-out";
								}
								else
								{
									$inout = "jed-ticket-message-in";
								}

								echo HTMLHelper::_('bootstrap.addSlide', 'ticket_messages_group', '<span class="' . $inout . '">' . $ticketMessage->subject . ' - ' . JedHelper::prettyDate($ticketMessage->created_on), 'slide' . ($slideid++));
								echo "<p>" . $ticketMessage->message . "</p>";
								echo JHtml::_('bootstrap.endSlide');

							}
							echo HTMLHelper::_('bootstrap.endAccordion');

							?>


                        </div>

                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="widget">
                    <h1>Created By</h1>
                    <div class="container">
                        <div class="row">
                            <div class="col"><?php echo $this->form->renderField('created_by', null, null, $headerlabeloptions); ?></div>
                            <div class="col"><?php
								echo 'on ';

								echo JedHelper::prettyDate($this->item->created_on);


								?></div>
                        </div>

                    </div>


                </div>
                <div class="widget">
                    <h1>Related Object</h1>
                    <div class="container">
                        <p><?php echo $this->related_object_string; ?></p>
                    </div>
                </div>
                <div class="widget">
                    <h1>Internal Notes</h1>
                    <div class="container">
						<?php echo $this->form->renderField('internal_notes', null, null, $headerlabeloptions); ?>
                    </div>
                </div>

            </div>
			
			<?php echo HTMLHelper::_('uitab.endTab'); ?>

			<?php
			if ($this->linked_item_type === 1) /* Unknown Type */
			{
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedUnknown', 'Unknown');

				echo LayoutHelper::render('ticket.linked_unknown', $this->linked_form);

				echo HTMLHelper::_('uitab.endTab');
			}
			if ($this->linked_item_type === 2) /* Extension */
			{
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedExtension', 'Linked Extension');

				echo LayoutHelper::render('ticket.linked_extension', $this->linked_form);

				echo HTMLHelper::_('uitab.endTab');
			}
			if ($this->linked_item_type === 3) /* Review */
			{
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedReview', 'Linked Review');

				echo LayoutHelper::render('ticket.linked_review', $this->linked_form);

				echo HTMLHelper::_('uitab.endTab');
			}
			if ($this->linked_item_type === 4) /* VEL Report */
			{
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedVELReport', 'Linked VEL Report');

				echo LayoutHelper::render('ticket.linked_velreport', $this->linked_form);

				echo HTMLHelper::_('uitab.endTab');


			}
			if ($this->linked_item_type === 5) /* VEL Developer Update */
			{
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedDeveloperUpdate', 'Linked Developer Update');

				echo LayoutHelper::render('ticket.linked_veldeveloperupdate', $this->linked_form);
				echo HTMLHelper::_('uitab.endTab');
			}
			if ($this->linked_item_type === 6) /* VEL Abandonware */
			{
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedAbandonedReport', 'Linked Abandonware Report');

				echo LayoutHelper::render('ticket.linked_velabandonware', $this->linked_form);

				echo HTMLHelper::_('uitab.endTab');
			}
			?>

			<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'SendMessage', 'Send Message');
			?>
            <div class="row">

                <div class="widget">
                    <h1>Message Templates</h1>
                    <div class="container">
                        <div class="row">
							<?php echo $this->form->renderField('messagetemplates', null, null, $headerlabeloptions); ?>

                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="widget">
                        <h1>Compose Message</h1>
                        <div class="container">
                            <div class="row">
								<?php echo $this->form->renderField('message_subject', null, null, $headerlabeloptions); ?>
								<?php echo $this->form->renderField('message_text', null, null, $headerlabeloptions); ?>

                                <button type="button" class="btn btn-primary"
                                        onclick="Joomla.submitbutton('jedticket.sendmessage')">


									<?php echo Text::_('Send Message'); ?>

                                </button>


                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- class="row">   -->
			 ?>

			<?php

			echo HTMLHelper::_('uitab.endTab');
			?>

			<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'Publishing', Text::_('COM_JED_TAB_PUBLISHING', true)); ?>
            <div class="row-fluid">
                <div class="span10 form-horizontal">
                    <fieldset class="adminform">
                        <legend><?php echo Text::_('COM_JED_FIELDSET_PUBLISHING'); ?></legend>
						<?php echo $this->form->renderField('state'); ?>
						<?php echo $this->form->renderField('created_by'); ?>

						<?php echo $this->form->renderField('created_on'); ?>
						<?php echo $this->form->renderField('modified_by'); ?>
						<?php echo $this->form->renderField('modified_on'); ?>
                        <input type="hidden" name="jform[created_by_num]"
                               value="<?php echo $this->item->created_by; ?>"/>
						<?php echo $this->form->renderField('id'); ?>
						<?php echo $this->form->renderField('uploaded_files_preview'); //,null,null,$fieldhiddenoptions); ?>
						<?php echo $this->form->renderField('uploaded_files_location'); //,null,null,$fieldhiddenoptions); ?>
						<?php echo $this->form->renderField('linked_item_type', null, null, $fieldhiddenoptions); ?>
						<?php echo $this->form->renderField('linked_item_id', null, null, $fieldhiddenoptions); ?>
						<?php echo $this->form->renderField('parent_id', null, null, $fieldhiddenoptions); ?>
						<?php echo $this->form->renderField('id', null, null, $fieldhiddenoptions); ?>
                    </fieldset>
                </div>
            </div>
			<?php echo HTMLHelper::_('uitab.endTab'); ?>


			<?php echo HTMLHelper::_('uitab.endTabSet'); ?>

            <input type="hidden" name="task" value=""/>
			<?php echo HTMLHelper::_('form.token'); ?>

    </form>
<?php


?>

