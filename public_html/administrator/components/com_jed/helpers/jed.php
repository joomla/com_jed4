<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

/**
 * Jed Helper
 *
 * @since  4.0.0
 */
class JedHelper
{
	/**
	 * Render submenu.
	 *
	 * @param   string  $vName  The name of the current view.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function addSubmenu($vName): void
	{
		JHtmlSidebar::addEntry(
			Text::_('COM_JED_TITLE_HOME'), 'index.php?option=com_jed&view=home', $vName === 'home'
		);
		JHtmlSidebar::addEntry(
			Text::_('COM_JED_TITLE_EXTENSIONS'), 'index.php?option=com_jed&view=extensions', $vName === 'extensions'
		);
		JHtmlSidebar::addEntry(
			Text::_('COM_JED_TITLE_REVIEWS'), 'index.php?option=com_jed&view=reviews', $vName === 'reviews'
		);
		JHtmlSidebar::addEntry(
			Text::_('COM_JED_TITLE_TICKETS'), 'index.php?option=com_jed&view=tickets', $vName === 'tickets'
		);
		JHtmlSidebar::addEntry(
			Text::_('COM_JED_TITLE_USERS'), 'index.php?option=com_jed&view=users', $vName === 'users'
		);
		JHtmlSidebar::addEntry(
			Text::_('COM_JED_TITLE_EMAILS'), 'index.php?option=com_jed&view=emails', $vName === 'emails'
		);
	}
}
