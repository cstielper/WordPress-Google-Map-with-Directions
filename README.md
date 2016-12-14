# WordPress Google Map with Directions
Follow the steps below to set up an area map that uses the Google Maps API to plot a landmark and get directions to that landmark

## Install Required Plugins
NOTE: The included [JSON file](acf-export.json) to import into Advanced Custom fields is for use with the pro version of the plugin.

1. [WordPress REST API (Version 2)](https://wordpress.org/plugins/rest-api/) (As of WP 4.7, this is no longer needed)
2. [Advanced Custom Fields](https://www.advancedcustomfields.com/) 
3. [ACF to Rest API (Version 2)](https://wordpress.org/plugins/acf-to-rest-api/)

## Setup Plugin Options
### Advanced Custom Fields
Import the [JSON file](acf-export.json) into Advanced Custom Fields.

Add this to your functions.php file to add the Options interface to your WP Dashboard. You will also have Address, City, State, and Zip options that you can use elsewhere in your theme:

~~~~
<?php
if( function_exists('acf_add_options_page') ) {
	$option_page = acf_add_options_page(array(
		'page_title' 	=> 'Global Site Information',
		'menu_title' 	=> 'Global Site Information',
		'menu_slug' 	=> 'theme-global-settings',
		'capability' 	=> 'edit_posts'
	));

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Address & Location Information',
		'menu_title'	=> 'Address/Location',
		'parent_slug'	=> 'theme-global-settings',
	));
}
?>
~~~~

## Output HTML Markup/Javascript
Add this to your theme's functions.php file. You will need to set up the wp_enqueue_script function to work with your site's theme. Don't forget to prefix your function name:
~~~~
<?php 
	function YOUR_FUNCTION_PREFIX_directions_map() {
		if(function_exists('acf_add_options_page')) {
			$lat = get_field('latitude', option);
			$lng = get_field('longitude', option);

			if($lat && $lng) { ?>
				<div id="map-canvas" style="height:350px"></div>
				<form id="get-directions">
					<label>Starting Address: <input id="start" type="text"></label>
					<input id="end" value="<?php echo $lat; ?>, <?php echo $lng; ?>" type="hidden">
					<div id="response-panel"></div>
					<input value="Get Directions" type="submit">
				</form>

				<?php wp_enqueue_script( string $handle, string $src = false, array $deps = array(), string|bool|null $ver = false, bool $in_footer = false );
			}
		}
	}
} ?>
~~~~

You can use this to call the function in your page template:
~~~~
<?php
if(function_exists('YOUR_FUNCTION_PREFIX_directions_map')) {
  YOUR_FUNCTION_PREFIX_directions_map();
}
?>
~~~~

## Javascript Implementation
You will need to set some variables at the top of the [directions-map.js](directions-map.js) file:

1. Add your google maps api key (**var apiKey**). Be sure to enable the directions portion of the Google Maps API when registering your key.
2. Set the path to use in order to query the REST API for the latitude/longitude of the static landmark (**var apiPath**).

## Sample CSS
A [sample SASS file](sample-styles.scss) has been provided to get you started.
