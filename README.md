[![Autism Ontario Logo](https://github.com/arelroche/autism-knowledge-base/blob/master/themes/default/public/images/autism-ontario-white.png)](http://www.autismontario.com/)

Autism Ontario Knowledge Base - https://desolate-reef-40746.herokuapp.com/

### Technology Used:
[Raneto](http://raneto.com): Free, open, simple Markdown powered Knowledgebase for Node.js
Heroku: Hosting our knowledge base
HTML, CSS, JS: Filtering methodology and landing page
StackEdit: Content Editing

### How does the knowledge base work?
#### Raneto
As a knowledge base, Raneto offers a very clean interface with two core features - ability to intelligently search for content within the knowledge base, and the ability to reveal or hide content based on certain flags. This allows for the easy addition and maintenance of content, while also being flexible enough to allow for additional functionality to be added on top.

All of the knowledge base articles are written and formatted using Markdown and stored directly in the git repository. The articles are stored in a folder structure, with the folders being treated as individual categories by Raneto.

#### Landing Page
The goal of our landing page is to identify who the visitors are that are visiting the knowledge base and make sure that that they are being served tailored information. The interactive selector allows users to select their user type, their purpose for visiting the knowledge base and where they are from. Based on these selections, a set of tags are passes to Raneto to determine which articles are served.

#### Filtering
Each article in the knowledge base is tagged with a set of keywords which is hidden from the visitor. Raneto has built-in functionality which allows individual artilces to be hidden based on certain flags being activated. This functionality was built upon, to reveal or hide pages based on which tags were obtained from the landing page selector.

#### Deploying
Any changes published to master are automatically deployed to Heroku.

### Adding content to the knowledge base?
Creating new articles or editing existing ones, can be handled in two ways - 

1. Directly in GitHub
For those comfortable with Markdown, a file can be created under the desired folder (or by creating a new folder) within /example/content and the content can be directly added.

2. StackEdit
StackEdit is a free online Markdown editor that features a rich-text editor. The editor also converts the formatting into Markdown in realtime while giving you a preview of the content. StackEdit can be connected direclty to the git repository and changes can be published directly to master if desired by setting the appropriate path (e.g. /example/content/folder-name/file-name.md) in the publish prompt.

Every article in the knowledge must have the following code block at the very top to ensure that it is tagged appropriately -
```
/* 
Title: Artile Title
Sort: 1 
article_tags: tag1,tag2 
*/
```


Credits
-------

Raneto was created by [Gilbert Pellegrom](http://gilbert.pellegrom.me) from [Dev7studios](http://dev7studios.co).  
Maintained by [Ryan Lelek](http://www.ryanlelek.com) from [AnsibleTutorials.com](http://www.ansibletutorials.com).  
Logo by [@mmamrila](https://github.com/mmamrila)  
Released under the [MIT license](https://raw.githubusercontent.com/gilbitron/Raneto/master/LICENSE).
