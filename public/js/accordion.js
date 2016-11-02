jQuery(document).ready(function() {
	function close_accordion_section() {
		jQuery('.accordion .accordion__sectionTitle').removeClass('active');
		jQuery('.accordion .accordion__sectionContent').slideUp(300).removeClass('open');
	}

	jQuery('.accordion__sectionTitle').click(function(e) {
		// Grab current anchor value
		var currentAttrValue = jQuery(this).attr('href');

		if(jQuery(e.target).is('.active')) {
			close_accordion_section();
		}else {
			close_accordion_section();

			// Add active class to section title
			jQuery(this).addClass('active');
			// Open up the hidden content panel
			jQuery('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
		}

		e.preventDefault();
	});
});