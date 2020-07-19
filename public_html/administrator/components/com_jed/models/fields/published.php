<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\HTML\HTMLHelper;

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
		$params = ComponentHelper::getParams('com_jed');
		$codes = $params->get('unpublished_codes');

		$options = [];

		array_walk(
			$codes,
			static function($code) use (&$options) {
				$options[] = HTMLHelper::_('select.option', $code->code, $code->code . ' - ' . $code->name);
			}
		);

		return array_merge(parent::getOptions(), $options);
	}
}
