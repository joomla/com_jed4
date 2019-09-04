<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

JFormHelper::loadFieldClass('list');

/**
 * List of approved states.
 *
 * @package  JED
 * @since    4.0.0
 */
class JedFormFieldApproved extends JFormFieldList
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'approved';

	/**
	 * Build a list of approved states.
	 *
	 * @return  array  List of approved states.
	 *
	 * @since   4.0.0
	 *
	 * @throws  RuntimeException
	 */
	public function getOptions(): array
	{
		$options = [];
		$options[] = HTMLHelper::_('select.option', 'approved', Text::_('COM_JED_EXTENSIONS_APPROVED_APPROVED'));
		$options[] = HTMLHelper::_('select.option', 'pending', Text::_('COM_JED_EXTENSIONS_APPROVED_PENDING'));
		$options[] = HTMLHelper::_('select.option', 'gl1', Text::_('COM_JED_EXTENSIONS_APPROVED_GL1'));
		$options[] = HTMLHelper::_('select.option', 'gl2', Text::_('COM_JED_EXTENSIONS_APPROVED_GL2'));
		$options[] = HTMLHelper::_('select.option', 'gl3', Text::_('COM_JED_EXTENSIONS_APPROVED_GL3'));
		$options[] = HTMLHelper::_('select.option', 'lc1', Text::_('COM_JED_EXTENSIONS_APPROVED_LC1'));
		$options[] = HTMLHelper::_('select.option', 'lc2', Text::_('COM_JED_EXTENSIONS_APPROVED_LC2'));
		$options[] = HTMLHelper::_('select.option', 'ld1', Text::_('COM_JED_EXTENSIONS_APPROVED_LD1'));
		$options[] = HTMLHelper::_('select.option', 'ld2', Text::_('COM_JED_EXTENSIONS_APPROVED_LD2'));
		$options[] = HTMLHelper::_('select.option', 'nm1', Text::_('COM_JED_EXTENSIONS_APPROVED_NM1'));
		$options[] = HTMLHelper::_('select.option', 'nm2', Text::_('COM_JED_EXTENSIONS_APPROVED_NM2'));
		$options[] = HTMLHelper::_('select.option', 'ph1', Text::_('COM_JED_EXTENSIONS_APPROVED_PH1'));
		$options[] = HTMLHelper::_('select.option', 'ph2', Text::_('COM_JED_EXTENSIONS_APPROVED_PH2'));
		$options[] = HTMLHelper::_('select.option', 'ph3', Text::_('COM_JED_EXTENSIONS_APPROVED_PH3'));
		$options[] = HTMLHelper::_('select.option', 'se2', Text::_('COM_JED_EXTENSIONS_APPROVED_SE2'));
		$options[] = HTMLHelper::_('select.option', 'se3', Text::_('COM_JED_EXTENSIONS_APPROVED_SE3'));
		$options[] = HTMLHelper::_('select.option', 'se4', Text::_('COM_JED_EXTENSIONS_APPROVED_SE4'));
		$options[] = HTMLHelper::_('select.option', 'tm1', Text::_('COM_JED_EXTENSIONS_APPROVED_TM1'));
		$options[] = HTMLHelper::_('select.option', 'tm2', Text::_('COM_JED_EXTENSIONS_APPROVED_TM2'));
		$options[] = HTMLHelper::_('select.option', 'tm3', Text::_('COM_JED_EXTENSIONS_APPROVED_TM3'));
		$options[] = HTMLHelper::_('select.option', 'pe1', Text::_('COM_JED_EXTENSIONS_APPROVED_PE1'));
		$options[] = HTMLHelper::_('select.option', 'us1', Text::_('COM_JED_EXTENSIONS_APPROVED_US1'));
		$options[] = HTMLHelper::_('select.option', 'rejected', Text::_('COM_JED_EXTENSIONS_APPROVED_REJECTED'));
		return array_merge(parent::getOptions(), $options);
	}
}
