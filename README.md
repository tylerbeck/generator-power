#generator-front-end
============

##Overview
The goal of this yo generator is to create a consistent framework for front-end web and application development and to implement tools that facilitate best practices through the use of automation and templating.

Common front-end processes have been automated using `grunt`, but the configuration of those taks has been streamlined and moved to a JSON settings file. The majority of projects can be configured via this JSON file without any changes to the underlying grunt task configurations.  Additionally these settings files can be overridden in order to provide environment specific settings variations.

###features
 - Dependency management
 - Stylesheet compilation (less or sass), optimization, and minification
 - Image asset export using Sketch/Sketchtool
 - Image minification
 - Web embeddable font generation
 - Icon font generation from SVGs
 - Script minification, concatenation
 - RequireJS compilation; standard, or self-contained using AlmondJS






##Setup
First install yo (requires node): `npm install -g yo`  
Next install this generator: `npm install -g generator-front-end`

To run the generator, `cd` to the desired directory and run `yo front-end`.
A series of prompts will allow you to customize the installation.

 

 
  

##Project Configuration
To configure a project manually or modify settings beyond what can be done via the yo generator process, one can use JSON Configuration files  to overwrite settings.json. Any file that matches `**/*-settings.json` will be recursively merged into the project settings.  This can be used to provide environment specific or developer specific variations. 

Attributes marked as required must be present somewhere in the settings inheritance. Files with higher `order` attribute values will override files with lower values.  Objects are merged recursively, Primitives and Arrays are overwritten.

*JSON settings file*
```
{
	"order": 0,
	"settings": {
		...
	}
}
```

###source
References to location of coded assets. All paths are relative to the directory containing `"Gruntfile.js"`.   
```
        "source": {
            "root": "source",
            "scripts": "source/scripts",
            "less": "source/less",
            "sass": "source/sass"
        }
```
| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| root | *path to source root* | √ | √ |
| scripts | *path to javascript source* | √ | √ |
| less | *path to less source* | less or sass | √ |
| sass | *path to sass source* | less or sass | √ |





###resource
References to locations of binary, file and image assets. All paths are relative to the directory containing `"Gruntfile.js"`.   
```
        "resource": {
            "root": "resource",
            "fonts": "resource/fonts",
            "images": "resource/images",
            "icons": "resource/icons",
            "sketch": "resource/sketch"
        }
```
| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| root | *path to resource root* | √ | √ |
| fonts | *path to fonts source* | √ | √ |
| images | *path to image source* | √ | √ |
| icons | *path to icons source* | √ | √ |
| sketch | *path to sketch source* | √ | √ |







###build
References to output paths. All paths are relative to the directory containing `"Gruntfile.js"`.   
```
        "build": {
            "root": "public",
            "scripts": "public/assets/scripts",
            "css": "public/assets/css",
            "fonts": "public/assets/fonts",
            "images": "public/assets/images"
        }
```
| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| root | *path to build root* | √ | √ |
| scripts | *path to build scripts* | √ | √ |
| css | *path to build css* | √ | √ |
| fonts | *path to build fonts* | √ | √ |
| images | *path to build images* | √ | √ |




###dependencies
`grunt-bower-map` is used to pick and place external dependency assets installed via bower.  There are five asset types that have been predefined for specifying options: js, less, sass, fonts, and images.  Files can be copied, renamed and even modified using the following configuration options.

```
        "dependencies": {
        	"path": "vendor"
            "shim": {},
            "map": {},
            "extensions": {},
            "replace": {}
        }
```
| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| vendorPath | the directory into which dependencies are copied within each asset type destination (default "vendor") | 	|√ 
| shim | *specify or override included files by package* |  | √ |
| extensions | *define file types to include by asset type* | | √ |
| map | *remap destination paths for included assets by asset type* |  | √ |
| replace | *define regex file content replacements by asset type by package* |  | √ |

#####asset type destinations
| Asset Type  | Path  |
|---------------|----------------|
| scripts    |   settings.source.scripts + "/" + settings.dependencies.path  |
| less    |   settings.source.less + "/" + settings.dependencies.path  |
| sass    |   settings.source.sass + "/" + settings.dependencies.path  |
| fonts    |   settings.build.fonts + "/" + settings.dependencies.path  |
| images    |   settings.build.images + "/" + settings.dependencies.path  |

#####extensions example
The values in extensions determines which types of files to include in the mapping operation.
```
            "extensions": {
                "scripts": ["js"],
                "less": ["less","css"],
                "sass": ["sass","css"],
                "fonts": ["woff","eot","ttf","svg"],
                "images": ["png","jpg","svg","gif"]
            }
```

