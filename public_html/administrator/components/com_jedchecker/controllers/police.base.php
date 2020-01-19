<?php
/**
 * @author Daniel Dimitrov - compojoom.com
 * @date: 02.06.12
 *
 * @copyright  Copyright (C) 2008 - 2012 compojoom.com . All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die('Restricted access');


jimport('joomla.filesystem');
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.archive');


class jedcheckerControllerPoliceBase extends JControllerlegacy
{
	protected $report = null;
	
	protected $rule = null;
	
	public function doCheck($rule)
	{
		JLoader::discover('jedcheckerRules',JPATH_COMPONENT_ADMINISTRATOR . '/libraries/rules/');
		
		$path   = JFactory::getConfig()->get('tmp_path') . '/jed_checker/unzipped';
		$class  = 'jedcheckerRules'.ucfirst($rule);
		
		// Stop if the class does not exist
		if(!class_exists($class)) {
			return false;
		}
		
		// Loop through each folder and police it
		$folders    = $this->getFolders();
		foreach ($folders as $folder) {
			$this->police($class, $folder);
		}

		return true;
	}
	
    public function check()
    {
    	$app = JFactory::getApplication();
    	$input = $app->input;
    	
        $rule = $input->getString('rule');

		return $this->doCheck($rule);
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

        return true;
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
