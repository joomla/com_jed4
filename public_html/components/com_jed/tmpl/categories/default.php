<?php
/**
 * @package       JED
 *
 * @subpackage    Categories
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */
// No direct access
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Uri\Uri;

HTMLHelper::addIncludePath(JPATH_COMPONENT . '/helpers/html');
HTMLHelper::_('bootstrap.tooltip', '.hasTooltip');
HTMLHelper::_('behavior.core');


// Import CSS
$document = Factory::getDocument();
$document->addStyleSheet(Uri::root() . 'media/com_jed/css/oldjed.css');

$catlist = $this->items;

?>

<div class="jed-home-categories">
	<?php
	$rowc = 1;
	foreach ($catlist as $c)
	{
		if ($rowc == 1)
		{
			echo '<div class="row">';
		}
		?>
        <div class="col jed-home-category">
            <div class="jed-home-item-view">
                <div class="jed-home-item-title">
                    <div class="jed-home-category-icon-box">
                        <span class="jed-home-category-icon fa fa-<?php echo $c->icon ?>"></span>
                    </div>
                    <h4 class="jed-home-category-title">
                        <!-- @TODO Build correct Link -->
						<?php $listingsUrl = JRoute::_('index.php?option=com_jed&controller=category&view=extension&id=' . (int) $c->id . '&Itemid=133'); ?>
                        <a href="<?php echo $listingsUrl; ?>">
							<?php echo $c->title; ?></a>
                    </h4>
                    <span class="jed-home-category-icon-numitems badge"><?php echo 0 + $c->numitems; ?></span>
                </div>
				<?php if (!empty($c->children)) { ?>
                    <ul class="jed-home-subcategories unstyled">
						<?php foreach ($c->children as $child)
						{
							if ((!$child->numitems) && ($child->title != 'View All'))
							{
								continue;
							};
							if ($child->id <> $c->id)
							{ ?>

                                <li class="jed-home-subcategories-child had-items">
									<?php $listingsUrl = JRoute::_('index.php?option=com_jed&controller=category&view=extension&id=' . (int) $child->id . '&Itemid=133'); ?>
                                    <a href="<?php echo $listingsUrl; ?>">
										<?php echo $child->title; ?></a>
									<?php if ($child->numitems) { ?>
                                        <span class="badge badge-info">	<?php echo 0 + $child->numitems; ?></span>
									<?php }; ?>
                                </li>
								<?php

							}
						}
						?>
                    </ul>
				<?php } ?>
            </div>
        </div>
		<?php
		if ($rowc == 3)
		{
			echo '</div>';
			$rowc = 1;
		}
		else
		{
			$rowc = $rowc + 1;
		};


	} //end foreach($catlist as $cat)
	?>

</div>



