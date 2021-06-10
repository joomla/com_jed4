<?php
/**
 * @package       JED
 *
 * @subpackage    VEL
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;


HTMLHelper::addIncludePath(JPATH_COMPONENT . '/helpers/html');
$wa = $this->document->getWebAssetManager();
$wa->getRegistry()->addExtensionRegistryFile('com_jed');
$wa->useScript('keepalive')
	->useScript('form.validate');
HTMLHelper::_('bootstrap.tooltip');

// Import CSS
$document = Factory::getDocument();
$document->addStyleSheet(Uri::root() . 'media/com_jed/css/form.css');
?>
<script type="text/javascript">
    js = jQuery.noConflict();
    js(document).ready(function () {

        js('input:hidden.report_id').each(function () {
            var name = js(this).attr('name');
            if (name.indexOf('report_idhidden')) {
                js('#jform_report_id option[value="' + js(this).val() + '"]').attr('selected', true);
            }
        });
        js("#jform_report_id").trigger("liszt:updated");
    });

    Joomla.submitbutton = function (task) {
        if (task == 'velvulnerableitem.cancel') {
            Joomla.submitform(task, document.getElementById('velvulnerableitem-form'));
        } else {

            if (task != 'velvulnerableitem.cancel' && document.formvalidator.isValid(document.id('velvulnerableitem-form'))) {

                Joomla.submitform(task, document.getElementById('velvulnerableitem-form'));
            } else {
                alert('<?php echo $this->escape(Text::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
            }
        }
    }
</script>
 
<form
        action="<?php echo Route::_('index.php?option=com_jed&layout=edit&id=' . (int) $this->item->id); ?>"
        method="post" enctype="multipart/form-data" name="adminForm" id="velvulnerableitem-form"
        class="form-validate form-horizontal">


	<?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', array('active' => 'Details')); ?>
	<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'Details', Text::_('COM_JED_GENERAL_TAB_DETAILS', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_FIELDSET_ITEM'); ?></legend>
				<?php echo $this->form->renderField('id'); ?>
				<?php echo $this->form->renderField('title'); ?>
				<?php echo $this->form->renderField('internal_description'); ?>
				<?php echo $this->form->renderField('status'); ?>
				<?php echo $this->form->renderField('report_id'); ?>
				<?php
				foreach ((array) $this->item->report_id as $value)
				{
					if (!is_array($value))
					{
						echo '<input type="hidden" class="report_id" name="jform[report_idhidden][' . $value . ']" value="' . $value . '" />';
					}
				}
				?>
				<?php echo $this->form->renderField('jed'); ?>
				<?php echo $this->form->renderField('risk_level'); ?>
				<?php echo $this->form->renderField('start_version'); ?>
				<?php echo $this->form->renderField('vulnerable_version'); ?>
				<?php echo $this->form->renderField('patch_version'); ?>
				<?php echo $this->form->renderField('recommendation'); ?>
				<?php echo $this->form->renderField('update_notice'); ?>
				<?php echo $this->form->renderField('exploit_type'); ?>
				<?php echo $this->form->renderField('exploit_other_description'); ?>
				<?php echo $this->form->renderField('xml_manifest'); ?>
				<?php if (!empty($this->item->xml_manifest)) : ?>
					<?php $xml_manifestFiles = array(); ?>
					<?php foreach ((array) $this->item->xml_manifest as $fileSingle) : ?>
						<?php if (!is_array($fileSingle)) : ?>
                            <a href="<?php echo Route::_(Uri::root() . '/tmp' . DIRECTORY_SEPARATOR . $fileSingle, false); ?>"><?php echo $fileSingle; ?></a> |
							<?php $xml_manifestFiles[] = $fileSingle; ?>
						<?php endif; ?>
					<?php endforeach; ?>
                    <input type="hidden" name="jform[xml_manifest_hidden]" id="jform_xml_manifest_hidden"
                           value="<?php echo implode(',', $xml_manifestFiles); ?>"/>
				<?php endif; ?>
				<?php echo $this->form->renderField('manifest_location'); ?>
				<?php echo $this->form->renderField('install_data'); ?>
				<?php echo $this->form->renderField('discovered_by'); ?>
				<?php echo $this->form->renderField('discoverer_public'); ?>
				<?php echo $this->form->renderField('fixed_by'); ?>
				<?php echo $this->form->renderField('coordinated_by'); ?>
            </fieldset>
        </div>
    </div>
	<?php  echo HTMLHelper::_('uitab.endTab'); ?>
	<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'CommonVulnerabilityScoringSystem', Text::_('COM_JED_VEL_TAB_COMMONVULNERABILITYSCORINGSYSTEM', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_VEL_FIELDSET_COMMONVULNERABILITYSCORINGSYSTEM'); ?></legend>
				<?php echo $this->form->renderField('jira'); ?>
				<?php echo $this->form->renderField('cve_id'); ?>
				<?php echo $this->form->renderField('cwe_id'); ?>
				<?php echo $this->form->renderField('cvssthirty_base'); ?>
				<?php echo $this->form->renderField('cvssthirty_base_score'); ?>
				<?php echo $this->form->renderField('cvssthirty_temp'); ?>
				<?php echo $this->form->renderField('cvssthirty_temp_score'); ?>
				<?php echo $this->form->renderField('cvssthirty_env'); ?>
				<?php echo $this->form->renderField('cvssthirty_env_score'); ?>
            </fieldset>
        </div>
    </div>
	<?php echo HTMLHelper::_('uitab.endTab'); ?>
	<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'PublicDescription', Text::_('COM_JED_VEL_TAB_PUBLIC_DESCRIPTION', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_FIELDSET_PUBLICDESCRIPTION'); ?></legend>
				<?php echo $this->form->renderField('public_description'); ?>
				<?php echo $this->form->renderField('alias'); ?>
            </fieldset>
        </div>
    </div>
	<?php  echo HTMLHelper::_('uitab.endTab'); ?>
	<?php echo JHtml::_('uitab.addTab', 'myTab', 'first_report', 'First Report'); ?>
    <div class="row-fluid form-horizontal-desktop">
        <div class="span10 form-horizontal">
			<?php
			$fieldsets['vulnerabilitydetails']['title']       = "Vulnerability Details";
			$fieldsets['vulnerabilitydetails']['description'] = "";
			$fieldsets['vulnerabilitydetails']['fields']      = array(
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


			$fieldsets['filelocation']['title']       = "Extra";
			$fieldsets['filelocation']['description'] = "";
			$fieldsets['filelocation']['fields']      = array(
				'consent_to_process',
				'passed_to_vel',
				'date_submitted',
				'user_ip',
				'data_source');

			foreach ($fieldsets as $fs)
			{

				$fscount = $fscount + 1;
				if ($fs['title'] <> '')
				{
					if ($fscount > 1)
					{
						echo '</fieldset>';
					}

					echo '<fieldset class="velreportform"><legend>' . $fs['title'] . '</legend>';


				}
				if ($fs['description'] <> '')
				{
					echo $fs['description'];
				}
				$fields = $fs['fields'];

				foreach ($fields as $field)
				{

					$this->VelReportForm->setFieldAttribute($field, 'readonly', 'true');
					echo $this->VelReportForm->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


				}
			}
			?>
        </div>
    </div>
	<?php /*echo JHtml::_('uitab.endTab'); ?>

	<?php echo JHtml::_('uitab.addTab', 'myTab', 'extra', JText::_('COM_JED_TITLE_COMMUNICATIONS', true)); ?>

    <div class="row-fluid form-horizontal-desktop">
        <table class="table table-striped" id="communicationsList" data-sorting="true" data-paging="true"
               data-paging-size="20" data-filtering="true">
            <thead>
            <tr>
                <th class="nowrap hidden-phone">
					<?php echo JText::_('COM_VEL_COMMUNICATIONS_COMMUNICATION_TYPE_LABEL'); ?>
                </th>
                <th class="nowrap hidden-phone">
					<?php echo JText::_('COM_VEL_COMMUNICATIONS_VEL_ITEM_ID_LABEL'); ?>
                </th>
                <th class="nowrap hidden-phone">
					<?php echo JText::_('COM_VEL_COMMUNICATIONS_REPORTID_LABEL'); ?>
                </th>
                <th class="nowrap hidden-phone">
					<?php echo JText::_('COM_VEL_COMMUNICATIONS_DEVELOPER_REPORT_ID_LABEL'); ?>
                </th>
                <th class="nowrap hidden-phone">
					<?php echo JText::_('COM_VEL_COMMUNICATIONS_COMMUNICATION_ID_LABEL'); ?>
                </th>
                <th width="5" class="nowrap center hidden-phone">
					<?php echo JHtml::_('searchtools.sort', 'COM_VEL_COMMUNICATIONS_ID', 'a.id', $this->listDirn, $this->listOrder); ?>
                </th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <td colspan="6"><?php // echo $this->pagination->getListFooter(); ?></td>
            </tr>
            </tfoot>
            <tbody>
			<?php foreach ($this->CommunicationsListData as $i => $item): ?>

                <tr class="row<?php  /*echo $i % 2; ?>">

                    <td class="hidden-phone">
						<?php echo JText::_($item->communication_type_string); ?>
                    </td>
                    <td class="hidden-phone">
                        <a href="index.php?option=com_jed&view=velvulnerableitem&task=velvulnerableitem.edit&id=<?php echo $item->vel_item_id; ?> ">
							<?php echo $this->escape($item->vel_item); ?> </a>
                    </td>
                    <td class="hidden-phone">
                        <a href="index.php?option=com_jed&view=velreport&task=velreport.edit&id=<?php echo $item->reportid; ?> ">
							<?php echo $this->escape($item->report_title); ?> </a>
                    </td>
                    <td class="hidden-phone">

                        <a href="index.php?option=com_jed&view=veldeveloperupdate&task=veldeveloperupdate.edit&id=<?php echo $item->developer_report_id; ?>">
							<?php echo $this->escape($item->developer_report_title); ?></a>


                    </td>
                    <td class="hidden-phone">
						<?php echo $this->escape($item->comms_subject); ?>
                    </td>

                    <td class="nowrap center hidden-phone">
						<?php echo $item->id; ?>
                    </td>
                </tr>
			<?php endforeach; */ /* ?>
            </tbody>
        </table>
    </div>
	<?php echo JHtml::_('uitab.endTab'); ?>

	<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'Publishing', Text::_('COM_JED_TAB_PUBLISHING', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_FIELDSET_PUBLISHING'); ?></legend>
				<?php echo $this->form->renderField('created_by'); ?>
				<?php echo $this->form->renderField('modified_by'); ?>
				<?php echo $this->form->renderField('created'); ?>
				<?php echo $this->form->renderField('modified'); ?>
				<?php echo $this->form->renderField('state'); ?>
				<?php if ($this->state->params->get('save_history', 1)) : ?>
                    <div class="control-group">
                        <div class="control-label"><?php echo $this->form->getLabel('version_note'); ?></div>
                        <div class="controls"><?php echo $this->form->getInput('version_note'); ?></div>
                    </div>
				<?php endif; ?>
            </fieldset>
        </div>
    </div>*/?>
	<?php echo HTMLHelper::_('uitab.endTab'); ?>


	<?php echo HTMLHelper::_('uitab.endTabSet'); ?>

    <input type="hidden" name="task" value=""/> 
	<?php echo HTMLHelper::_('form.token'); ?>

</form> 
<H1>Hello</H1>
