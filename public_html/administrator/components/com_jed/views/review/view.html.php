<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;

/**
 * View to edit a review.
 *
 * @since  4.0.0
 */
class JedViewReview extends JViewLegacy
{
	protected $form;

	/**
	 * The item data.
	 *
	 * @var   object
	 *
	 * @since 4.0.0
	 */
	protected $item;

	/**
	 * The model state.
	 *
	 * @var   JObject
	 *
	 * @since 4.0.0
	 */
	protected $state;

	/**
	 * Display the view
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  void
	 *
	 * @throws Exception
	 *
	 * @since 4.0.0
	 */
	public function display($tpl = null)
	{
		$this->state = $this->get('State');
		$this->item  = $this->get('Item');
		$this->form  = $this->get('Form');

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors), 500);
		}

		$this->addToolbar();
		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	protected function addToolbar()
	{
		JFactory::getApplication()->input->set('hidemainmenu', true);

		JToolBarHelper::title(Text::_('COM_JED_REVIEW_VIEW_EDIT_TITLE'), 'plugin.png');

		$canDo = ContentHelper::getActions('com_jed', 'review', $this->state->get('filter.published'));

		if ($canDo->get('core.edit.state'))
		{
			JToolbarHelper::apply('review.apply');
			JToolbarHelper::save('review.save');
		}

		if (empty($this->item->id))
		{
			JToolbarHelper::cancel('review.cancel');
		}
		else
		{
			JToolbarHelper::cancel('review.cancel', 'JTOOLBAR_CLOSE');
		}
	}
}
