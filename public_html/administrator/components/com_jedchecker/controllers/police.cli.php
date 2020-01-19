<?php

/**
 * @author Daniel Dimitrov - compojoom.com
* @date: 02.06.12
*
* @copyright  Copyright (C) 2008 - 2012 compojoom.com . All rights reserved.
* @license    GNU General Public License version 2 or later; see LICENSE
* 
* Slightly by Hugh Messenger, fabrikar.com, to allow command line scripts to drive the checker
* Really just a copy of the base controller, which doesn't extended the J! controller class, and simply
* returns the report object as-is, without rendering it in any way.
*/

defined('_JEXEC') or die('Restricted access');

class jedcheckerPolice
{
	protected $report = null;

	protected $rule = null;

	public function check($rule, $folders = null)
	{
		JLoader::discover('jedcheckerRules', JPATH_SITE . '/administrator/components/com_jedchecker/libraries/rules/');

		$path   = JFactory::getConfig()->get('tmp_path') . '/jed_checker/unzipped';
		$class  = 'jedcheckerRules'.ucfirst($rule);

		// Stop if the class does not exist
		if(!class_exists($class)) {
			return false;
		}

		// if no folders specified, find them all
		if (!isset($folders))
		{
			$folders    = $this->getFolders();
		}
		
		foreach ($folders as $folder) {
			$results[$folder] = $this->police($class, $folder);
		}

		return $results;
	}

	protected function police($class, $folder)
	{
		// Prepare rule properties
		$properties = array('basedir' => $folder);

		// Create instance of the rule
		$this->rule = new $class($properties);

		// Perform check
		$this->rule->check();

		// Get the report and then print it
		$this->report = $this->rule->get('report');

		return $this->report;
	}

	protected function getFolders()
	{
		$folders = array();

		// Add the folders in the "jed_checked/unzipped" folder
		$path = JFactory::getConfig()->get('tmp_path') . '/jed_checker/unzipped';
		$tmp_folders = JFolder::folders($path);
		if (!empty($tmp_folders)) {
			foreach ($tmp_folders as $tmp_folder) {
				$folders[] = $path.'/'.$tmp_folder;
			}
		}

		// Parse the local.txt file and parse it
		$local = JFactory::getConfig()->get('tmp_path') . '/jed_checker/local.txt';
		if (JFile::exists($local)) {
			$content = JFile::read($local);
			if (!empty($content)) {
				$lines = explode("\n", $content);
				if (!empty($lines)) {
					foreach ($lines as $line) {
						$line = trim($line);
						if (!empty($line)) {
							if (JFolder::exists(JPATH_ROOT.'/'.$line)) {
								$folders[] = JPATH_ROOT.'/'.$line;
							} elseif (JFolder::exists($line)) {
								$folders[] = $line;
							}
						}
					}
				}
			}
		}

		return $folders;
	}
}
