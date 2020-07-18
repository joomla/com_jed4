<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

JFormHelper::loadFieldClass('list');

/**
 * List of published states.
 *
 * @package  JED
 * @since    4.0.0
 */
class JedFormFieldPublished extends JFormFieldList
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'published';

	/**
	 * Build a list of published states.
	 *
	 * @return  array  List of published states.
	 *
	 * @since   4.0.0
	 *
	 * @throws  RuntimeException
	 */
	public function getOptions(): array
	{
		$options = [];
		$options[] = HTMLHelper::_('select.option', 'ur1', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR1'));
		$options[] = HTMLHelper::_('select.option', 'ur2', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR2'));
		$options[] = HTMLHelper::_('select.option', 'ur3', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR3'));
		$options[] = HTMLHelper::_('select.option', 'ur4', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR4'));
		$options[] = HTMLHelper::_('select.option', 'ur5', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR5'));
		$options[] = HTMLHelper::_('select.option', 'ur6', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR6'));
		$options[] = HTMLHelper::_('select.option', 'ur7', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR7'));
		$options[] = HTMLHelper::_('select.option', 'ur8', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR8'));
		$options[] = HTMLHelper::_('select.option', 'ur9', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR9'));
		$options[] = HTMLHelper::_('select.option', 'ur10', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR10'));
		$options[] = HTMLHelper::_('select.option', 'ur11', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR11'));
		$options[] = HTMLHelper::_('select.option', 'ur12', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR12'));
		$options[] = HTMLHelper::_('select.option', 'ur13', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR13'));
		$options[] = HTMLHelper::_('select.option', 'ur14', Text::_('COM_JED_EXTENSIONS_PUBLISHED_UR14'));
		return array_merge(parent::getOptions(), $options);
	}
}
