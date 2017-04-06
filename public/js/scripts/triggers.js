// accordion

$(document).ready(function() {
$('#nav-main').okayNav();
$('#topics').okayNav();

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

// blueimp gallery

document.getElementById('links').onclick = function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event},
        links = this.getElementsByTagName('a');
    blueimp.Gallery(links, options);
};
