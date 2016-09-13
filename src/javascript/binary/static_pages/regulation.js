pjax_config_page('/regulation', function() {
    return {
        onLoad: function() {
            var coords = [];
                $map_area = $('#planetmap area');
                $selector = $('img[usemap="#planetmap"]');
            if (coords.length === 0) {
                $map_area.each(function(){
                    coords.push($(this).attr('coords'));
                });
            }
            function relocate_links() {
                $map_area.each(function(index){
                  var c = '';
                  var new_width = $selector[0].getBoundingClientRect().width.toFixed(2);
                  coords[index].split(',').map(function(v) { c += (c ? ',' : '') + (v*new_width/900).toFixed(2); });
                  $(this).attr('coords', c);
                });
            }
            if ($selector.width() > 0) {
                relocate_links();
            } else {
                $selector.load(relocate_links);
            }
            $(window).resize(relocate_links);
        }
    };
});
