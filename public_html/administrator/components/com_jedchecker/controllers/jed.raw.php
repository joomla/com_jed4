<?php
/**
 * @author Hugh Messenger
 * @date: 11/11/2014
 *
 * @copyright  Copyright (C) 2008 - 2012 compojoom.com . All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die('Restricted access');

jimport('joomla.filesystem');
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.archive');

class jedcheckerControllerJed extends JControllerlegacy
{
	private $jcli = null;

	/**
	 * Constructor
	 *
	 * @throws UnexpectedValueException
	 */
    public function __construct()
    {
    	$config = JComponentHelper::getParams('com_jedchecker');
    	$path = $config->get('jedchecker_jed_script', '/jed_crons/jed_check.class.php');
    	$path = trim($path);

    	if (empty($path))
    	{
    		throw new UnexpectedValueException('No jedchecker_jed_script defined');

    		return;
    	}

    	$path = JPATH_SITE . '/' . ltrim($path, '/');
    	str_replace('//', '/', $path);

    	if (!JFile::exists($path))
    	{
    		throw new UnexpectedValueException('jed cheker class not found');
    		return;
    	}

    	require $path;

    	$this->jcli = new jedCheckCLI;
    	$this->jcli->setDebug(false);

        parent::__construct();
    }

    /**
     * Do JED check.
     * Echo '1' for successful check
     * Echo '2' for a failed check  (0 = pending)
     *
     * @return  void
     */
    public function check()
    {
    	$ok = $this->jcli->jedCheck();

    	if (!$this->jcli->isCli)
    	{
    		echo $ok ? "1" : "2";
    	}
    }
}
