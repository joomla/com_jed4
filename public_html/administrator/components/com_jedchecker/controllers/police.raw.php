<?php
/**
 * @author Daniel Dimitrov - compojoom.com
 * @date: 02.06.12
 *
 * @copyright  Copyright (C) 2008 - 2012 compojoom.com . All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die('Restricted access');

require_once JPATH_ADMINISTRATOR . '/components/com_jedchecker/controllers/police.base.php';

class jedcheckerControllerPolice extends jedcheckerControllerPoliceBase
{
    protected function police($class, $folder)
    {
    	
		if (parent::police($class, $folder) !== false)
		{
			echo '<span class="rule">'
				.  JText::_('COM_JEDCHECKER_RULE') .' ' . JText::_($this->rule->get('id'))
				. ' - '. JText::_($this->rule->get('title'))
				. '</span><br/>'
				. $this->report->getHTML();

			flush();
			ob_flush();
		}
    	
	}
    
}