#####shim example
Use *shim* to specify which files to include from each bower package if there is no `bower.json` file included or to override which files to include.
Attributes of the *shim* property should reference bower package names.  The attribute values can be an array of, or a single globbing pattern or string.  
```
        "dependencies": {
            "shim": {
                "flexslider": [
                    "flexslider.less",
                    "jquery.flexslider.js",
                    "fonts/*"
                ]
            }
        },
```
#####map example

Use *map* to copy dependencies to a specific location other than the default destination; files can also be renamed using *map*. Mappings must be specified per asset type and may be individual files or entire directories. All mappings are relative to the asset type's default destination directory as defined in grunt/configuration/bower.js.

*map entire directory*
```
        "dependencies": {
            "map": {
                "scripts":{
                    "package-name/": "/another-name",
                }
            }
        }
```

*rename single file*
```
        "dependencies": {
            "map": {
                "less":{
                    "normalize-css/normalize.css": "/normalize.less",
                }
            }
        }
```
#####replace example
Use replace to change values within external assets.  Replacements should be specifed per asset type per package name.  The values should take the form `RegEx Pattern (String)` : `replacement string`
```
        "dependencies": {
            "replace": {
                "less":{
                    "flexslider": {
                        "url\\('fonts/": "url('/assets/fonts/vendor/flexslider/"
                    },
                }
            }
        }
```

###style
The `style` attribute can be used to determine how source styles get compiled.
```
        "style": {
            "language": "<%= styleLanguage %>",
            "combine-media-queries": true,
            "optimize": true,
            "browsers": [
                "ie > 7",
                "Firefox > 3.5",
                "chrome > 9",
                "safari > 5"
            ],
            "files": [
            	"main"
            ]
        }
```

| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| language | `"less"` or `"sass"` | √ | √ |
| combine-media-queries | Boolean flag indicating whether to combine media queries (mobile first ordering) using cmq.  | √  | √ |
| optimize | Boolean flag indicating whether to compress and optimize css. If set to `true`, css output will be optimized with cssmin  | √  | √ |
| browsers | a browserlist style (https://github.com/ai/browserslist) array of browsers to autoprefix | √ | √ |
| files | an array of style source files to compile (extension omitted) | √ | √ |




###images
The `images` attribute can be used to determine the types of images to optimize and copy from the resource folder to the build folder.  
```
        "images": {
            "types": "png,jpg,jpeg,gif,svg,ico"
        }
```

| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| types | array of image extensions to compress | √ | √ |



###fonts
The `fonts` attribute can be used to generate web embeddable fonts and icon fonts. All font paths are relative to the `resource.fonts` path.
```
        "fonts": {
            "engine": "node",
            "iconFontName": "IconFont",
            "families": {
                "FontFamilyOne": {
                    "normal": {
                        "200": "FontOne-Light.ttf",
                        "400": "FontOne-Regular.ttf",
                        "700": "FontOne-Bold.ttf"
                    },
                    "italic": {
                        "200": "FontOne-LightItalic.ttf",
                        "400": "FontOne-RegularItalic.ttf",
                        "700": "FontOne-BoldItalic.ttf"
                    }
                },
                "FontFamilyTwo": {
                    "normal": {
                        "400": "font-src/FontTwo-Regular.ttf"
                    }
                }
            }
        }
```

| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| engine | `"fontforge"` or `"node"` | √ | √ |
| iconFontName | Font name to use for generated icons | √ | √ |
| families | map source ttfs to font-family names, styles, and weights.  The families attribute is required, but it can be left empty.| √ | √ |

##### font family definition structure
See https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight for weight mapping suggestions.
```
            "families": {
            	// 0-n occurances (unique names).  
            	//Any valid css font name, PascalCase is recomended
                "FontFamilyName": {  
                	//css font-weights               
                	"normal": {
                		"100": "path/to/font.ttf",
                		"200": "path/to/font.ttf",
                		"300": "path/to/font.ttf",
                		"400": "path/to/font.ttf", //normal
                		"500": "path/to/font.ttf",
                		"600": "path/to/font.ttf",
                		"700": "path/to/font.ttf", //bold
                		"800": "path/to/font.ttf",
                		"900": "path/to/font.ttf"
                    },
                    "italic": {
						...
                    }
                    "oblique": {
                        ...
                    }
                }
                
				...
				
            }
```

###scripts
The `scripts` attribute can be used to specify scripts to copy, concatenate, or compile using requireJS with or without AlmondJS.









