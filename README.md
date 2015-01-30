#web-template
============

##Overview
The goal of this template is to create a consistent framework for front-end web and application development and implement tools to facilitate best practices through the use of automation and templates.

Common front-end processes have been automated using `grunt`, but the configuration of those taks has been streamlined and moved to a JSON settings file. The majority of projects can be configured via this JSON file without any changes to the underlying grunt task configurations.  Additionally these settings files can be overridden in order to provide environment specific settings variations.


##Setup
Todo: create `yo generator` to initialize a new project

##Basic Configuration
Configuration files can be expressed as JSON or JS files and must be referenced in order of precedence in `"Gruntfile.js"`.  Attributes marked as required must be present somewhere in the settings inheritance.

*JSON settings file*
```
{
	"settings": {
		...
	}
}
```
*JS settings file*
```
module.exports = {
	settings: {
		...
	}
}
```


### source paths
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





###resource paths
References to locations of binary, file and image assets. All paths are relative to the directory containing `"Gruntfile.js"`.   
```
        "resources": {
            "root": "resources",
            "fonts": "resources/fonts",
            "images": "resources/images",
            "icons": "resources/icons",
            "sketch": "resources/sketch"
        }
```
| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| root | *path to resource root* | √ | √ |
| fonts | *path to fonts source* | √ | √ |
| images | *path to image source* | √ | √ |
| icons | *path to icons source* | √ | √ |
| sketch | *path to sketch source* | √ | √ |







###build paths
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
`grunt-bower-map` is used to pick and place external dependency assets installed via bower.  There are seven asset types that have been predefined for specifying options including js, less, sass, fonts, and images.  Files can be copied, renamed and even modified.

```
        "dependencies": {
            "shim": {},
            "map": {},
            "extensions": {},
            "replace": {}
        }
```
| Attribute  | Description | required | inheritable |
|------------|-------------|----------|-------------|
| vendorPath | the directory into which dependencies are copied (default "vendor") | √	|√ 
| shim | *specify or override included files by package* |  | √ |
| extensions | *define file types to include by asset type* | | √ |
| map | *remap destination paths for included assets by asset type* |  | √ |
| replace | *define regex file content replacements by asset type by package* |  | √ |

#####extensions example
The values of extensions determines which types of files to include in the mapping operation.
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
Use replace to change values within external assets.  Replacements should be specifed per asset type per package name.  The values should take the form `RegEx String` : `replacement string`
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