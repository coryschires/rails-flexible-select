// Flexible Select - jQuery plugin to add "Create New" link to select element.
// 
// Dual licensed under the MIT and GPL licenses:
// http://www.opensource.org/licenses/mit-license.php
// http://www.gnu.org/licenses/gpl.html
//
// --------------------------------------------------------------------------
//
// Flexible Select solves a common problem. Often we want the user to choose
// an option from a drop select or, if they cannot find the option they need,
// create a new option. There are lots solutions to this problem but most are 
// just too powerful for such a simple task (e.g. ajax autocomplete).
//
// Flexible Select tries to keep things as simple as possible. Flexible Select
// add a 'Create New' link inside a standard html drop select. When clicked,
// the link opens an ordinary javascript prompt window where the user can 
// type a name. After clicking "Ok", this value gets sent back to the server 
// via ajax and the newly created option is automatically added to the select 
// element and set as the selected option.
// 
// If you've every added a category in basecamp, Flexible Select works provides
// the exact same functionality.
//
//
// ---------------------------------- USAGE -----------------------------------
// Just add a 'flexible_select' attribute to an ordinary collection_select and 
// set the value as the url where you'd like the ajax request sent. For example:
//
//      <%=  collection_select(:post, :category_id, Category.all, :id, :name, {:prompt => true}, :flexible_select => categories_path(:format => :json)) %>
//
// Then call the plugin on all elements with an attribute of 'flexible_select':
//
//      $('select[flexible_select]').flexible_select();
//
// Finally, you'll need to make a controller action to recieve the ajax request.
// You can do whatever you like here, but it should return a json object with both
// a 'value' and an 'id'. Flexible Select needs these values to create the html
// option that will be added to drop select. A typical action would look something
// like:
//
//      def flexible_select_create
//        @category = Category.find_or_create_by_name(params[:name])
//        respond_to do |format|
//          format.json { render :json => { :value => @category.id, :name => @category.name }.to_json }
//        end
//      end
//
//
// ------------------------------- CUSTOMIZATION --------------------------------
// The defaults are pretty sensible but if you'd like to change things up a bit, 
// you can pass the following options when calling the plugin:
//
//      $('select[flexible_select]').flexible_select({
//          params_name: "name",              // name of the parameters sent to server
//          button_text: "-- Create New --",  // text for the link inside drop select
//          prompt_text: "Please Enter Name"  // what appears in javascript popup box
//      });
//
//
// ---------------------------------- STYLING ------------------------------------
// The plugin provides a hook for styling the 'Create New' link. You're free to do
// whatever you like, but here's some reasonable styles to get you started:
//
//      option.create_link {
//        background: #B7D94D;
//        color: white;
//        text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.25);
//        text-align: center;
//        padding: 2px 0 3px;
//        cursor: pointer;
//        font-size: 13px;
//        margin: 2px auto 5px;
//        border-bottom: 0 solid rgba(0, 0, 0, 0.25);
//      }
//
// Note that option elements do not always style consistently across browsers.


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
