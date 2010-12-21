// Flexible Select - jQuery plugin to add "Create New" link to select element.
//
// https://github.com/coryschires/rails-flexible-select
// Version 0.0.1
//
// Dual licensed under the MIT and GPL licenses:
// http://www.opensource.org/licenses/mit-license.php
// http://www.gnu.org/licenses/gpl.html
//
//
(function($) {

    $.flexible_select = {
        defaults: {
            params_name: "name",                // name of the parameters sent to server
            button_text: "-- Create New --",    // text for the link inside drop select
            prompt_text: "Please Enter Name"    // what appears in javascript popup box
        }
    }

    $.fn.extend({
        flexible_select: function(config) {
            
            var config = $.extend({}, $.flexible_select.defaults, config);
            
            return this.each(function() {
                var select = $(this);
                var ajax_url = select.attr('flexible_select');
                var create_link = function() {
                    select.find('option:first').after('<option class="create_link">'+config.button_text+'</option>');
                    return select.find('option.create_link')
                }();
                
                var prompt_box = function() {
                    var input_value = prompt(config.prompt_text)

                    if (input_value) {
                        var data = {};
                        data[config.params_name] = input_value;
                        $.post( ajax_url, data, function(data) {
                            var new_option = '<option class="added_via_ajax" value="'+ data.value +'">'+ data.name +'</option>';
                            create_link.after(new_option).next().attr('selected', 'selected');
                        });
                    } else {
                        select.find('option:first').attr('selected', 'selected');
                    }
                }
                
                select.change(function() {
                    var clicked_create_link = select.find('option:selected').text() === config.button_text;
                    if (clicked_create_link) { prompt_box(); }
                });

            })
        }
    })
})(jQuery);
