# MyTimePlan

Simple application to create type connection view on the board in the browser.
It has been deployed to github-pages and live preview is avialable (here)[https://ebi2626.github.io/myTimePlan/].

## Usage

Main functionalities:
- creating types
- manage types on the board (location and visible instances)
- connect types
- define max connection of type
- preview data in the console

On the main board there are 4 buttons:
- Log data - allow us to display data in the console to verify is everything works well behind the scene
- Settings - allow us to define maximum connection number between types (it could be extended in the future)
- Use existing type - allow us to put on the board one of already created types
- Add new type - allow us to define new typ and automatically put it on the board

### Type
Each created object we are calling "type", because it's structure representing some type in object-oriented programming manner.
Each type includes of:
- id - unique value to identify it
- name - field for name of the type (used in "Use existing type" popup)
- fields - list of custom fields added by the user with given names

### Type on the board
Types on the board aren't the same as types described above. When we are working with board, we aren't using created types directly,
because they are some kind of "templates" for type instances located on the board. It allow us to place few instances of the same type
on the board in the same time. Beside values and fields inherited from "Type" structure, type on the board includes of:
- instanceId - unique value to recognize different instances of the same type on the board

## Development info
- Angular version 17.3.7
- Node version 20.13.1
- NPM version 10.5.2
