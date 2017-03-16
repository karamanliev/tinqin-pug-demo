# Layouts

## main-layout.pug - parent template

- **include** - allows you to insert the contents of one Pug file into another. We insert the *mixins.pug* content into the main layout, so we could use the mixins in the child templates.

- **blocks** - block is simply a “block” of Pug code that may be replaced within a child template. Pug blocks can provide default content if desired. Everything indented after the block command is going into that block and can be later called, using the *extends* syntax.

  ```javascript
  block config
    - var pageTitle = 'Web UI'
    - var pageTopText = 'UI elements'
    - var isThereHeader = true
  ```
    We can later use that block to chane variables' values in child templates.

  ```javascript
    block styles
  ```
    With this block we can add some custom css to the children templates.

  ```javascript
    block main
  ```
    With this block we can add a child template's content

  ```javascript
  block scripts
    include ../_components/scripts.pug
  ```
    We give default content to this block which is an include of the default scripts that we will have on every page. We can add more scripts to every other page without erasing the default value using the ***block append*** command.

- **variables** - same as less variables, can be overwritten in child templates.

- **if / else statements** - self explanatory. Used to specify if there will be a header or not in the child templates based on a config input.

  ```javascript
  if isThereHeader === true
    - var header = 'tq-with-header tq-with-primary-subheader'
  else
    - var header = ''
  ```
    We have a *header* variable in the .tq-content class, and if the statement is true it will replace that variable with the appropriate classes to add a header and subheader layout styling. Otherwise it will add nothing to the .tq-content class.

- **switch cases** - we check if *isThereHeader* statement is either true or false and respectively make it do different things based on that.

  ```javascript
  case isThereHeader
    when false
      - break
    when true
      block header
        include ../_components/header.pug
        include ../_components/sub-header.pug
  ```
    When *isThereHeader* is false we add nothing to the markup. If it returns true we will add a header block which will include the header and subheader components.

## mixins.pug - mixins demo

  We can use mixins to make a shortcut for a block of code, which we could use later. We can add arguments to those mixins as shown in sidebar.pug. I've added few mixins for default components.

  ```javascript
  mixin panel()
    .tq-panel
      .tq-grid.tq-gutter-all
        block
  ```
  Now we can add panels to our pages using ***+panel()*** syntax, while **block** states where the markup we add after calling the mixin goes.

# Components

## sub-header.pug / header.pug / scripts.pug

  Just some markup of the sub-header and header which we can include into pages. Scripts contains some default scripts like jquery and sidebar menu items active state which we need on every page.

## sidebar.pug

  - **mixin with arguments**

```javascript
li(class={'tq-selected': name === pageTitle})
```
Add a tq-selected class to the li if the name argument is equivalent to the pageTitle variable in the child temlate.

# Child templates

## index.pug

  - extends - extending the main-layout.pug gives us the ability to add or modify some content.

  - loops - we add a variable **indexComponents** and give it a list of few parameters. Then we make the loop, so for every parameter in this list we add a panel with the parameter as a mixin.

## accordion.pug / action-menu.pug

  We tell the child template that there will be no header, we add some content and we append the accordion / action-menu script to the default scripts.

## badge.pug

We add some custom styles using:

  ```javascript
  block styles
  ```
Then we include a .css file. We can include every file's content.

  ```javascript
  +panel
    p(
      id='idOfText'
      class='someDemoText'
      name='textName'
      style={background: 'teal', padding: '80px'}
    )
      include text/sometext.txt
    ```
 Here we add a paragraph with some attributes and include a .txt file.
