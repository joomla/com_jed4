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
	->useScript('com_jed.testselect');
// ->useScript('com_jed.modalbox')
HTMLHelper::_('bootstrap.tooltip');

$headerlabeloptions = array('hiddenLabel' => true);
$fieldhiddenoptions = array('hidden' => true);
//print_r($this->item);exit();
?>
    <script type="text/javascript">
        /*   js = jQuery.noConflict();
		   js(document).ready(function () {

		   });

		   Joomla.submitbutton = function (task) {
			   if (task == 'ticket.cancel') {
				   Joomla.submitform(task, document.getElementById('ticket-form'));
			   } else {

				   if (task != 'ticket.cancel' && document.formvalidator.isValid(document.id('ticket-form'))) {

					   Joomla.submitform(task, document.getElementById('ticket-form'));
				   } else {
					   alert('<?php echo $this->escape(Text::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
            }
        }
    }*/
    </script> 

    <form
            action="<?php echo Route::_('index.php?option=com_jed&layout=edit&id=' . (int) $this->item->id); ?>"
            method="post" enctype="multipart/form-data" name="adminForm" id="jedticket-form"
            class="form-validate form-horizontal">


        <div class="com_jed_ticket">
            <div class="row-fluid">
                <!-- header boxes -->
                <div class="span10 form-horizontal">

                    <div class="row ticket-header-row">
                        <div class="col-md-3 ticket-header">
                            <h1>Subject</h1>

							<?php echo $this->form->renderField('ticket_subject', null, null, $headerlabeloptions); ?>
                        </div>
                        <div class="col-md-3  ticket-header">
                            <h1>Category</h1>
							<?php echo $this->form->renderField('ticket_category_type', null, null, $headerlabeloptions); ?>
                        </div>
                        <div class="col-md-3  ticket-header">
                            <div class="row mf">
                                <div class="col"><h1>Ticket Status</h1></div>
                                <div class="col"><h1>Origin</h1></div>
                            </div>
                            <div class="row">
                                <div class="col"><?php echo $this->form->renderField('ticket_status', null, null, $headerlabeloptions); ?></div>
                                <div class="col"><?php echo $this->form->renderField('ticket_origin', null, null, $headerlabeloptions); ?></div>
                            </div>
                        </div>
                        <div class="col-md-3  ticket-header">
                            <h1>Assigned</h1>
                            <div class="row">
                                <div class="col"><?php echo $this->form->renderField('allocated_group', null, null, $headerlabeloptions); ?></div>
                                <div class="col"><?php echo $this->form->renderField('allocated_to', null, null, $headerlabeloptions); ?></div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div> <!-- end div class  com_jed_ticket -->


        <br/>
        
		<?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', array('active' => 'ticket')); ?>
        
		<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'ticket', Text::_('COM_JED_TAB_TICKET', true)); ?>
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
								$slidesOptions = array(
									//"active" => "slide0" // It is the ID of the active tab.
								);
								echo HTMLHelper::_('bootstrap.startAccordion', 'ticket_messages_group', $slidesOptions);
                                
                                $slideid=0;
								foreach ($this->ticket_messages as $ticketMessage) {
                                    if($ticketMessage->message_direction==0)
                                    {
                                        $inout="jed-ticket-message-out";
                                    }
                                    else 
                                    { 
                                        $inout="jed-ticket-message-in";
                                     }
                                    
									echo HTMLHelper::_('bootstrap.addSlide', 'ticket_messages_group', '<span class="'.$inout.'">'.$ticketMessage->subject.' - '.JedHelper::prettyDate($ticketMessage->created_on), 'slide' . ($slideid++));
									echo "<p>".$ticketMessage->message."</p>";
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
                            <p>In this box, show the respective item summary, extension, review, VEL item, Abandonware
                                Item</p>
                        </div>
                    </div>
                    <div class="widget">
                        <h1>Internal Notes</h1>
                        <div class="container">
							<?php echo $this->form->renderField('internal_notes', null, null, $headerlabeloptions); ?>
                        </div>
                    </div>

            </div>
			<?php /*
    
                
                <div class="widget"><h1>Hello</h1></div>
                <!--<legend><?php echo Text::_('COM_JED_FIELDSET_TICKET'); ?></legend> -->
				<?php echo $this->form->renderField('id'); ?>
                <p><?php echo $this->form->renderField('ticket_origin','','',$hiddenlabeloptions); ?></p>
				<p><?php
                    echo $this->form->renderField('ticket_subject', null, null, array('class' => 'control-wrapper-' . $field));

                  //  echo $this->form->renderField('ticket_category_type',new array('class'=>'ht')); ?></p>
				<?php echo $this->form->renderField('ticket_subject'); ?>
				<?php echo $this->form->renderField('ticket_text'); ?>
				<?php echo $this->form->renderField('internal_notes'); ?>
				<?php echo $this->form->renderField('uploaded_files_preview'); ?>
				<?php echo $this->form->renderField('uploaded_files_location'); ?>
				<?php echo $this->form->renderField('allocated_group'); ?>
				<?php echo $this->form->renderField('allocated_to'); ?>
				<?php echo $this->form->renderField('linked_item_type'); ?>
				<?php echo $this->form->renderField('linked_item_id'); ?>
				<?php echo $this->form->renderField('ticket_status'); ?>
				<?php echo $this->form->renderField('parent_id'); ?>
            </fieldset>
        </div>
    </div> */ ?>
			<?php echo HTMLHelper::_('uitab.endTab'); ?>

			<?php /* Show Linked Data */
			if ($this->linked_item_type === 4)
			{
				/* Set up Data fieldsets */

				$fieldsets['vulnerabilitydetails']['title'] = "Vulnerability Details";

				$fieldsets['vulnerabilitydetails']['fields'] = array(
					'vulnerability_type',
					'vulnerable_item_name',
					'vulnerable_item_version',
					'exploit_type',
					'exploit_other_description',
					'vulnerability_description',
					'vulnerability_how_found',
					'vulnerability_actively_exploited',
					'vulnerability_publicly_available',
					'vulnerability_publicly_url',
					'vulnerability_specific_impact');

				$fieldsets['developerdetails']['title']       = "Developer Details";
				$fieldsets['developerdetails']['description'] = "";
				$fieldsets['developerdetails']['fields']      = array(
					'developer_communication_type',
					'developer_patch_download_url',
					'developer_name',
					'developer_contact_email',
					'jed_url',
					'tracking_db_name',
					'tracking_db_id',
					'developer_additional_info');

				$fieldsets['filelocation']['title']       = "Location of File";
				$fieldsets['filelocation']['description'] = "";
				$fieldsets['filelocation']['fields']      = array(
					'download_url');

				$fieldsets['aboutyou']['title']       = "Reporter";
				$fieldsets['aboutyou']['description'] = "";
				$fieldsets['aboutyou']['fields']      = array(
					'reporter_fullname',
					'reporter_email',
					'reporter_organisation',
					'pass_details_ok');


				$fieldsets['extra']['title']       = "Extra";
				$fieldsets['extra']['description'] = "";
				$fieldsets['extra']['fields']      = array(
					'consent_to_process',
					'passed_to_vel',
					'date_submitted',
					'user_ip',
					'data_source');

				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedVELReport', 'Linked VEL Report'); ?>
                <div class="row">
                    <div class="col">
                        <div class="widget">
                            <h1><?php echo $fieldsets['vulnerabilitydetails']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['vulnerabilitydetails']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>
                        <div class="widget">
                            <h1><?php echo $fieldsets['filelocation']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['filelocation']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>

                        <div class="widget">
                            <h1><?php echo $fieldsets['extra']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['extra']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="col">
                        <div class="widget">
                            <h1><?php echo $fieldsets['developerdetails']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['developerdetails']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>
                        <div class="widget">
                            <h1><?php echo $fieldsets['aboutyou']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['aboutyou']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>
                         <div class="widget">
                            <h1>Actions</h1>
							<?php // print_r($this->linked_item_data[0]);
							?>
                            <div class="container">
                                <div class="row">
                                     <button type="button" class="btn btn-primary" onclick="Joomla.submitbutton('jedticket.copyReporttoVEL')">

                                        

                                        <?php echo Text::_('Create new VEL Item'); ?>

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


				<?php echo HTMLHelper::_('uitab.endTab');


			}
			if ($this->linked_item_type === 5)
			{
				/* Set up Data fieldsets */

				$fieldsets['aboutyou']['title']  = JTEXT::_('COM_JED_VEL_GENERAL_FIELD_ABOUT_YOU_LABEL');
				$fieldsets['aboutyou']['fields'] = array(
					'contact_fullname',
					'contact_organisation',
					'contact_email');

				$fieldsets['vulnerabilitydetails']['title']  = JTEXT::_('COM_JED_VEL_DEVELOPERUPDATES_FORM_VULNERABILITY_DETAILS_TITLE');
				$fieldsets['vulnerabilitydetails']['fields'] = array(
					'vulnerable_item_name',
					'vulnerable_item_version',
					'extension_update',
					'new_version_number',
					'update_notice_url',
					'changelog_url',
					'download_url',
					'consent_to_process',
					'update_date_submitted');


				$fieldsets['final']['title']       = "VEL Details";
				$fieldsets['final']['description'] = "";

				$fieldsets['final']['fields'] = array(
					'vel_item_id');
				$fscount                      = 0;
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedDeveloperUpdate', 'Linked Developer Update');
				?>
                <div class="row">
                    <div class="col">
                        <div class="widget">
                            <h1><?php echo $fieldsets['vulnerabilitydetails']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['vulnerabilitydetails']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="widget">
                            <h1><?php echo $fieldsets['aboutyou']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['aboutyou']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>

                        <div class="widget">
                            <h1><?php echo $fieldsets['final']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['final']['fields'] as $field)
									{

										//$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<?php
				echo HTMLHelper::_('uitab.endTab');
			}
			if ($this->linked_item_type === 6)
			{
				/* Set up Data fieldsets */

				$fieldsets['aboutyou']['title'] = JTEXT::_('COM_JED_VEL_REPORT_ABOUT_YOU_TITLE');

				$fieldsets['aboutyou']['fields'] = array(
					'reporter_fullname',
					'reporter_email',
					'reporter_organisation');

				$fieldsets['extensiondetails']['title']  = JTEXT::_('COM_JED_VEL_ABANDONEDREPORT_EXTENSION_TITLE');
				$fieldsets['extensiondetails']['fields'] = array(
					'extension_name',
					'developer_name',
					'extension_version',
					'extension_url',
					'abandoned_reason',
					'consent_to_process');
				echo HTMLHelper::_('uitab.addTab', 'myTab', 'LinkedAbandonedReport', 'Linked Abandonware Report');
				?>
                <div class="row">
                    <div class="col">
                        <div class="widget">
                            <h1><?php echo $fieldsets['extensiondetails']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['extensiondetails']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="widget">
                            <h1><?php echo $fieldsets['aboutyou']['title']; ?></h1>
                            <div class="container">
                                <div class="row">
									<?php foreach ($fieldsets['aboutyou']['fields'] as $field)
									{

										$this->linked_form->setFieldAttribute($field, 'readonly', 'true');
										echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


									} ?>
                                </div>
                            </div>
                        </div>

                        <div class="widget">
                            <h1>Actions</h1>
							<?php // print_r($this->linked_item_data[0]);
							?>
                            <div class="container">
                                <div class="row">
                                    <button
                                            class="btn btn-sm btn-info w5rem mb-1"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-box"
                                            data-bs-title="Creating New VEL Abandoned Entry"
                                            data-bs-id="<?php echo $this->linked_item_data[0]->id; ?>"
                                            data-bs-action="showCampDescription"
                                            onclick="return false;">
                                        Create VEL Abandoned Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<?php

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

                                <button type="button" class="btn btn-primary" onclick="Joomla.submitbutton('jedticket.sendmessage')">

                                        

                                        <?php echo Text::_('Send Message'); ?>

                                    </button>
                                  

           

                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- class="row">   -->
			<?php /* <div class="col">
              <div class="widget">
                <h1><?php echo $fieldsets['aboutyou']['title']; ?></h1>
                <div class="container">
                    <div class="row">
                    <?php    foreach ($fieldsets['aboutyou']['fields'] as $field)
                    {

                        $this->linked_form->setFieldAttribute($field, 'readonly', 'true');
                        echo $this->linked_form->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


                    } ?>
                    </div>
                  </div>
                  </div>
                                                               
             <div class="widget">
                <h1>Actions</h1>
              <?php // print_r($this->linked_item_data[0]); ?>
                 <div class="container">
                    <div class="row">
                   <button
	class="btn btn-sm btn-info w5rem mb-1" 
	data-bs-toggle="modal" 
	data-bs-target="#modal-box" 
	data-bs-title="Creating New VEL Abandoned Entry" 
	data-bs-id="<?php echo $this->linked_item_data[0]->id; ?>" 
	data-bs-action="showCampDescription" 
	onclick="return false;">
		Create VEL Abandoned Item
</button>
                    </div>
                  </div>
                  </div>
            </div>  </div> </div>*/ ?>

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
                        <input type="hidden" name="jform[created_by_num]" value="<?php echo $this->item->created_by; ?>" />
						<?php echo $this->form->renderField('id'); ?>
                <?php echo $this->form->renderField('uploaded_files_preview'); //,null,null,$fieldhiddenoptions); ?>
				<?php echo $this->form->renderField('uploaded_files_location'); //,null,null,$fieldhiddenoptions); ?>
				<?php echo $this->form->renderField('linked_item_type',null,null,$fieldhiddenoptions); ?>
				<?php echo $this->form->renderField('linked_item_id',null,null,$fieldhiddenoptions); ?>
				<?php echo $this->form->renderField('parent_id',null,null,$fieldhiddenoptions); ?>
                        <?php echo $this->form->renderField('id',null,null,$fieldhiddenoptions); ?>
                    </fieldset>
                </div>
            </div>
			<?php echo HTMLHelper::_('uitab.endTab'); ?>


			<?php echo HTMLHelper::_('uitab.endTabSet'); ?>

            <input type="hidden" name="task" value=""/>
			<?php echo HTMLHelper::_('form.token'); ?>

    </form>
<?php
//print_r($this->form);

?>

<?php // include_once JPATH_COMPONENT . '/layouts/ticket/modalbox.php'; ?>